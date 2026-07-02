import type { Metadata } from "next"
import {
  buildStorePriceOffers,
  deriveMetalDisplayPrices,
  getPriceValidUntil,
} from "@lib/metals/derive-prices"
import type { MetalsData } from "@lib/metals/types"
import { SITE_URL, absolutePublicUrl, canonicalUrl } from "@lib/util/site-url"

export type MetalPricePageKey =
  | "store-gold-prices"
  | "international-gold-prices"
  | "gold-price-chart"

export type MetalPricePageConfig = {
  key: MetalPricePageKey
  path: `/${string}`
  name: string
  h1: string
  subtitle: string
  title: string
  description: string
  keywords: string[]
  ogImageAlt: string
}

/** Footer 金價專頁（不進 navbar，供 Sitelinks 與站內連結） */
export const METAL_PRICE_FOOTER_PAGES: MetalPricePageConfig[] = [
  {
    key: "store-gold-prices",
    path: "/store-gold-prices",
    name: "實體門市牌告價",
    h1: "唐宋珠寶實體門市牌告價",
    subtitle: "新台幣 / 台錢｜黃金賣出與回收參考價格",
    title: "實體門市牌告價 | 今日黃金回收價、賣出牌價 (台錢) | 唐宋珠寶",
    description:
      "唐宋珠寶台北萬華實體門市牌告價：黃金賣出牌價、黃金條塊回收價、飾金回收價、18K/14K金、白銀、白金、鈀金即時參考價格（新台幣/台錢）。",
    keywords: [
      "門市牌告價",
      "今日黃金回收價",
      "黃金賣出牌價",
      "黃金條塊回收價",
      "飾金回收價",
      "18K金回收價",
      "台北黃金回收",
      "唐宋珠寶牌價",
    ],
    ogImageAlt: "唐宋珠寶實體門市黃金牌告價",
  },
  {
    key: "international-gold-prices",
    path: "/international-gold-prices",
    name: "國際現貨金價",
    h1: "國際現貨金價及貴金屬即時行情",
    subtitle: "新台幣 / 台錢｜黃金、白金、白銀、鈀金買入賣出參考",
    title: "國際現貨金價 | 黃金白金白銀鈀金即時行情 (台錢) | 唐宋珠寶",
    description:
      "唐宋珠寶國際現貨金價：黃金 Au、白金 Pt、白銀 Ag、鈀金 Pd 即時買入賣出參考價、漲跌與本日高低估位（新台幣/台錢），每日更新。",
    keywords: [
      "國際現貨金價",
      "今日金價",
      "黃金行情",
      "白金價格",
      "白銀價格",
      "鈀金價格",
      "貴金屬即時行情",
      "唐宋珠寶金價",
    ],
    ogImageAlt: "唐宋珠寶國際現貨金價即時行情",
  },
  {
    key: "gold-price-chart",
    path: "/gold-price-chart",
    name: "貴金屬走勢圖",
    h1: "國際貴金屬走勢圖",
    subtitle: "黃金現貨 / 美元即時 K 線圖｜專業技術分析",
    title: "國際貴金屬走勢圖 | 黃金現貨即時 K 線圖 | 唐宋珠寶",
    description:
      "唐宋珠寶國際貴金屬走勢圖：黃金現貨/美元即時 K 線、1小時與日內行情，搭配技術指標參考國際金價走勢。",
    keywords: [
      "國際貴金屬走勢圖",
      "黃金走勢圖",
      "黃金K線",
      "國際金價圖表",
      "黃金現貨行情",
      "今日金價走勢",
      "唐宋珠寶金價圖",
    ],
    ogImageAlt: "唐宋珠寶國際貴金屬走勢圖",
  },
]

const OG_IMAGE = `${SITE_URL}/images/0001.jpg`
const WEBSITE_ID = `${SITE_URL}/#website`
const STORE_ID = `${SITE_URL}/#store`

export function getMetalPricePageConfig(
  key: MetalPricePageKey
): MetalPricePageConfig {
  const config = METAL_PRICE_FOOTER_PAGES.find((page) => page.key === key)
  if (!config) {
    throw new Error(`Unknown metal price page: ${key}`)
  }
  return config
}

export function buildMetalPricePageMetadata(key: MetalPricePageKey): Metadata {
  const page = getMetalPricePageConfig(key)

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: canonicalUrl(page.path),
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: absolutePublicUrl(page.path),
      siteName: "唐宋珠寶",
      locale: "zh_TW",
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: page.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

function buildOfferCatalogFromStorePrices(metals: MetalsData | null | undefined) {
  const prices = metals ? deriveMetalDisplayPrices(metals) : null
  if (!prices) return null

  const offers = buildStorePriceOffers(prices)
  if (offers.length === 0) return null

  const updateTime = prices.updateTime
  const priceValidUntil = getPriceValidUntil(updateTime)

  return {
    "@type": "OfferCatalog",
    name: "唐宋珠寶實體門市牌告價",
    description: `唐宋珠寶門市牌告價，資料更新：${new Date(updateTime).toLocaleString("zh-TW")}。單位：新台幣/台錢。`,
    itemListElement: offers.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: item.name,
        price: String(item.price),
        priceCurrency: "TWD",
        priceValidUntil,
        availability: "https://schema.org/InStock",
        seller: { "@id": STORE_ID },
      },
    })),
  }
}

function buildInternationalOfferCatalog(
  metals: MetalsData | null | undefined
) {
  const prices = metals ? deriveMetalDisplayPrices(metals) : null
  if (!prices) return null

  const rows = [
    { name: "黃金 Au 買入", price: prices.intlGoldBuy },
    { name: "黃金 Au 賣出", price: prices.intlGoldSell },
    { name: "白金 Pt 買入", price: prices.intlPtBuy },
    { name: "白金 Pt 賣出", price: prices.intlPtSell },
    { name: "白銀 Ag 買入", price: prices.intlAgBuy },
    { name: "白銀 Ag 賣出", price: prices.intlAgSell },
    { name: "鈀金 Pd 買入", price: prices.intlPdBuy },
    { name: "鈀金 Pd 賣出", price: prices.intlPdSell },
  ].filter((row) => row.price > 0)

  if (rows.length === 0) return null

  const priceValidUntil = getPriceValidUntil(prices.updateTime)

  return {
    "@type": "OfferCatalog",
    name: "唐宋珠寶國際現貨金價及貴金屬行情",
    description: `國際現貨金價參考（新台幣/台錢），更新：${new Date(prices.updateTime).toLocaleString("zh-TW")}。`,
    itemListElement: rows.map((row, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: row.name,
        price: String(row.price),
        priceCurrency: "TWD",
        priceValidUntil,
        seller: { "@id": STORE_ID },
      },
    })),
  }
}

export function buildMetalPricePageSchemaGraph(
  key: MetalPricePageKey,
  metals?: MetalsData | null
) {
  const page = getMetalPricePageConfig(key)
  const pageUrl = absolutePublicUrl(page.path)
  const pageId = `${pageUrl}#webpage`

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首頁", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: page.name, item: pageUrl },
      ],
    },
    {
      "@type": "WebPage",
      "@id": pageId,
      url: pageUrl,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": STORE_ID },
      inLanguage: "zh-TW",
      ...(metals?.fetch_timestamp || metals?.updated_at
        ? { dateModified: metals.fetch_timestamp ?? metals.updated_at }
        : {}),
    },
    {
      "@type": "SiteNavigationElement",
      "@id": `${pageUrl}#navigation`,
      name: page.name,
      description: page.description,
      url: pageUrl,
      isPartOf: { "@id": WEBSITE_ID },
    },
  ]

  if (key === "store-gold-prices") {
    const catalog = buildOfferCatalogFromStorePrices(metals)
    if (catalog) graph.push(catalog)
  }

  if (key === "international-gold-prices") {
    const catalog = buildInternationalOfferCatalog(metals)
    if (catalog) graph.push(catalog)
  }

  if (key === "gold-price-chart") {
    graph.push({
      "@type": "Dataset",
      name: "國際黃金現貨走勢圖",
      description:
        "黃金現貨/美元（OANDA:XAUUSD）即時 K 線圖，供投資人與貴金屬買賣參考。",
      url: pageUrl,
      creator: { "@id": STORE_ID },
      inLanguage: "zh-TW",
    })
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  }
}
