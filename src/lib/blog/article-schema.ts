import type { MedusaArticle } from "./types"
import { SITE_URL, canonicalUrl } from "@lib/util/site-url"
import { parseKeywords } from "./article-seo"

const SCHEMA_CONTEXT = "https://schema.org"
const ARTICLE_TYPES = new Set([
  "Article",
  "BlogPosting",
  "NewsArticle",
  "BlogPost",
])

/** 後台存的是 BlogPost，對外 JSON-LD 用 BlogPosting */
function normalizeArticleType(type?: string): string {
  if (type === "BlogPost") return "BlogPosting"
  return type || "BlogPosting"
}

function articlePageUrl(handle: string): string {
  return canonicalUrl(`/blog/${handle}`)
}

function buildBreadcrumbSchema(article: MedusaArticle, handle: string) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首頁",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "專欄文章",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articlePageUrl(handle),
      },
    ],
  }
}

/** 後台未填結構化資料時的保底 BlogPosting */
function buildFallbackArticleNode(article: MedusaArticle, handle: string) {
  const schemaType = normalizeArticleType(article.schema_type ?? undefined)
  return {
    "@type": schemaType,
    headline: article.seo_title || article.title,
    description: article.seo_description || "",
    keywords: article.seo_keywords || "",
    image: article.thumbnail ? [article.thumbnail] : undefined,
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      "@type": "Organization",
      name: "唐宋珠寶",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "唐宋珠寶",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articlePageUrl(handle),
    },
    url: articlePageUrl(handle),
  }
}

/**
 * 在保留後台 Medusa 欄位的前提下，補齊常見缺漏（canonical、publisher、日期等）
 */
function enrichSchemaNode(
  node: Record<string, unknown>,
  article: MedusaArticle,
  handle: string
): Record<string, unknown> {
  const enriched = { ...node }
  const type = enriched["@type"] as string | undefined

  if (type && ARTICLE_TYPES.has(type)) {
    enriched["@type"] = normalizeArticleType(type)
    enriched.headline =
      enriched.headline || article.seo_title || article.title
    enriched.description =
      enriched.description || article.seo_description || ""
    enriched.keywords =
      enriched.keywords || article.seo_keywords || parseKeywords().join(", ")
    if (!enriched.image && article.thumbnail) {
      enriched.image = [article.thumbnail]
    }
    enriched.datePublished =
      enriched.datePublished || article.created_at
    enriched.dateModified =
      enriched.dateModified || article.updated_at || article.created_at
    enriched.url = articlePageUrl(handle)
    enriched.mainEntityOfPage = enriched.mainEntityOfPage || {
      "@type": "WebPage",
      "@id": articlePageUrl(handle),
    }
    if (!enriched.publisher) {
      enriched.publisher = {
        "@type": "Organization",
        name: "唐宋珠寶",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
      }
    }
    if (!enriched.author) {
      enriched.author = {
        "@type": "Organization",
        name: "唐宋珠寶",
        url: SITE_URL,
      }
    }
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
          ...(typeof q.acceptedAnswer === "object" && q.acceptedAnswer !== null
            ? q.acceptedAnswer
            : {}),
          text:
            (q.acceptedAnswer as { text?: string })?.text ||
            (typeof q.acceptedAnswer === "string" ? q.acceptedAnswer : ""),
        },
      }
    })
  }

  if (type === "HowTo") {
    enriched.name = enriched.name || article.seo_title || article.title
    enriched.description =
      enriched.description || article.seo_description || ""
  }

  return enriched
}

function extractGraphFromMedusa(article: MedusaArticle): Record<string, unknown>[] {
  let raw = (article.schema_data || article.faq_schema) as unknown

  if (!raw) return []

  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw) as Record<string, unknown>
    } catch {
      return []
    }
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

/**
 * 組合要注入頁面的 JSON-LD 陣列：
 * 1. 固定 BreadcrumbList
 * 2. 後台 schema_data / faq_schema 的 @graph（BlogPosting、FAQPage、HowTo 等，原樣保留並補強）
 */
export function buildArticleSchemas(
  article: MedusaArticle,
  handle: string
): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [
    buildBreadcrumbSchema(article, handle),
  ]

  const graphNodes = extractGraphFromMedusa(article)

  if (graphNodes.length > 0) {
    for (const node of graphNodes) {
      schemas.push({
        "@context": SCHEMA_CONTEXT,
        ...enrichSchemaNode(node, article, handle),
      })
    }
  } else {
    schemas.push({
      "@context": SCHEMA_CONTEXT,
      ...buildFallbackArticleNode(article, handle),
    })
  }

  return schemas
}

export function getAuthorNameFromSchemas(
  schemas: Record<string, unknown>[]
): string {
  for (const schema of schemas) {
    const type = schema["@type"] as string | undefined
    if (type && ARTICLE_TYPES.has(type)) {
      const author = schema.author as { name?: string } | undefined
      if (author?.name) return author.name
    }
  }
  return "唐宋珠寶"
}
