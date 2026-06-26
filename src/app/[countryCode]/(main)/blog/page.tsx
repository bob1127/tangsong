import { Metadata } from "next"
import Link from "next/link"
import ArticleCardGrid from "../../../../components/articles/ArticleCardGrid"
import { getPublishedArticles, sortArticlesByDate } from "@lib/blog"
import { SITE_URL, canonicalUrl } from "@lib/util/site-url"

export const revalidate = 60

export const metadata: Metadata = {
  title: "珠寶知識與最新動態 | 黃金回收、今日金價與市場專欄 | 唐宋珠寶",
  description:
    "唐宋珠寶專欄：黃金回收怎麼算、今日金價走勢、K金白金收購比較、珠寶知識與市場動態，協助您做出明智的貴金屬決策。",
  keywords: [
    "唐宋珠寶專欄",
    "珠寶知識",
    "黃金回收文章",
    "今日金價",
    "黃金知識",
    "珠寶市場動態",
  ],
  alternates: {
    canonical: canonicalUrl("/blog"),
  },
  openGraph: {
    title: "珠寶知識與最新動態 | 唐宋珠寶",
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
            name: "珠寶知識與最新動態",
            item: `${SITE_URL}/blog`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/blog#webpage`,
        url: `${SITE_URL}/blog`,
        name: "唐宋珠寶珠寶知識與最新動態",
        description: "黃金回收、今日金價、珠寶知識與市場動態專業文章列表。",
        inLanguage: "zh-TW",
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "ItemList",
        name: "珠寶知識與最新動態文章列表",
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
  const articles = sortArticlesByDate(await getPublishedArticles())
  const schema = buildBlogListSchema(articles)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen bg-[#FDFBF7]">
        <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-16 font-sans">
          <nav className="text-xs tracking-widest text-stone-400 mb-8">
            <Link href="/" className="hover:text-[#5A1216]">
              首頁
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#5A1216]">珠寶知識與最新動態</span>
          </nav>

          <div className="mb-10 pb-4 border-b border-stone-100">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 tracking-wide">
              珠寶知識與最新動態
            </h1>
          </div>

          {articles.length === 0 ? (
            <p className="text-stone-500">目前尚無已發布文章。</p>
          ) : (
            <ArticleCardGrid articles={articles} />
          )}
        </section>
      </div>
    </>
  )
}
