import type { MetadataRoute } from "next"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { PRIMARY_COUNTRY_CODE, absolutePublicUrl } from "@lib/util/site-url"
import { HttpTypes } from "@medusajs/types"

/** 與商品/文章頁 ISR 一致：每 60 秒重新向 Medusa 拉最新 URL */
export const revalidate = 60

type SitemapEntry = MetadataRoute.Sitemap[number]

function entry(
  path: string,
  options?: {
    lastModified?: Date | string
    changeFrequency?: SitemapEntry["changeFrequency"]
    priority?: number
  }
): SitemapEntry {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return {
    url: absolutePublicUrl(normalized),
    lastModified: options?.lastModified
      ? new Date(options.lastModified)
      : new Date(),
    changeFrequency: options?.changeFrequency ?? "weekly",
    priority: options?.priority ?? 0.7,
  }
}

async function fetchPublishedArticles(): Promise<
  { handle: string; updated_at?: string; created_at?: string }[]
> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

    const res = await fetch(
      `${baseUrl}/store/articles?is_published=true&limit=500`,
      {
        headers: { "x-publishable-api-key": publishableKey },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) return []
    const data = await res.json()
    return (data.articles || []).filter(
      (a: { handle?: string; is_published?: boolean }) =>
        a.is_published !== false && a.handle
    )
  } catch {
    return []
  }
}

async function fetchAllProducts(
  countryCode: string
): Promise<HttpTypes.StoreProduct[]> {
  const limit = 100
  const products: HttpTypes.StoreProduct[] = []
  let page = 1
  let total = Infinity

  while (products.length < total) {
    const { response } = await listProducts({
      pageParam: page,
      queryParams: { limit, fields: "handle,updated_at,created_at" },
      countryCode,
    })

    products.push(...response.products)
    total = response.count

    if (response.products.length === 0) break
    page += 1
  }

  return products
}

function categoryPaths(
  categories: HttpTypes.StoreProductCategory[],
  parentPath = ""
): string[] {
  const paths: string[] = []

  for (const cat of categories) {
    if (!cat.handle) continue
    const segment = parentPath ? `${parentPath}/${cat.handle}` : cat.handle
    paths.push(`/categories/${segment}`)

    const children = cat.category_children as
      | HttpTypes.StoreProductCategory[]
      | undefined
    if (children?.length) {
      paths.push(...categoryPaths(children, segment))
    }
  }

  return paths
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: SitemapEntry[] = [
    entry("", { priority: 1, changeFrequency: "daily" }),
    entry("/store", { priority: 0.9, changeFrequency: "daily" }),
    entry("/about", { priority: 0.8 }),
    entry("/contact", { priority: 0.8 }),
    entry("/purchase-process", { priority: 0.85 }),
    entry("/purchase-categories", { priority: 0.85 }),
    entry("/blog", { priority: 0.8, changeFrequency: "daily" }),
    entry("/tools", { priority: 0.6 }),
    entry("/privacy", { priority: 0.3, changeFrequency: "yearly" }),
  ]

  const [products, articles, collectionsResult, categories] =
    await Promise.all([
      fetchAllProducts(PRIMARY_COUNTRY_CODE),
      fetchPublishedArticles(),
      listCollections({ limit: "100" }).catch(() => ({
        collections: [] as HttpTypes.StoreCollection[],
        count: 0,
      })),
      listCategories({ limit: 100 }).catch(
        () => [] as HttpTypes.StoreProductCategory[]
      ),
    ])

  const productEntries = products
    .filter((p) => p.handle)
    .map((p) =>
      entry(`/products/${p.handle}`, {
        lastModified: p.updated_at ?? p.created_at,
        priority: 0.8,
        changeFrequency: "weekly",
      })
    )

  const articleEntries = articles.map((a) =>
    entry(`/blog/${a.handle}`, {
      lastModified: a.updated_at ?? a.created_at,
      priority: 0.75,
      changeFrequency: "weekly",
    })
  )

  const collectionEntries = collectionsResult.collections
    .filter((c) => c.handle)
    .map((c) =>
      entry(`/collections/${c.handle}`, {
        priority: 0.7,
        changeFrequency: "weekly",
      })
    )

  const categoryEntries = categoryPaths(categories ?? []).map((path) =>
    entry(path, { priority: 0.7, changeFrequency: "weekly" })
  )

  return [
    ...staticPages,
    ...productEntries,
    ...articleEntries,
    ...collectionEntries,
    ...categoryEntries,
  ]
}
