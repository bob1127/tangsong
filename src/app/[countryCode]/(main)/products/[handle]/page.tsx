import { notFound } from "next/navigation"
import { getRegion, listRegions } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import {
  getProductByHandle,
  buildProductMetadata,
  buildProductSchemas,
} from "@lib/product"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import type { Metadata } from "next"

export const revalidate = 60

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images?.length) {
    return product.images ?? []
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return (product.images ?? []).filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const product = await getProductByHandle(params.countryCode, params.handle)

  if (!product) {
    return { title: "商品不存在 | 唐宋珠寶" }
  }

  return buildProductMetadata(product, params.handle)
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const selectedVariantId = searchParams.v_id

  const [product, region] = await Promise.all([
    getProductByHandle(params.countryCode, params.handle),
    getRegion(params.countryCode),
  ])

  if (!product || !region) {
    notFound()
  }

  const images = getImagesForVariant(product, selectedVariantId) ?? []
  const schemaList = buildProductSchemas(product, params.handle)

  return (
    <>
      {schemaList.map((schemaItem, index) => (
        <script
          key={`product-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItem) }}
        />
      ))}

      <ProductTemplate
        product={product}
        region={region}
        countryCode={params.countryCode}
        images={images}
      />
    </>
  )
}
