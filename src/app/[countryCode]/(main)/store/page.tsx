import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

// 🚀 關鍵修改 2：加入這行，強制整個 Store 頁面使用動態渲染 (SSR)，確保每次造訪都能看到最新商品
export const dynamic = "force-dynamic"

// ==========================
// 1. 商城頁面 SEO 設定 (強化版 Metadata)
// ==========================
export const metadata: Metadata = {
  title: "線上商城 | 嚴選黃金、K金、鑽石首飾 | 唐宋珠寶 Tangsong",
  description:
    "探索唐宋珠寶為您精選的貴金屬與珠寶首飾。從 9999 純金項鍊、結婚金飾到客製化鑽戒，每件作品皆經過嚴格鑑定，提供最高品質的佩戴體驗。",
  openGraph: {
    title: "線上商城 | 嚴選黃金、K金、鑽石首飾 | 唐宋珠寶 Tangsong",
    description:
      "探索唐宋珠寶為您精選的貴金屬與珠寶首飾。從 9999 純金項鍊、結婚金飾到客製化鑽戒，為您提供最安心的鑑賞服務。",
    url: "https://www.tangsong.com.tw/store", // 視實際網址調整
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "唐宋珠寶線上商城",
      },
    ],
  },
}

// ==========================
// 2. 結構化資料 (分類集合頁與商品清單)
// ==========================
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "唐宋珠寶線上商城",
  description:
    "探索唐宋珠寶為您精選的貴金屬與珠寶首飾。從 9999 純金項鍊、結婚金飾到客製化鑽戒。",
  url: "https://www.tangsong.com.tw/store",
  image:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
}

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Product",
        name: "9999純金首飾系列",
        url: "https://www.tangsong.com.tw/store",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Product",
        name: "鉑金/K金婚戒",
        url: "https://www.tangsong.com.tw/store",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Product",
        name: "嚴選鑽石項鍊",
        url: "https://www.tangsong.com.tw/store",
      },
    },
  ],
}

const combinedSchemas = [collectionSchema, itemListSchema]

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  return (
    <>
      {/* 🚀 注入 JSON-LD 結構化資料 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchemas) }}
      />

      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </>
  )
}
