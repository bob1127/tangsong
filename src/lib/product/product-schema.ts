import type { HttpTypes } from "@medusajs/types"
import { SITE_URL, canonicalUrl } from "@lib/util/site-url"
import {
  getProductSeo,
  stripHtml,
  truncateDescription,
} from "./product-seo-helpers"
import type { ProductFaqItem } from "./types"

const SCHEMA_CONTEXT = "https://schema.org"
const PRODUCT_TYPES = new Set(["Product", "IndividualProduct"])

function productPageUrl(handle: string): string {
  return canonicalUrl(`/products/${handle}`)
}

function getPriceRange(product: HttpTypes.StoreProduct) {
  const amounts =
    product.variants
      ?.map((v) => v.calculated_price?.calculated_amount)
      .filter((n): n is number => typeof n === "number") ?? []

  if (amounts.length === 0) return null

  const currency =
    product.variants?.[0]?.calculated_price?.currency_code?.toUpperCase() ??
    "TWD"

  return {
    lowPrice: Math.min(...amounts),
    highPrice: Math.max(...amounts),
    currency,
  }
}

function isInStock(product: HttpTypes.StoreProduct): boolean {
  if (!product.variants?.length) return true
  return product.variants.some(
    (v) =>
      v.manage_inventory === false ||
      (v.inventory_quantity ?? 0) > 0 ||
      v.allow_backorder === true
  )
}

function buildOffers(product: HttpTypes.StoreProduct, handle: string) {
  const priceRange = getPriceRange(product)
  const url = productPageUrl(handle)
  const availability = isInStock(product)
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock"

  if (!priceRange) {
    return {
      "@type": "Offer",
      url,
      priceCurrency: "TWD",
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "唐宋珠寶",
        url: SITE_URL,
      },
    }
  }

  if (priceRange.lowPrice === priceRange.highPrice) {
    return {
      "@type": "Offer",
      url,
      priceCurrency: priceRange.currency,
      price: priceRange.lowPrice,
      availability,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "唐宋珠寶",
        url: SITE_URL,
      },
    }
  }

  return {
    "@type": "AggregateOffer",
    url,
    priceCurrency: priceRange.currency,
    lowPrice: priceRange.lowPrice,
    highPrice: priceRange.highPrice,
    offerCount: product.variants?.length ?? 1,
    availability,
    itemCondition: "https://schema.org/NewCondition",
    seller: {
      "@type": "Organization",
      name: "唐宋珠寶",
      url: SITE_URL,
    },
  }
}

function getProductImages(product: HttpTypes.StoreProduct): string[] {
  const urls = new Set<string>()
  if (product.thumbnail) urls.add(product.thumbnail)
  product.images?.forEach((img) => {
    if (img.url) urls.add(img.url)
  })
  return Array.from(urls)
}

function buildBreadcrumbSchema(
  product: HttpTypes.StoreProduct,
  handle: string
) {
  const items: Record<string, unknown>[] = [
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
      item: `${SITE_URL}/store`,
    },
  ]

  if (product.collection?.handle && product.collection.title) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: product.collection.title,
      item: `${SITE_URL}/collections/${product.collection.handle}`,
    })
    items.push({
      "@type": "ListItem",
      position: 4,
      name: product.title,
      item: productPageUrl(handle),
    })
  } else {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: product.title,
      item: productPageUrl(handle),
    })
  }

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items,
  }
}

function buildFaqSchema(faqs: ProductFaqItem[]) {
  const valid = faqs.filter((f) => f.question?.trim() && f.answer?.trim())
  if (valid.length === 0) return null

  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    mainEntity: valid.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

function buildFallbackProductNode(
  product: HttpTypes.StoreProduct,
  handle: string
) {
  const seo = getProductSeo(product)
  const images = getProductImages(product)
  const description =
    seo.seo_description ||
    (product.description ? stripHtml(product.description) : "")

  return {
    "@type": "Product",
    "@id": `${productPageUrl(handle)}#product`,
    name: seo.seo_title || product.title,
    description: truncateDescription(description, 5000),
    image: images.length > 0 ? images : undefined,
    sku: product.variants?.[0]?.sku || product.id,
    mpn: product.variants?.[0]?.sku || undefined,
    brand: {
      "@type": "Brand",
      name: seo.brand || "唐宋珠寶",
    },
    url: productPageUrl(handle),
    offers: buildOffers(product, handle),
    ...(product.material && { material: product.material }),
    ...(product.weight && {
      weight: {
        "@type": "QuantitativeValue",
        value: product.weight,
        unitCode: "GRM",
      },
    }),
  }
}

function extractNodesFromSchemaData(raw: unknown): Record<string, unknown>[] {
  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw.filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null
    )
  }

  if (typeof raw !== "object" || raw === null) return []

  const obj = raw as Record<string, unknown>

  if (Array.isArray(obj["@graph"])) {
    return obj["@graph"] as Record<string, unknown>[]
  }

  if (obj["@type"]) {
    return [obj]
  }

  return []
}

function enrichProductNode(
  node: Record<string, unknown>,
  product: HttpTypes.StoreProduct,
  handle: string
): Record<string, unknown> {
  const enriched = { ...node }
  const type = enriched["@type"] as string | undefined
  const seo = getProductSeo(product)
  const images = getProductImages(product)

  if (type && PRODUCT_TYPES.has(type)) {
    enriched.name = enriched.name || seo.seo_title || product.title
    enriched.description =
      enriched.description ||
      seo.seo_description ||
      (product.description ? stripHtml(product.description) : "")
    if (!enriched.image && images.length > 0) {
      enriched.image = images
    }
    enriched.url = productPageUrl(handle)
    enriched["@id"] = enriched["@id"] || `${productPageUrl(handle)}#product`
    enriched.sku =
      enriched.sku || product.variants?.[0]?.sku || product.id
    if (!enriched.brand) {
      enriched.brand = {
        "@type": "Brand",
        name: seo.brand || "唐宋珠寶",
      }
    }
    enriched.offers = buildOffers(product, handle)
  }

  if (type === "FAQPage" && Array.isArray(enriched.mainEntity)) {
    enriched.mainEntity = enriched.mainEntity.map((entity: unknown) => {
      if (typeof entity !== "object" || entity === null) return entity
      const q = entity as Record<string, unknown>
      return {
        ...q,
        "@type": q["@type"] || "Question",
        name: q.name || "",
        acceptedAnswer: {
          "@type": "Answer",
          ...(typeof q.acceptedAnswer === "object" &&
          q.acceptedAnswer !== null
            ? q.acceptedAnswer
            : {}),
          text:
            (q.acceptedAnswer as { text?: string })?.text ||
            (typeof q.acceptedAnswer === "string" ? q.acceptedAnswer : ""),
        },
      }
    })
  }

  return enriched
}

/**
 * 組合商品頁 JSON-LD：
 * 1. BreadcrumbList
 * 2. 後台 metadata.seo.schema_data（Product、FAQPage 等，保留並以即時價格補強 offers）
 * 3. 若無 schema_data → 自動 Product；若有 faqs 且無 FAQPage → 補 FAQPage
 */
export function buildProductSchemas(
  product: HttpTypes.StoreProduct,
  handle: string
): Record<string, unknown>[] {
  const seo = getProductSeo(product)
  const schemas: Record<string, unknown>[] = [
    buildBreadcrumbSchema(product, handle),
  ]

  const graphNodes = extractNodesFromSchemaData(seo.schema_data)
  let hasFaqSchema = false
  let hasProductSchema = false

  if (graphNodes.length > 0) {
    for (const node of graphNodes) {
      const type = node["@type"] as string | undefined
      if (type === "FAQPage") hasFaqSchema = true
      if (type && PRODUCT_TYPES.has(type)) hasProductSchema = true

      schemas.push({
        "@context": SCHEMA_CONTEXT,
        ...enrichProductNode(node, product, handle),
      })
    }
  }

  if (!hasProductSchema) {
    schemas.push({
      "@context": SCHEMA_CONTEXT,
      ...buildFallbackProductNode(product, handle),
    })
  }

  if (!hasFaqSchema && seo.faqs?.length) {
    const faqSchema = buildFaqSchema(seo.faqs)
    if (faqSchema) schemas.push(faqSchema)
  }

  return schemas
}
