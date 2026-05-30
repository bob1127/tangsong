import { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogArticleView from "./BlogArticleView"
import {
  getArticleByHandle,
  getPublishedArticles,
  buildArticleMetadata,
  buildArticleSchemas,
  getAuthorNameFromSchemas,
  formatArticleDate,
  parseArticleTags,
  buildArticleContentWithToc,
  type MedusaArticle,
} from "@lib/blog"
import { PRIMARY_COUNTRY_CODE } from "@lib/util/site-url"

export const revalidate = 60

/** 允許 build 時未產生的 handle 在 runtime 動態渲染 */
export const dynamicParams = true

type PageParams = Promise<{ countryCode: string; handle: string }>

export async function generateStaticParams() {
  try {
    const articles = await getPublishedArticles()
    return articles.map((article) => ({
      countryCode: PRIMARY_COUNTRY_CODE,
      handle: article.handle,
    }))
  } catch (error) {
    console.error("[blog/generateStaticParams] 失敗:", error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: PageParams
}): Promise<Metadata> {
  const { handle } = await params
  const article = await getArticleByHandle(handle)

  if (!article) {
    return { title: "文章不存在 | 唐宋珠寶" }
  }

  return buildArticleMetadata(article, handle)
}

function getAdjacentArticles(
  allArticles: MedusaArticle[],
  currentId: string
) {
  const sorted = [...allArticles].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const currentIndex = sorted.findIndex((a) => a.id === currentId)
  const prevArticle =
    currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null
  const nextArticle = currentIndex > 0 ? sorted[currentIndex - 1] : null
  const relatedArticles = sorted.filter((a) => a.id !== currentId).slice(0, 3)

  return { prevArticle, nextArticle, relatedArticles }
}

export default async function BlogPostPage({
  params,
}: {
  params: PageParams
}) {
  const { handle } = await params

  const [article, allArticles] = await Promise.all([
    getArticleByHandle(handle),
    getPublishedArticles(),
  ])

  if (!article || !article.is_published) {
    notFound()
  }

  const schemaList = buildArticleSchemas(article, handle)
  const authorName = getAuthorNameFromSchemas(schemaList)
  const { html: cleanContent, toc } = buildArticleContentWithToc(
    article.content ?? ""
  )
  const { prevArticle, nextArticle, relatedArticles } = getAdjacentArticles(
    allArticles,
    article.id
  )

  return (
    <>
      {schemaList.map((schemaItem, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItem) }}
        />
      ))}

      <BlogArticleView
        article={article}
        cleanContent={cleanContent}
        toc={toc}
        tags={parseArticleTags(article.seo_keywords)}
        formattedDate={formatArticleDate(article.created_at)}
        authorName={authorName}
        prevArticle={prevArticle}
        nextArticle={nextArticle}
        relatedArticles={relatedArticles}
      />
    </>
  )
}
