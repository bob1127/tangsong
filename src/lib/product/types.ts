import type { HttpTypes } from "@medusajs/types"

export type ProductFaqItem = {
  question: string
  answer: string
}

export type ProductSeoMetadata = {
  seo_title?: string
  seo_description?: string
  brand?: string
  faqs?: ProductFaqItem[]
  schema_data?: unknown
}

export type ProductWithSeo = HttpTypes.StoreProduct & {
  metadata?: Record<string, unknown> | null
}
