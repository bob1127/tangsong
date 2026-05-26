import type { Metadata } from "next"
import type { MedusaArticle } from "./types"
import { SITE_URL, canonicalUrl } from "@lib/util/site-url"

export function parseKeywords(keywords?: string | null): string[] {
  if (!keywords?.trim()) {
    return ["唐宋珠寶", "珠寶知識", "黃金", "貴金屬"]
  }
  return keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean)
}

export function buildArticleMetadata(
  article: MedusaArticle,
  handle: string
): Metadata {
  const title = article.seo_title || `${article.title} | 唐宋珠寶`
  const description =
    article.seo_description ||
    `${article.title} — 唐宋珠寶專欄，分享黃金、珠寶、貴金屬投資與鑑定知識。`
  const keywords = parseKeywords(article.seo_keywords)
  const canonical = canonicalUrl(`/blog/${handle}`)
  const ogImage = article.thumbnail
    ? [{ url: article.thumbnail, alt: article.title }]
    : [
        {
          url: `${SITE_URL}/images/0002.jpg`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ]

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
      type: "article",
      publishedTime: article.created_at,
      modifiedTime: article.updated_at || article.created_at,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.thumbnail ? [article.thumbnail] : undefined,
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
