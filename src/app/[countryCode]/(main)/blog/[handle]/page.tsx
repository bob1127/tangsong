import React from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"

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

async function getAllArticles() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
    const res = await fetch(
      `${baseUrl}/store/articles?is_published=true&limit=100`,
      {
        headers: { "x-publishable-api-key": publishableKey },
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.articles || []
  } catch (error) {
    return []
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

const formatDate = (dateString: string) => {
  const d = new Date(dateString)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(d.getDate()).padStart(2, "0")}`
}

// ==========================
// 3. 頁面組件 (Server Component 完美版)
// ==========================
export default async function BlogPostPage({
  params,
}: {
  params: { handle: string }
}) {
  const { handle } = await params

  const [article, allArticles] = await Promise.all([
    getArticleByHandle(handle),
    getAllArticles(),
  ])

  if (!article || !article.is_published) {
    notFound()
  }

  const formattedDate = formatDate(article.created_at)
  const tags = article.seo_keywords
    ? article.seo_keywords.split(",").map((t: string) => t.trim())
    : ["唐宋珠寶", "專業鑑定"]

  let schemaList: any[] = []
  let authorName = "唐宋珠寶"
  const rawSchema = article.schema_data || article.faq_schema
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

  // ==========================================
  // 🚀 防呆清洗與目錄 (TOC) 自動產生器 (伺服器端執行)
  // ==========================================
  let cleanContent = article.content
    .replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, "")
    .replace(/(<br\s*\/?>\s*){2,}/gi, "<br />")

  const toc: { id: string; text: string; level: string }[] = []

  // 自動掃描 h2 和 h3，提取文字並注入 id 供錨點連結跳轉
  cleanContent = cleanContent.replace(
    /<(h[23])([^>]*)>(.*?)<\/\1>/gi,
    (match, tag, attrs, text) => {
      const plainText = text.replace(/<[^>]+>/g, "").trim()
      const id = `heading-${toc.length}`
      toc.push({ id, text: plainText, level: tag.toLowerCase() })

      // 注入 id 以及 scroll-mt-32 確保跳轉時不被 Header 蓋住
      return `<${tag}${attrs} id="${id}" class="scroll-mt-32">${text}</${tag}>`
    }
  )

  // 相關文章運算
  const sortedArticles = [...allArticles].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const currentIndex = sortedArticles.findIndex((a) => a.id === article.id)
  const prevArticle =
    currentIndex < sortedArticles.length - 1
      ? sortedArticles[currentIndex + 1]
      : null
  const nextArticle = currentIndex > 0 ? sortedArticles[currentIndex - 1] : null
  const relatedArticles = sortedArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3)

  return (
    <>
      {/* 🚀 加入全域平滑滾動與隱藏滾動條的 CSS */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html { scroll-behavior: smooth; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />

      {schemaList.map((schemaItem, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaItem) }}
        />
      ))}

      <main className="min-h-screen bg-white font-sans selection:bg-[#5A1216] selection:text-white pt-24 md:pt-32 pb-0 text-[#111]">
        {/* 區塊 1: 頂部標題區 */}
        <header className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-12 border-b border-gray-200 pb-10">
          <p className="text-[#3b82f6] font-bold text-sm tracking-[0.15em] uppercase mb-4">
            JOURNAL / ARTICLE
          </p>
          <h1 className="text-2xl md:text-3xl max-w-full md:max-w-[80%] xl:max-w-[75%] lg:text-[36px] font-black tracking-tight leading-[1.2] mb-6 text-black">
            {article.title}
          </h1>
          <p className="text-gray-400 text-xs tracking-widest uppercase mb-8 font-medium">
            {article.seo_title || "TANGSONG JEWELRY EXCLUSIVE ARTICLE"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag: string, i: number) => {
              if (i % 3 === 0)
                return (
                  <span
                    key={i}
                    className="bg-gradient-to-r from-blue-500 to-blue-400 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full tracking-wider shadow-sm"
                  >
                    {tag}
                  </span>
                )
              else if (i % 3 === 1)
                return (
                  <span
                    key={i}
                    className="bg-black text-white text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full tracking-wider shadow-sm"
                  >
                    {tag}
                  </span>
                )
              else
                return (
                  <span
                    key={i}
                    className="text-pink-500 text-[10px] md:text-xs font-bold tracking-wider flex items-center gap-1"
                  >
                    <span className="text-pink-300">#</span> {tag}
                  </span>
                )
            })}
          </div>
        </header>

        {/* 區塊 2: 雙欄佈局 */}
        <div className="flex flex-col-reverse lg:flex-row max-w-[1400px] mx-auto relative items-start mb-20">
          {/* 左側：內文區 */}
          <article className="w-full lg:w-[70%] px-6 lg:px-12 lg:pr-20">
            {article.thumbnail && (
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full h-auto object-cover   mb-12 max-h-[60vh]"
              />
            )}
            <div
              className="
                w-full max-w-none text-[#222]
                
                /* 🚀 微調：縮小行距，讓文章更緊湊易讀 */
                text-[15px] leading-[1.8] md:leading-[2.0] tracking-[0.05em]
                
                /* P 段落間距縮小 */
                [&_p]:mb-6
                
                /* H2 標題 */
                [&_h2]:text-[22px] md:[&_h2]:text-[28px] [&_h2]:font-extrabold [&_h2]:leading-[1.3] [&_h2]:text-black [&_h2]:mt-16 [&_h2]:mb-6
                
                /* H3 標題 */
                [&_h3]:text-[18px] md:[&_h3]:text-[20px] [&_h3]:font-bold [&_h3]:text-black [&_h3]:pt-8 [&_h3]:mt-12 [&_h3]:mb-4 [&_h3]:border-t [&_h3]:border-dashed [&_h3]:border-gray-300
                
                /* 圖片 */
                [&_img]:w-full [&_img]:my-12 [&_img]:object-cover [&_img]:rounded-xl [&_img]:shadow-sm
                
                /* 🚀 全新引言樣式 (極簡灰底 + 左側深紅粗線) */
                [&_blockquote]:border-l-[6px] [&_blockquote]:border-[#7B1D23] [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:text-[#4A4A4A] [&_blockquote]:my-8 [&_blockquote]:bg-[#FAFAFA] [&_blockquote]:font-medium [&_blockquote]:text-[14px]
                
                /* 清單與連結 */
                [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-2
                [&_a]:text-[#5A1216] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[#D4AF37] [&_a]:transition-colors
              "
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />
          </article>

          {/* 右側：Sticky 側邊欄 */}
          <aside className="w-full lg:w-[30%] px-6 lg:px-0 mb-12 lg:mb-0 h-fit">
            <div className="sticky top-32 bg-gradient-to-br from-[#5A1216] to-[#3A0A0E] rounded-l-2xl lg:rounded-l-3xl rounded-r-2xl lg:rounded-r-none text-white p-8 md:p-10 shadow-2xl max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
              <p className="text-[#D4AF37] font-bold text-xs tracking-[0.2em] mb-8 opacity-80 uppercase">
                文章資訊
              </p>

              <div className="space-y-4 text-sm tracking-widest border-b border-white/20 pb-6 mb-6">
                <div>
                  <p className="text-white/50 text-[10px] mb-1">DATE</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-white/50 text-[10px] mb-1">AUTHOR</p>
                  <p className="font-medium">{authorName}</p>
                </div>
              </div>

              {/* 文章目錄 */}
              {toc.length > 0 && (
                <div className="border-b border-white/20 pb-6 mb-6">
                  <p className="text-white/50 text-[10px] mb-4 tracking-widest uppercase">
                    文章目錄
                  </p>
                  <nav className="flex flex-col gap-3">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`text-sm tracking-wider text-white/80 hover:text-[#D4AF37] hover:translate-x-1 transition-all duration-300 line-clamp-2 ${
                          item.level === "h3"
                            ? "pl-4 text-[13px] opacity-70"
                            : "font-medium"
                        }`}
                      >
                        {item.level === "h3" && (
                          <span className="mr-2 opacity-50">-</span>
                        )}
                        {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* CONTACT 與 LINE/FB 圖示 */}
              <div>
                <p className="text-white/50 text-[10px] mb-4 tracking-widest uppercase">
                  CONTACT
                </p>
                <div className="flex gap-4">
                  {/* 🚀 LINE Icon (使用 CSS Mask 技術強制變成白色) */}
                  <Link
                    href="https://lin.ee/QiLRhma"
                    target="_blank"
                    className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-[#06C755] hover:border-[#06C755] transition-all duration-300 shadow-sm"
                  >
                    <div
                      className="w-5 h-5 bg-white"
                      style={{
                        WebkitMaskImage: "url(/images/svg/icons8-line-500.svg)",
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskImage: "url(/images/svg/icons8-line-500.svg)",
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                      }}
                    />
                  </Link>

                  {/* FB Icon */}
                  <Link
                    href="https://www.facebook.com/people/%E5%94%90%E5%AE%8B%E7%8F%A0%E5%AF%B6%E9%8A%80%E6%A8%93/100057131423286/"
                    target="_blank"
                    className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] text-white transition-all duration-300 shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* 區塊 3: 相關文章 */}
        {relatedArticles.length > 0 && (
          <section className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-20">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
              <div className="lg:w-1/4 shrink-0">
                <h2 className="text-2xl font-bold tracking-wider mb-2">
                  RELATED
                </h2>
                <p className="text-gray-400 text-xs tracking-widest mb-6 lg:mb-0">
                  延伸閱讀
                </p>
              </div>
              <div className="lg:w-3/4 grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relArticle) => (
                  <Link
                    href={`/blog/${relArticle.handle}`}
                    key={relArticle.id}
                    className="group block"
                  >
                    <div className="w-full aspect-[4/3]   overflow-hidden mb-4 bg-gray-100">
                      <img
                        src={
                          relArticle.thumbnail ||
                          "/images/e48dcfbd-a446-4d95-98e0-1e92f6a16047.png"
                        }
                        alt={relArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mb-2">
                      {formatDate(relArticle.created_at)}
                    </p>
                    <h3 className="text-sm font-bold leading-relaxed group-hover:text-[#5A1216] transition-colors line-clamp-2">
                      {relArticle.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 區塊 4: 滿版 Banner 推薦區 */}
        <section className="w-full relative mt-20 mb-0">
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/images/e48dcfbd-a446-4d95-98e0-1e92f6a16047.png"
              alt="唐宋珠寶工藝"
              className="w-full h-full object-cover brightness-[0.3]"
            />
          </div>
          <div className="relative z-10 w-full py-32 px-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-widest mb-8 drop-shadow-lg">
              預約鑑賞 / 專屬客製化
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8942E] text-[#3A0A0E] text-xs font-bold px-4 py-2 rounded-full tracking-wider shadow-sm">
                <Link href="https://lin.ee/QiLRhma">線上預約</Link>
              </span>
              <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full tracking-wider shadow-sm">
                <Link href="/">珠寶鑑定・高價回收</Link>
              </span>
              <span className="text-white text-xs font-bold tracking-wider flex items-center gap-1">
                <Link href="/contact">
                  <span className="text-[#D4AF37]">#</span> 實體門市服務
                </Link>
              </span>
            </div>
          </div>
        </section>

        {/* 區塊 5: 底部導覽區 */}
        <nav className="w-full border-y border-gray-200 bg-[#FAFAFA] flex flex-col md:flex-row relative z-20">
          <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200">
            {prevArticle ? (
              <Link
                href={`/blog/${prevArticle.handle}`}
                className="flex h-full items-center justify-start p-6 lg:p-10 hover:bg-white transition-colors group"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 mr-4 border border-gray-200">
                  <img
                    src={
                      prevArticle.thumbnail ||
                      "/images/e48dcfbd-a446-4d95-98e0-1e92f6a16047.png"
                    }
                    alt={prevArticle.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">
                    Previous
                  </p>
                  <p className="text-xs md:text-sm font-bold text-black group-hover:text-[#5A1216] transition-colors line-clamp-1">
                    {prevArticle.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="flex h-full items-center justify-start p-6 lg:p-10 opacity-50">
                <p className="text-[10px] text-gray-400 tracking-widest uppercase">
                  No Previous Article
                </p>
              </div>
            )}
          </div>

          <Link
            href="/blog"
            className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col items-center justify-center p-8 lg:p-10 hover:bg-white transition-colors group"
          >
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-3 group-hover:border-black transition-colors">
              <svg
                className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
            <span className="font-bold tracking-[0.2em] text-[11px] text-black">
              BACK TO LIST
            </span>
          </Link>

          <div className="flex-1">
            {nextArticle ? (
              <Link
                href={`/blog/${nextArticle.handle}`}
                className="flex h-full items-center justify-end p-6 lg:p-10 hover:bg-white transition-colors group"
              >
                <div className="text-right mr-4">
                  <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">
                    Next
                  </p>
                  <p className="text-xs md:text-sm font-bold text-black group-hover:text-[#5A1216] transition-colors line-clamp-1">
                    {nextArticle.title}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <img
                    src={
                      nextArticle.thumbnail ||
                      "/images/e48dcfbd-a446-4d95-98e0-1e92f6a16047.png"
                    }
                    alt={nextArticle.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
              </Link>
            ) : (
              <div className="flex h-full items-center justify-end p-6 lg:p-10 opacity-50">
                <p className="text-[10px] text-gray-400 tracking-widest uppercase">
                  No Next Article
                </p>
              </div>
            )}
          </div>
        </nav>
      </main>
    </>
  )
}
