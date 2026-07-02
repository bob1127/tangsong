import MetalPricePageContent from "../../../../components/metals/MetalPricePageContent"
import { getLatestMetals } from "@lib/data/metals"
import {
  buildMetalPricePageMetadata,
  buildMetalPricePageSchemaGraph,
  getMetalPricePageConfig,
} from "@lib/seo/metal-price-pages"

export const revalidate = 0

const PAGE_KEY = "gold-price-chart" as const
const page = getMetalPricePageConfig(PAGE_KEY)

export const metadata = buildMetalPricePageMetadata(PAGE_KEY)

export default async function GoldPriceChartPage() {
  const metalsData = await getLatestMetals()
  const schema = buildMetalPricePageSchemaGraph(PAGE_KEY, metalsData)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <MetalPricePageContent
        pageKey={PAGE_KEY}
        page={page}
        initialData={metalsData}
      />
    </>
  )
}
