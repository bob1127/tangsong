import type { MetalsData } from "./types"

const LOCAL_BACKEND = "http://localhost:9000"

function getPrimaryBackendUrl(): string {
  return (
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    LOCAL_BACKEND
  ).replace(/\/$/, "")
}

function getPublishableKey(): string {
  return process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
}

function shouldPreferLocalBackend(): boolean {
  return (
    process.env.NODE_ENV === "development" &&
    getPrimaryBackendUrl() !== LOCAL_BACKEND
  )
}

async function fetchStorePricesUpdatedAt(
  baseUrl: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `${baseUrl}/store/metal-settings?nocache=${Date.now()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": getPublishableKey(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        cache: "no-store",
      }
    )

    if (!res.ok) return null

    const json = await res.json()
    if (!json.success) return null

    return json.store_prices_updated_at ?? json.updated_at ?? null
  } catch {
    return null
  }
}

function mergeStorePricesUpdatedAt(
  metals: MetalsData | null,
  updatedAt: string | null
): MetalsData | null {
  if (!metals) return null
  if (metals.store_prices_updated_at) return metals
  if (!updatedAt) return metals
  return { ...metals, store_prices_updated_at: updatedAt }
}

async function fetchMetalsFromUrl(
  baseUrl: string,
  query = ""
): Promise<MetalsData | null> {
  const suffix = query || `?nocache=${Date.now()}`
  const [metalsRes, storeUpdatedAt] = await Promise.all([
    fetch(`${baseUrl}/store/metals${suffix}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": getPublishableKey(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
      cache: "no-store",
    }),
    fetchStorePricesUpdatedAt(baseUrl),
  ])

  if (!metalsRes.ok) return null

  const contentType = metalsRes.headers.get("content-type")
  if (!contentType?.includes("application/json")) return null

  const json = await metalsRes.json()
  if (!json.success) return null

  const latest = Array.isArray(json.data) ? json.data[0] : json.data
  return mergeStorePricesUpdatedAt(latest ?? null, storeUpdatedAt)
}

type FetchLatestMetalsOptions = {
  query?: string
  revalidate?: number | false
}

/** 伺服器端：開發時若後台在 localhost，優先讀本機後端 */
export async function fetchLatestMetals(
  options: FetchLatestMetalsOptions = {}
): Promise<MetalsData | null> {
  const { query = "", revalidate = false } = options
  const primary = getPrimaryBackendUrl()
  const nocache = query || `?nocache=${Date.now()}`

  if (shouldPreferLocalBackend()) {
    try {
      const local = await fetchMetalsFromUrl(LOCAL_BACKEND, nocache)
      if (local) return local
    } catch {
      // fallback to primary
    }
  }

  try {
    const fetchOptions =
      typeof window === "undefined" && revalidate !== false
        ? { next: { revalidate } }
        : { cache: "no-store" as const }

    const res = await fetch(`${primary}/store/metals${nocache}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": getPublishableKey(),
      },
      ...fetchOptions,
    })

    if (!res.ok) return null

    const contentType = res.headers.get("content-type")
    if (!contentType?.includes("application/json")) return null

    const json = await res.json()
    if (!json.success) return null

    const latest = Array.isArray(json.data) ? json.data[0] : json.data
    const storeUpdatedAt = await fetchStorePricesUpdatedAt(primary)
    return mergeStorePricesUpdatedAt(latest ?? null, storeUpdatedAt)
  } catch {
    return null
  }
}

/** 瀏覽器端：開發時優先 localhost（與後台 admin 同一資料庫） */
export async function fetchLatestMetalsClient(): Promise<MetalsData | null> {
  const primary = getPrimaryBackendUrl()
  const nocache = `?nocache=${Date.now()}`

  if (shouldPreferLocalBackend()) {
    try {
      const local = await fetchMetalsFromUrl(LOCAL_BACKEND, nocache)
      if (local) return local
    } catch {
      // fallback to primary
    }
  }

  return fetchMetalsFromUrl(primary, nocache)
}
