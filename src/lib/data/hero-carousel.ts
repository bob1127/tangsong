export const DEFAULT_HERO_CAROUSEL_SLIDES = [
  "/images/e48dcfbd-a446-4d95-98e0-1e92f6a16047.png",
  "/images/0001.jpg",
  "/images/18e59f52-18b7-413b-a783-ff21e3c51ad3.png",
  "/images/0002.jpg",
] as const

function getPrimaryBackendUrl(): string {
  return (
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"
  ).replace(/\/$/, "")
}

function getPublishableKey(): string {
  return process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
}

function getBackendCandidates(preferLocal = false): string[] {
  const primary = getPrimaryBackendUrl()
  const local = "http://localhost:9000"
  const candidates = preferLocal ? [local, primary] : [primary]

  if (
    process.env.NODE_ENV === "development" &&
    primary !== local &&
    !candidates.includes(local)
  ) {
    candidates.push(local)
  }

  return candidates
}

function resolveSlides(configured: unknown): string[] {
  const items = Array.isArray(configured) ? configured : []

  return DEFAULT_HERO_CAROUSEL_SLIDES.map((fallback, index) => {
    const url = items[index]
    return typeof url === "string" && url.trim() ? url.trim() : fallback
  })
}

async function fetchSlidesFromBackend(
  baseUrl: string
): Promise<string[] | null> {
  const res = await fetch(`${baseUrl}/store/hero-carousel`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": getPublishableKey(),
    },
    cache: "no-store",
  })

  if (!res.ok) return null

  const contentType = res.headers.get("content-type")
  if (!contentType?.includes("application/json")) return null

  const json = await res.json()
  if (!json.success || !Array.isArray(json.images)) return null

  return resolveSlides(json.images)
}

export async function getHeroCarouselSlides(
  options: { preferLocal?: boolean } = {}
): Promise<string[]> {
  for (const baseUrl of getBackendCandidates(options.preferLocal)) {
    try {
      const slides = await fetchSlidesFromBackend(baseUrl)
      if (slides) return slides
    } catch {
      // 嘗試下一個 backend
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[hero-carousel] 無法從後端讀取輪播圖，使用預設圖。若使用 Railway，請部署含 /store/hero-carousel 的後端版本。"
    )
  }

  return [...DEFAULT_HERO_CAROUSEL_SLIDES]
}

/** 瀏覽器端重新抓取（開發時優先 localhost） */
export async function fetchHeroCarouselSlidesClient(): Promise<string[]> {
  if (typeof window === "undefined") {
    return getHeroCarouselSlides()
  }

  const primary =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.replace(/\/$/, "") ||
    "http://localhost:9000"
  const local = "http://localhost:9000"
  const isDev = process.env.NODE_ENV === "development"
  const candidates = isDev && primary !== local ? [local, primary] : [primary]

  for (const baseUrl of candidates) {
    try {
      const res = await fetch(`${baseUrl}/store/hero-carousel`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": getPublishableKey(),
        },
        cache: "no-store",
      })

      if (!res.ok) continue

      const contentType = res.headers.get("content-type")
      if (!contentType?.includes("application/json")) continue

      const json = await res.json()
      if (!json.success || !Array.isArray(json.images)) continue

      return resolveSlides(json.images)
    } catch {
      // 嘗試下一個 backend
    }
  }

  return [...DEFAULT_HERO_CAROUSEL_SLIDES]
}
