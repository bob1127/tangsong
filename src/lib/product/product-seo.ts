import type { Metadata } from "next"
import type { HttpTypes } from "@medusajs/types"
import { canonicalUrl } from "@lib/util/site-url"
import {
  buildProductKeywords,
  getProductOgImages,
  getProductSeo,
  truncateDescription,
} from "./product-seo-helpers"

export function buildProductMetadata(
  product: HttpTypes.StoreProduct,
  handle: string
): Metadata {
  const seo = getProductSeo(product)
  const title =
    seo.seo_title?.trim() || `${product.title} | 唐宋珠寶 Tangsong`
  const description =
    seo.seo_description?.trim() ||
    (product.description
      ? truncateDescription(product.description, 160)
      : `${product.title} — 唐宋珠寶線上商城，台北萬華實體銀樓，專業鑑定、誠信買賣。`)
  const canonical = canonicalUrl(`/products/${handle}`)
  const keywords = buildProductKeywords(product)
  const images = getProductOgImages(product)

  return {
    title,
    description,
    keywords,
    authors: [{ name: "唐宋珠寶" }],
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "唐宋珠寶",
      locale: "zh_TW",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((img) => img.url),
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}
