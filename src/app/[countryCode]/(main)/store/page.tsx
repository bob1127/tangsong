import { Metadata } from "next"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { buildProductItemListSchema } from "@lib/seo/commerce-schema"
import {
  SITE_URL,
  absolutePublicUrl,
  canonicalUrl,
} from "@lib/util/site-url"

export const revalidate = 60

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
    url: `${SITE_URL}/store`,
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
    canonical: canonicalUrl("/store"),
  },
}

const storePageUrl = canonicalUrl("/store")

function buildStoreSchemaGraph(
  countryCode: string,
  products: Awaited<
    ReturnType<typeof listProducts>
  >["response"]["products"]
) {
  const graph: Record<string, unknown>[] = [
    {
      "@type": "CollectionPage",
      "@id": `${storePageUrl}#collection`,
      name: "唐宋珠寶線上商城",
      description:
        "唐宋珠寶精選黃金、K金、鉑金婚戒、鑽石珠寶首飾，每件商品均經嚴格鑑定，值得信賴。",
      url: storePageUrl,
      image: "https://www.tangsong.com.tw/images/0002.jpg",
      breadcrumb: { "@id": `${storePageUrl}#breadcrumb` },
      mainEntity: { "@id": `${storePageUrl}#product-list` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${storePageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "首頁",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "線上商城",
          item: storePageUrl,
        },
      ],
    },
  ]

  if (products.length > 0) {
    graph.push(
      buildProductItemListSchema(products, countryCode, {
        name: "唐宋珠寶精選商品清單",
        pageUrl: absolutePublicUrl("/store", countryCode),
      })
    )
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
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

  const region = await getRegion(countryCode)
  let schemaGraph: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${storePageUrl}#collection`,
        name: "唐宋珠寶線上商城",
        url: storePageUrl,
      },
    ],
  }

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
    schemaGraph = buildStoreSchemaGraph(countryCode, products)
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={countryCode}
      />
    </>
  )
}
