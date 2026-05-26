import { Metadata } from "next"
import Link from "next/link"
import {
  getPublishedArticles,
  formatArticleDate,
  parseArticleTags,
} from "@lib/blog"
import { SITE_URL, canonicalUrl } from "@lib/util/site-url"
import { PRIMARY_SITE_LINKS } from "@lib/seo/site-navigation"

export const revalidate = 60

export const metadata: Metadata = {
  title: "專欄文章 | 黃金回收知識、今日金價與珠寶市場動態 | 唐宋珠寶",
  description:
    "唐宋珠寶專欄：黃金回收怎麼算、今日金價走勢、K金白金收購比較、黃金存摺與通膨等專業文章，協助您做出明智的貴金屬決策。",
  keywords: [
    "唐宋珠寶專欄",
    "黃金回收文章",
    "今日金價",
    "黃金知識",
    "珠寶知識",
    "黃金存摺",
  ],
  alternates: {
    canonical: canonicalUrl("/blog"),
  },
  openGraph: {
    title: "專欄文章 | 唐宋珠寶",
    description:
      "黃金回收、今日金價、珠寶知識與市場動態，唐宋珠寶專業編輯文章。",
    url: `${SITE_URL}/blog`,
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
  },
  robots: { index: true, follow: true },
}

function buildBlogListSchema(
  articles: Awaited<ReturnType<typeof getPublishedArticles>>
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
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
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/blog#webpage`,
        url: `${SITE_URL}/blog`,
        name: "唐宋珠寶專欄文章",
        description:
          "黃金回收、今日金價、珠寶知識與市場動態專業文章列表。",
        inLanguage: "zh-TW",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "ItemList",
        name: "專欄文章列表",
        itemListElement: articles.slice(0, 50).map((article, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/blog/${article.handle}`,
          name: article.title,
        })),
      },
    ],
  }
}

export default async function BlogIndexPage() {
  const articles = await getPublishedArticles()
  const sorted = [...articles].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const schema = buildBlogListSchema(sorted)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-[#FDFBF7]">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-16">
          <nav className="text-xs tracking-widest text-stone-400 mb-6">
            <Link href="/" className="hover:text-[#5A1216]">
              首頁
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#5A1216]">專欄文章</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#5A1216] tracking-wide mb-4">
            專欄文章
          </h1>
          <p className="text-stone-600 max-w-2xl mb-12 leading-relaxed">
            黃金回收、今日金價、珠寶知識與市場動態，由唐宋珠寶編輯團隊為您整理。
          </p>

          {sorted.length === 0 ? (
            <p className="text-stone-500">目前尚無已發布文章。</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sorted.map((article) => (
                <li key={article.id}>
                  <article className="border border-stone-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow">
                    <Link href={`/blog/${article.handle}`} className="block p-6">
                      <time
                        dateTime={article.created_at}
                        className="text-xs text-stone-400 tracking-wider"
                      >
                        {formatArticleDate(article.created_at)}
                      </time>
                      <h2 className="mt-2 text-xl font-serif font-bold text-[#5A1216] line-clamp-2">
                        {article.title}
                      </h2>
                      {article.seo_description && (
                        <p className="mt-3 text-sm text-stone-600 line-clamp-3">
                          {article.seo_description}
                        </p>
                      )}
                      {article.seo_keywords && (
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {parseArticleTags(article.seo_keywords)
                            .slice(0, 3)
                            .map((tag) => (
                              <li
                                key={tag}
                                className="text-[10px] px-2 py-1 bg-stone-100 text-stone-500 rounded"
                              >
                                {tag}
                              </li>
                            ))}
                        </ul>
                      )}
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          )}

          <nav
            className="mt-16 pt-8 border-t border-stone-200"
            aria-label="相關頁面"
          >
            <p className="text-sm text-stone-500 mb-4">相關服務</p>
            <ul className="flex flex-wrap gap-4 text-sm">
              {PRIMARY_SITE_LINKS.filter((l) => l.path !== "/blog").map(
                (link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      className="text-[#5A1216] hover:underline"
                    >
                      {link.name}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
