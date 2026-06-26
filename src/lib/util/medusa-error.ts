import { translateCheckoutError } from "./checkout-error"

export function extractMedusaErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return translateCheckoutError(String(error))
  }

  const err = error as {
    message?: string
    response?: { data?: { message?: unknown } | unknown }
    config?: { url?: string; baseURL?: string }
  }

  if (err.response?.data) {
    const data = err.response.data as { message?: unknown }
    const message = data?.message ?? err.response.data
    const raw =
      typeof message === "string" ? message : JSON.stringify(message)
    return translateCheckoutError(raw)
  }

  return translateCheckoutError(err.message || String(error))
}

export function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false
  const digest = "digest" in error ? String((error as { digest?: string }).digest) : ""
  return digest.startsWith("NEXT_REDIRECT")
}

export default function medusaError(error: unknown): never {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response?: unknown }).response
  ) {
    const err = error as {
      response: { data?: unknown; status?: number; headers?: unknown }
      config?: { url?: string; baseURL?: string }
    }

    try {
      if (err.config?.url) {
        const u = new URL(err.config.url, err.config.baseURL || undefined)
        console.error("Resource:", u.toString())
      }
    } catch {
      // ignore malformed config
    }

    console.error("Response data:", err.response.data)
    console.error("Status code:", err.response.status)
    console.error("Headers:", err.response.headers)
  }

  throw new Error(extractMedusaErrorMessage(error))
}
