/**
 * 對外網址與 Medusa 內部 countryCode 分離。
 * 台灣站（tw）對外不顯示 /tw，API 與路由仍使用 countryCode。
 */

export const PRIMARY_COUNTRY_CODE = (
  process.env.NEXT_PUBLIC_DEFAULT_REGION || "tw"
).toLowerCase()

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://www.tangsong.com.tw"
).replace(/\/$/, "")

export function isPrimaryMarket(countryCode?: string | null): boolean {
  return (
    (countryCode ?? PRIMARY_COUNTRY_CODE).toLowerCase() ===
    PRIMARY_COUNTRY_CODE
  )
}

/** 使用者看到的 path（不含 /tw 等國碼前綴） */
export function publicPath(
  path: string,
  countryCode?: string | null
): string {
  const normalized = path.startsWith("/") ? path : `/${path}`

  if (isPrimaryMarket(countryCode)) {
    return normalized
  }

  const cc = (countryCode ?? PRIMARY_COUNTRY_CODE).toLowerCase()
  if (normalized === "/") {
    return `/${cc}`
  }
  return `/${cc}${normalized}`
}

/** SEO canonical / Open Graph 絕對網址 */
export function canonicalUrl(path: string): string {
  const p = publicPath(path, PRIMARY_COUNTRY_CODE)
  return `${SITE_URL}${p === "/" ? "" : p}`
}

/** 結構化資料、分享連結等絕對 URL */
export function absolutePublicUrl(
  path: string,
  countryCode?: string | null
): string {
  return `${SITE_URL}${publicPath(path, countryCode)}`
}
