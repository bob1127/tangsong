import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import {
  buildHomeMetadata,
  buildHomeCoreSchemaGraph,
  buildProductListSchema,
} from "@lib/seo"

export const revalidate = 60

export const metadata = buildHomeMetadata()

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center bg-black text-white text-xl text-center p-10">
        <h1 className="text-red-500 font-bold mb-4">🚨 找不到地區設定！</h1>
        <p>
          前端傳送的國碼是：
          <span className="text-yellow-400 font-mono">{countryCode}</span>
        </p>
        <p className="mt-4 text-sm text-gray-400">
          請去 Medusa 後台 ➔ 設定 ➔ 地區 (Regions) <br />{" "}
          編輯你的台灣地區，並確認有把「台灣 (Taiwan)」加入到國家列表中！
        </p>
      </div>
    )
  }

  const {
    response: { products },
  } = await listProducts({
    pageParam: 1,
    queryParams: {
      limit: 24,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images",
    },
    regionId: region.id,
  })

  const coreGraph = buildHomeCoreSchemaGraph()
  const productListSchema = buildProductListSchema(products, countryCode)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coreGraph) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productListSchema),
        }}
      />
      <Hero />
    </>
  )
}
