import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"
import { PRIMARY_COUNTRY_CODE } from "@lib/util/site-url"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = PRIMARY_COUNTRY_CODE

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    console.error(
      "Middleware.ts: MEDUSA_BACKEND_URL is not set. Falling back to default region."
    )
    return regionMapCache.regionMap
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY || "",
        },
        next: {
          revalidate: 3600,
          tags: [`regions-${cacheId}`],
        },
        cache: "force-cache",
      })

      const json = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(
          typeof json?.message === "string"
            ? json.message
            : `Failed to fetch regions (${response.status})`
        )
      }

      const regions = json.regions as HttpTypes.StoreRegion[] | undefined

      if (!regions?.length) {
        throw new Error("No regions found in Medusa response.")
      }

      regionMapCache.regionMap.clear()
      regions.forEach((region) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? "", region)
        })
      })

      regionMapCache.regionMapUpdated = Date.now()
    } catch (error) {
      console.error(
        "Middleware.ts: Failed to fetch regions from backend. Using fallback.",
        error
      )
      // Keep any previously cached map; otherwise leave empty and fall back later.
      regionMapCache.regionMapUpdated = Date.now()
    }
  }

  return regionMapCache.regionMap
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    } else {
      // Backend down / empty region map: keep storefront reachable
      countryCode = DEFAULT_REGION
    }

    return countryCode
  } catch (error) {
    console.error("Middleware.ts: Error resolving country code.", error)
    return DEFAULT_REGION
  }
}

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname

    if (pathname.includes(".")) {
      return NextResponse.next()
    }

    const segments = pathname.split("/").filter(Boolean)
    const firstSegment = segments[0]?.toLowerCase()

    // SEO：舊網址 /tw/* 永久導向至無前綴版本
    if (firstSegment === DEFAULT_REGION) {
      const stripped =
        segments.length > 1 ? `/${segments.slice(1).join("/")}` : "/"
      const destination = new URL(stripped, request.url)
      destination.search = request.nextUrl.search
      return NextResponse.redirect(destination, 301)
    }

    let cacheIdCookie = request.cookies.get("_medusa_cache_id")
    let cacheId = cacheIdCookie?.value || crypto.randomUUID()

    const regionMap = await getRegionMap(cacheId)
    const countryCode =
      (regionMap && (await getCountryCode(request, regionMap))) ||
      DEFAULT_REGION

    const urlHasCountryCode = countryCode && firstSegment === countryCode

    if (urlHasCountryCode) {
      const response = NextResponse.next()
      if (!cacheIdCookie) {
        response.cookies.set("_medusa_cache_id", cacheId, {
          maxAge: 60 * 60 * 24,
        })
      }
      return response
    }

    const redirectPath = pathname === "/" ? "" : pathname
    const queryString = request.nextUrl.search

    const internalUrl = new URL(
      `/${countryCode}${redirectPath}${queryString}`,
      request.url
    )
    const response = NextResponse.rewrite(internalUrl)

    if (!cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
    }
    return response
  } catch (error) {
    console.error("Middleware.ts: Unhandled error, falling back.", error)

    const pathname = request.nextUrl.pathname
    const redirectPath = pathname === "/" ? "" : pathname
    const queryString = request.nextUrl.search
    const internalUrl = new URL(
      `/${DEFAULT_REGION}${redirectPath}${queryString}`,
      request.url
    )
    return NextResponse.rewrite(internalUrl)
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
