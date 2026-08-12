import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = (
  process.env.NEXT_PUBLIC_DEFAULT_REGION || "tw"
).toLowerCase()

const regionMapCache = {
  regionMap: new Map<string, true>(),
  regionMapUpdated: 0,
}

async function getRegionMap() {
  const now = Date.now()
  const hasCache = regionMapCache.regionMap.size > 0
  const isFresh = now - regionMapCache.regionMapUpdated < 3600 * 1000

  if (hasCache && isFresh) {
    return regionMapCache.regionMap
  }

  if (!BACKEND_URL) {
    return regionMapCache.regionMap
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    const response = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY || "",
      },
      signal: controller.signal,
      cache: "no-store",
    })

    clearTimeout(timeout)

    if (!response.ok) {
      throw new Error(`regions HTTP ${response.status}`)
    }

    const json = (await response.json()) as {
      regions?: Array<{ countries?: Array<{ iso_2?: string | null }> }>
    }

    if (!json.regions?.length) {
      throw new Error("No regions in response")
    }

    const nextMap = new Map<string, true>()
    json.regions.forEach((region) => {
      region.countries?.forEach((c) => {
        if (c.iso_2) nextMap.set(c.iso_2.toLowerCase(), true)
      })
    })

    regionMapCache.regionMap = nextMap
    regionMapCache.regionMapUpdated = now
  } catch (error) {
    console.error("Middleware: regions fetch failed, using fallback.", error)
  }

  return regionMapCache.regionMap
}

function resolveCountryCode(
  request: NextRequest,
  regionMap: Map<string, true>
) {
  const vercelCountryCode = request.headers
    .get("x-vercel-ip-country")
    ?.toLowerCase()
  const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

  if (urlCountryCode && regionMap.has(urlCountryCode)) {
    return urlCountryCode
  }
  if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
    return vercelCountryCode
  }
  if (regionMap.has(DEFAULT_REGION)) {
    return DEFAULT_REGION
  }

  const first = regionMap.keys().next().value
  return first || DEFAULT_REGION
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

    const cacheIdCookie = request.cookies.get("_medusa_cache_id")
    const cacheId = cacheIdCookie?.value || crypto.randomUUID()

    const regionMap = await getRegionMap()
    const countryCode = resolveCountryCode(request, regionMap)

    if (firstSegment === countryCode) {
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
    const response = NextResponse.rewrite(
      new URL(`/${countryCode}${redirectPath}${queryString}`, request.url)
    )

    if (!cacheIdCookie) {
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
    }

    return response
  } catch (error) {
    console.error("Middleware: fatal fallback rewrite.", error)
    const pathname = request.nextUrl.pathname
    const redirectPath = pathname === "/" ? "" : pathname
    const queryString = request.nextUrl.search
    return NextResponse.rewrite(
      new URL(`/${DEFAULT_REGION}${redirectPath}${queryString}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
