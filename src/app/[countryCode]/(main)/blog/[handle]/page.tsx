import React from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"

// ==========================
// 1. API 讀取邏輯
// ==========================
async function getArticleByHandle(handle: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

    const res = await fetch(`${baseUrl}/store/articles/${handle}`, {
      headers: { "x-publishable-api-key": publishableKey },
      next: { revalidate: 60 },
    })

    if (!res.ok) return null
    const data = await res.json()
    return data.article
  } catch (error) {
    return null
  }
}

// ==========================
// 2. SEO 設定 (Meta Tags)
// ==========================
export async function generateMetadata({
  params,
}: {
  params: { handle: string }
}): Promise<Metadata> {
  const { handle } = await params
  const article = await getArticleByHandle(handle)

  if (!article) return { title: "文章不存在 | 唐宋珠寶" }

  return {
    title: article.seo_title || `${article.title} | 唐宋珠寶`,
    description: article.seo_description || "",
    keywords: article.seo_keywords || "",
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || "",
      images: article.thumbnail ? [{ url: article.thumbnail }] : [],
      type: "article",
    },
  }
}

// ==========================
// 3. 頁面組件 (日系極簡 Portfolio 排版 - 呼吸感優化)
// ==========================
export default async function BlogPostPage({
  params,
}: {
  params: { handle: string }
}) {
  const { handle } = await params
  const article = await getArticleByHandle(handle)

  if (!article || !article.is_published) {
    notFound()
  }

  // 格式化日期：2026.04.25
  const dateObj = new Date(article.created_at)
  const formattedDate = `${dateObj.getFullYear()}.${String(
    dateObj.getMonth() + 1
  ).padStart(2, "0")}.${String(dateObj.getDate()).padStart(2, "0")}`

  // ==========================
  // 💡 結構化資料處理 (JSON-LD)
  // ==========================
  const rawSchema = article.schema_data || article.faq_schema
  let schemaList: any[] = []
  let authorName = "唐宋珠寶"

  if (rawSchema) {
    if (rawSchema["@graph"] && Array.isArray(rawSchema["@graph"])) {
      schemaList = rawSchema["@graph"].map((item: any) => ({
        "@context": "https://schema.org",
        ...item,
      }))
      const articleNode = rawSchema["@graph"].find((n: any) =>
        ["Article", "BlogPosting", "NewsArticle"].includes(n["@type"])
      )
      if (articleNode?.author?.name) authorName = articleNode.author.name
    } else {
      schemaList = [{ "@context": "https://schema.org", ...rawSchema }]
    }
  }

  return (
    <>
      {/* JSON-LD */}
      {schemaList.map((schemaItem, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItem) }}
        />
      ))}

      <main className="min-h-screen bg-[#ffffff] font-sans selection:bg-black selection:text-white pt-32 pb-40 px-6 lg:px-12 max-w-[1400px] mx-auto text-[#111]">
        {/* -----------------------------------------------------------
            HEADER: 視覺標誌點與大標題
        ----------------------------------------------------------- */}
        <header className="mb-24 lg:mb-32">
          {/* 標誌性的黑點 */}
          <div className="w-[8px] h-[8px] bg-black rounded-full mb-12"></div>

          <h1 className="text-2xl md:text-[32px] font-bold leading-[1.6] tracking-[0.08em] mb-6 max-w-5xl">
            {article.title}
          </h1>

          <p className="text-[11px] text-gray-400 tracking-[0.15em] uppercase">
            Journal / Article
          </p>
        </header>

        {/* -----------------------------------------------------------
            CONTENT GRID: 左側 Metadata / 右側本文
        ----------------------------------------------------------- */}
        <section className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* 左側：Metadata (縮小字級、拉寬字距) */}
          <aside className="lg:w-1/4 w-full shrink-0 flex flex-col gap-4 text-[11px] tracking-[0.15em] leading-[2] text-gray-500 uppercase">
            <div className="flex">
              <span className="w-24 text-gray-400">Author</span>
              <span className="flex-1 text-[#111]">{authorName}</span>
            </div>
            <div className="flex">
              <span className="w-24 text-gray-400">Date</span>
              <span className="flex-1 text-[#111]">{formattedDate}</span>
            </div>
            {article.seo_keywords && (
              <div className="flex">
                <span className="w-24 text-gray-400">Keyword</span>
                <span className="flex-1 text-[#111] underline underline-offset-4 decoration-gray-200 hover:decoration-black transition-colors">
                  {article.seo_keywords}
                </span>
              </div>
            )}
          </aside>

          {/* 右側：主視覺與內文 */}
          <article className="lg:w-3/4 w-full">
            {/* 滿版主圖 */}
            {article.thumbnail && (
              <div className="mb-24 w-full bg-stone-100">
                <img
                  src={article.thumbnail}
                  alt={article.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* 🚀 終極修復版：不依賴 prose 插件，直接強制設定內部所有標籤 */}
            <div
              className="
                w-full max-w-none
                
                /* 1. 基礎文字設定 (直接套用到整個區塊，保證行高和字距絕對生效) */
                text-[#222] 
                text-[13px] md:text-[13.5px] 
                leading-[2.8] md:leading-[3] 
                tracking-[0.1em] md:tracking-[0.12em] 
                
                /* 2. 強制指定內部 P 段落的間距 (如果有 <p> 標籤) */
                [&_p]:mb-2 md:[&_p]:mb-0
                
                /* 3. 強制指定內部標題 (H2, H3) 的大小與留白 */
                [&_h2]:text-[16px] md:[&_h2]:text-[22px] 
                [&_h2]:font-bold [&_h2]:tracking-[0.1em] text-[#111]
                [&_h2]:mt-4 md:[&_h2]:mt-5
                [&_h2]:mb-2 md:[&_h2]:mb-5
                [&_h2]:border-b [&_h2]:border-gray-200 [&_h2]:pb-6
                
                [&_h3]:text-[16px] md:[&_h3]:text-[18px] 
                [&_h3]:font-bold [&_h3]:text-[#111]
                [&_h3]:mt-4 md:[&_h3]:mt-6 
                [&_h3]:mb-3 md:[&_h3]:mb-4
                
                /* 4. 強制處理連結與其他元素 */
                [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-gray-300 hover:[&_a]:decoration-[#111] [&_a]:transition-colors
                [&_blockquote]:border-l-[1px] [&_blockquote]:border-black [&_blockquote]:pl-8 md:[&_blockquote]:pl-10 [&_blockquote]:py-2 [&_blockquote]:text-gray-500 [&_blockquote]:my-16
                [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-4
                [&_img]:w-full [&_img]:my-24 [&_img]:object-cover
                
                /* 💡 防呆機制：如果後台編輯器只產生 <br> 沒有 <p>，強制把 <br> 撐開 */
                [&_br]:block [&_br]:content-[''] [&_br]:mb-4
              "
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* 右側底部分享區塊 */}
            <div className="mt-40 pt-16 border-t border-gray-200 flex flex-col gap-4 text-[11px] tracking-[0.15em] uppercase text-gray-400">
              <span>Share</span>
              <div className="flex gap-8 text-[#111]">
                <a
                  href="#"
                  className="underline underline-offset-4 decoration-gray-200 hover:decoration-black transition-colors"
                >
                  X.com
                </a>
                <a
                  href="#"
                  className="underline underline-offset-4 decoration-gray-200 hover:decoration-black transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </article>
        </section>
      </main>
    </>
  )
}
