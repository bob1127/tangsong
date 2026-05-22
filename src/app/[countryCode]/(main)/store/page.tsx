import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"

// ISR：商城頁每 60 秒重新驗證，後台新增/下架商品 60 秒內前端可見
export const revalidate = 60

const BASE_URL = "https://www.tangsong.com.tw"

// ==========================
// 1. 商城頁面 SEO 設定
// ==========================
export const metadata: Metadata = {
  title: "線上商城 | 黃金、K金、鑽石、鉑金珠寶首飾 | 唐宋珠寶 Tangsong",
  description:
    "唐宋珠寶線上商城，精選9999純金項鍊、黃金手鐲、K金戒指、鉑金婚戒、鑽石套組等珠寶首飾。每件商品均經專業鑑定，提供黃金回收、舊金換新、客製化訂製服務，台北萬華區實體門市值得信賴。",
  keywords: [
    "黃金珠寶",
    "黃金首飾",
    "K金戒指",
    "鉑金婚戒",
    "鑽石項鍊",
    "9999純金",
    "黃金手鐲",
    "結婚金飾",
    "珠寶首飾",
    "台北珠寶",
    "唐宋珠寶",
    "萬華銀樓",
    "黃金買賣",
    "黃金回收",
  ],
  openGraph: {
    title: "線上商城 | 黃金、K金、鑽石、鉑金珠寶首飾 | 唐宋珠寶 Tangsong",
    description:
      "精選9999純金、K金、鉑金婚戒、鑽石珠寶等首飾。台北萬華實體銀樓，每件商品嚴格鑑定，提供免費諮詢與客製化服務。",
    url: `${BASE_URL}/store`,
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://www.tangsong.com.tw/images/0002.jpg",
        width: 1200,
        height: 630,
        alt: "唐宋珠寶線上商城 - 精選黃金K金鑽石珠寶首飾",
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/tw/store`,
  },
}

// ==========================
// 2. 靜態結構化資料
// ==========================
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${BASE_URL}/store#collection`,
  name: "唐宋珠寶線上商城",
  description:
    "唐宋珠寶精選黃金、K金、鉑金婚戒、鑽石珠寶首飾，每件商品均經嚴格鑑定，值得信賴。",
  url: `${BASE_URL}/store`,
  image: "https://www.tangsong.com.tw/images/0002.jpg",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首頁",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "線上商城",
        item: `${BASE_URL}/store`,
      },
    ],
  },
}

// ==========================
// 3. 動態商品 ItemList 產生函式
// ==========================
function buildItemListSchema(
  products: HttpTypes.StoreProduct[],
  countryCode: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "唐宋珠寶精選商品清單",
    url: `${BASE_URL}/${countryCode}/store`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => {
      const cheapestVariant = (product.variants as any[])
        ?.filter((v) => !!v.calculated_price?.calculated_amount)
        .sort(
          (a, b) =>
            a.calculated_price.calculated_amount -
            b.calculated_price.calculated_amount
        )[0]

      const price = cheapestVariant?.calculated_price?.calculated_amount
      const currency =
        cheapestVariant?.calculated_price?.currency_code?.toUpperCase() ??
        "TWD"

      const item: Record<string, unknown> = {
        "@type": "Product",
        name: product.title,
        url: `${BASE_URL}/${countryCode}/products/${product.handle}`,
        ...(product.description && { description: product.description }),
        ...(product.thumbnail && { image: product.thumbnail }),
        brand: {
          "@type": "Brand",
          name: "唐宋珠寶",
        },
      }

      if (price != null) {
        item.offers = {
          "@type": "Offer",
          priceCurrency: currency,
          price: price,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "唐宋珠寶",
          },
          url: `${BASE_URL}/${countryCode}/products/${product.handle}`,
        }
      }

      return {
        "@type": "ListItem",
        position: index + 1,
        item,
      }
    }),
  }
}

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
  const { countryCode } = params

  // 動態抓取商品（含價格），生成 Product 結構化資料
  const region = await getRegion(countryCode)
  let itemListSchema = null

  if (region) {
    const {
      response: { products },
    } = await listProducts({
      pageParam: 1,
      queryParams: {
        limit: 48,
        fields:
          "*variants.calculated_price,+variants.inventory_quantity,*variants.images",
      },
      regionId: region.id,
    })
    itemListSchema = buildItemListSchema(products, countryCode)
  }

  const combinedSchemas = [
    collectionSchema,
    ...(itemListSchema ? [itemListSchema] : []),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchemas) }}
      />
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={countryCode}
      />
    </>
  )
}
