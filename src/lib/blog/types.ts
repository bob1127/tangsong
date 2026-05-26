export type ArticleSchemaType = "Article" | "BlogPost" | "NewsArticle"

export interface MedusaArticle {
  id: string
  title: string
  handle: string
  content: string
  seo_title?: string | null
  seo_description?: string | null
  seo_keywords?: string | null
  schema_type?: ArticleSchemaType | string | null
  schema_data?: Record<string, unknown> | null
  faq_schema?: Record<string, unknown> | null
  thumbnail?: string | null
  is_published: boolean
  created_at: string
  updated_at?: string | null
}

export type TocItem = {
  id: string
  text: string
  level: string
}
