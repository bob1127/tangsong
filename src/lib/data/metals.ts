import type { MetalsData } from "@lib/metals/types"

function getBackendUrl(): string {
  return (
    process.env.MEDUSA_BACKEND_URL ||
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    "http://localhost:9000"
  )
}

function getPublishableKey(): string {
  return process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
}

export async function getLatestMetals(): Promise<MetalsData | null> {
  try {
    const res = await fetch(`${getBackendUrl()}/store/metals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": getPublishableKey(),
      },
      next: { revalidate: 60 },
    })

    if (!res.ok) return null

    const contentType = res.headers.get("content-type")
    if (!contentType?.includes("application/json")) return null

    const json = await res.json()
    if (!json.success) return null

    const latest = Array.isArray(json.data) ? json.data[0] : json.data
    return latest ?? null
  } catch {
    return null
  }
}
