import type { HttpTypes } from "@medusajs/types"
import type { ProductSeoMetadata } from "./types"

export function getProductSeo(
  product: HttpTypes.StoreProduct
): ProductSeoMetadata {
  const meta = product.metadata as Record<string, unknown> | null | undefined
  const seo = meta?.seo
  if (!seo || typeof seo !== "object") {
    return {}
  }
  return seo as ProductSeoMetadata
}

export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

export function truncateDescription(text: string, maxLen = 160): string {
  const plain = stripHtml(text)
  if (plain.length <= maxLen) return plain
  return `${plain.slice(0, maxLen - 1)}…`
}

export function buildProductKeywords(product: HttpTypes.StoreProduct): string[] {
  const keywords = new Set<string>(["唐宋珠寶", "珠寶首飾", "台北珠寶"])

  product.tags?.forEach((tag) => {
    if (tag.value) keywords.add(tag.value)
  })

  product.categories?.forEach((cat) => {
    if (cat.name) keywords.add(cat.name)
  })

  if (product.collection?.title) {
    keywords.add(product.collection.title)
  }

  if (product.type?.value) {
    keywords.add(product.type.value)
  }

  return Array.from(keywords)
}

export function getProductOgImages(product: HttpTypes.StoreProduct) {
  const urls = new Set<string>()

  if (product.thumbnail) urls.add(product.thumbnail)
  product.images?.forEach((img) => {
    if (img.url) urls.add(img.url)
  })

  if (urls.size === 0) {
    return [
      {
        url: "https://www.tangsong.com.tw/images/0002.jpg",
        width: 1200,
        height: 630,
        alt: product.title,
      },
    ]
  }

  return Array.from(urls).map((url) => ({
    url,
    alt: product.title,
  }))
}
