import type { MedusaArticle } from "./types"
import { getAuthorNameFromSchemas } from "./article-schema"

const DEFAULT_ARTICLE_IMAGE =
  "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?q=80&w=2070&auto=format&fit=crop"

export function resolveArticleAuthor(article: MedusaArticle): string {
  const savedSchema = article.schema_data || article.faq_schema
  if (savedSchema && Array.isArray(savedSchema["@graph"])) {
    const name = getAuthorNameFromSchemas(
      savedSchema["@graph"] as Record<string, unknown>[]
    )
    if (name !== "唐宋珠寶") return name
  }
  return "唐宋珠寶專欄"
}

export function resolveArticleDescription(article: MedusaArticle): string {
  if (article.seo_description) return article.seo_description
  if (article.content) {
    return `${article.content.replace(/<[^>]+>/g, "").substring(0, 85)}...`
  }
  return ""
}

export function resolveArticleImage(article: MedusaArticle): string {
  return article.thumbnail?.trim() || DEFAULT_ARTICLE_IMAGE
}

export function formatArticleCardDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function sortArticlesByDate(
  articles: MedusaArticle[]
): MedusaArticle[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}
