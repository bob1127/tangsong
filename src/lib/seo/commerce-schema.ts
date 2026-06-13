import type { HttpTypes } from "@medusajs/types"
import { stripHtml } from "@lib/product/product-seo-helpers"
import { absolutePublicUrl, SITE_URL } from "@lib/util/site-url"

export const MERCHANT_ORGANIZATION = {
  "@type": "Organization",
  name: "唐宋珠寶",
  url: SITE_URL,
}

export const MERCHANT_RETURN_POLICY = {
  "@type": "MerchantReturnPolicy",
  applicableCountry: "TW",
  returnPolicyCategory:
    "https://schema.org/MerchantReturnFiniteReturnWindow",
  merchantReturnDays: 7,
  returnMethod: "https://schema.org/ReturnInStore",
  returnFees: "https://schema.org/FreeReturn",
}

export const OFFER_SHIPPING_DETAILS = {
  "@type": "OfferShippingDetails",
  shippingRate: {
    "@type": "MonetaryAmount",
    value: "0",
    currency: "TWD",
  },
  shippingDestination: {
    "@type": "DefinedRegion",
    addressCountry: "TW",
  },
  deliveryTime: {
    "@type": "ShippingDeliveryTime",
    handlingTime: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 3,
      unitCode: "DAY",
    },
    transitTime: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: 7,
      unitCode: "DAY",
    },
  },
}

export function getCheapestVariant(product: HttpTypes.StoreProduct) {
  return (product.variants as HttpTypes.StoreProductVariant[])
    ?.filter((v) => !!v.calculated_price?.calculated_amount)
    .sort(
      (a, b) =>
        (a.calculated_price?.calculated_amount ?? 0) -
        (b.calculated_price?.calculated_amount ?? 0)
    )[0]
}

export function isProductInStock(product: HttpTypes.StoreProduct): boolean {
  if (!product.variants?.length) return true

  return product.variants.some(
    (v) =>
      v.manage_inventory === false ||
      (v.inventory_quantity ?? 0) > 0 ||
      v.allow_backorder === true
  )
}

export function buildProductDescription(product: HttpTypes.StoreProduct): string {
  if (product.description) {
    return stripHtml(product.description).slice(0, 5000)
  }

  return `${product.title} — 唐宋珠寶精選珠寶首飾，台北萬華實體銀樓販售，歡迎預約鑑賞。`
}

export function buildCommerceOffer(
  productUrl: string,
  options: {
    price?: number | null
    currency?: string
    inStock?: boolean
    lowPrice?: number
    highPrice?: number
    offerCount?: number
  } = {}
) {
  const currency = options.currency ?? "TWD"
  const availability = (options.inStock ?? true)
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock"

  const merchantFields = {
    seller: MERCHANT_ORGANIZATION,
    shippingDetails: OFFER_SHIPPING_DETAILS,
    hasMerchantReturnPolicy: MERCHANT_RETURN_POLICY,
    itemCondition: "https://schema.org/NewCondition",
  }

  if (
    options.lowPrice != null &&
    options.highPrice != null &&
    options.lowPrice !== options.highPrice
  ) {
    return {
      "@type": "AggregateOffer",
      url: productUrl,
      priceCurrency: currency,
      lowPrice: options.lowPrice,
      highPrice: options.highPrice,
      offerCount: options.offerCount ?? 1,
      availability,
      ...merchantFields,
    }
  }

  const offer: Record<string, unknown> = {
    "@type": "Offer",
    url: productUrl,
    priceCurrency: currency,
    availability,
    ...merchantFields,
  }

  if (options.price != null) {
    offer.price = options.price
  }

  return offer
}

export function buildProductSchemaNode(
  product: HttpTypes.StoreProduct,
  productUrl: string
) {
  const variant = getCheapestVariant(product)
  const price = variant?.calculated_price?.calculated_amount
  const currency =
    variant?.calculated_price?.currency_code?.toUpperCase() ?? "TWD"

  const amounts =
    product.variants
      ?.map((v) => v.calculated_price?.calculated_amount)
      .filter((n): n is number => typeof n === "number") ?? []

  const lowPrice = amounts.length ? Math.min(...amounts) : undefined
  const highPrice = amounts.length ? Math.max(...amounts) : undefined

  return {
    "@type": "Product",
    name: product.title,
    description: buildProductDescription(product),
    url: productUrl,
    ...(product.thumbnail && { image: product.thumbnail }),
    sku: product.variants?.[0]?.sku || product.id,
    mpn: product.variants?.[0]?.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "唐宋珠寶",
    },
    offers: buildCommerceOffer(productUrl, {
      price,
      currency,
      inStock: isProductInStock(product),
      lowPrice,
      highPrice,
      offerCount: product.variants?.length ?? 1,
    }),
  }
}

export function buildProductItemListSchema(
  products: HttpTypes.StoreProduct[],
  countryCode: string,
  options?: { name?: string; pageUrl?: string }
) {
  const pageUrl = options?.pageUrl ?? absolutePublicUrl("/store", countryCode)

  return {
    "@type": "ItemList",
    "@id": `${pageUrl}#product-list`,
    name: options?.name ?? "唐宋珠寶精選商品",
    url: pageUrl,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: buildProductSchemaNode(
        product,
        absolutePublicUrl(`/products/${product.handle}`, countryCode)
      ),
    })),
  }
}
