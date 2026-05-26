import { GoogleTagManager } from "@next/third-parties/google"

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

/**
 * GTM 僅在設定 NEXT_PUBLIC_GTM_ID 時載入。
 * @next/third-parties 使用 afterInteractive，不阻塞 LCP / 首屏 HTML。
 */
export function Gtm() {
  if (!GTM_ID) {
    return null
  }

  return <GoogleTagManager gtmId={GTM_ID} />
}
