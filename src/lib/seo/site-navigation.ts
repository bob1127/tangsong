import { absolutePublicUrl } from "@lib/util/site-url"

/** 全站主導覽（與 header 一致），供 JSON-LD SiteNavigationElement 與首頁導覽區塊共用 */
export type SiteNavLink = {
  name: string
  path: string
  description: string
}

export const PRIMARY_SITE_LINKS: SiteNavLink[] = [
  {
    name: "關於我們",
    path: "/about",
    description:
      "唐宋珠寶深耕台北萬華龍山寺商圈，專業 XRF 黃金鑑定與高價收購服務介紹。",
  },
  {
    name: "收購流程",
    path: "/purchase-process",
    description:
      "黃金回收、K金收購、鉑金回收的完整流程說明，公開透明、現場估價。",
  },
  {
    name: "商品資訊",
    path: "/store",
    description: "精選黃金飾品、珠寶與名錶，即時金價參考與線上瀏覽。",
  },
  {
    name: "聯絡我們",
    path: "/contact",
    description:
      "預約黃金鑑定、回收諮詢與門市服務，電話 02-2306-9928 或線上表單。",
  },
  {
    name: "收購項目",
    path: "/purchase-categories",
    description: "黃金、K金、鉑金、鑽石、名錶等貴金屬與珠寶收購項目一覽。",
  },
  {
    name: "專欄文章",
    path: "/blog",
    description: "黃金回收、今日金價、珠寶知識與市場動態專業文章。",
  },
]

export function siteNavAbsoluteUrl(path: string): string {
  return absolutePublicUrl(path)
}
