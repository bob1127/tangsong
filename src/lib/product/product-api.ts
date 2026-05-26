import { listProducts } from "@lib/data/products"
import type { HttpTypes } from "@medusajs/types"

const PRODUCT_DETAIL_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,*collection,*categories,+type"

export async function getProductByHandle(
  countryCode: string,
  handle: string
): Promise<HttpTypes.StoreProduct | null> {
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      handle,
      limit: 1,
      fields: PRODUCT_DETAIL_FIELDS,
    },
  })

  return response.products[0] ?? null
}

export { PRODUCT_DETAIL_FIELDS }
