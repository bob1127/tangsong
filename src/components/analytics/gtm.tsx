/**
 * Google 官方安裝片段（SSR 輸出到 HTML），供 GTM 後台「測試網站」與爬蟲偵測。
 * 需設定 NEXT_PUBLIC_GTM_ID（Vercel 正式環境也要設定）。
 *
 * 不使用 @next/third-parties：該套件為 client-only，且不含 <noscript> iframe。
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim()

function gtmScriptHtml(id: string) {
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`
}

/** 放在 <head> 內，愈前面愈好 */
export function GtmHead() {
  if (!GTM_ID) {
    return null
  }

  return (
    <script
      dangerouslySetInnerHTML={{ __html: gtmScriptHtml(GTM_ID) }}
    />
  )
}

/** 放在 <body> 開頭（對應 Google 安裝說明第 2 段 noscript） */
export function GtmBody() {
  if (!GTM_ID) {
    return null
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  )
}
