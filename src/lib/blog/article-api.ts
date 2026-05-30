import type { MedusaArticle } from "./types"

const getBaseUrl = () =>
  process.env.MEDUSA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
  "http://localhost:9000"

const getHeaders = () => ({
  "x-publishable-api-key":
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
})

export async function getArticleByHandle(
  handle: string
): Promise<MedusaArticle | null> {
  try {
    const res = await fetch(`${getBaseUrl()}/store/articles/${handle}`, {
      headers: getHeaders(),
      next: { revalidate: 60 },
    })
    if (!res.ok) {
      console.error(
        `[blog] getArticleByHandle(${handle}) HTTP ${res.status}`
      )
      return null
    }
    const data = await res.json()
    return data.article as MedusaArticle
  } catch (error) {
    console.error(`[blog] getArticleByHandle(${handle}) 失敗:`, error)
    return null
  }
}

export async function getPublishedArticles(): Promise<MedusaArticle[]> {
  try {
    const res = await fetch(
      `${getBaseUrl()}/store/articles?is_published=true&limit=500`,
      {
        headers: getHeaders(),
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) {
      console.error(`[blog] getPublishedArticles HTTP ${res.status}`)
      return []
    }
    const data = await res.json()
    return (data.articles || []).filter(
      (a: MedusaArticle) => a.is_published !== false && a.handle
    )
  } catch (error) {
    console.error("[blog] getPublishedArticles 失敗:", error)
    return []
  }
}
