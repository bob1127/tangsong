import { NextRequest, NextResponse } from "next/server"

const DEFAULT_REGION = (
  process.env.NEXT_PUBLIC_DEFAULT_REGION || "tw"
).toLowerCase()

/**
 * Keep middleware offline-safe: never call the Medusa backend here.
 * Region routing for the Taiwan storefront is fixed to DEFAULT_REGION.
 * Backend outages must not take down the whole site.
 */
export async function middleware(request: NextRequest) {
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

  // Already rewritten path like /tw/... should not appear publicly,
  // but if it somehow does and isn't DEFAULT_REGION, continue.
  if (firstSegment && firstSegment.length === 2 && firstSegment !== DEFAULT_REGION) {
    return NextResponse.next()
  }

  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheIdCookie?.value || crypto.randomUUID()
  const redirectPath = pathname === "/" ? "" : pathname
  const queryString = request.nextUrl.search

  const response = NextResponse.rewrite(
    new URL(`/${DEFAULT_REGION}${redirectPath}${queryString}`, request.url)
  )

  if (!cacheIdCookie) {
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
