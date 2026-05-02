import React from "react"

// 💡 更新介面：加入我們剛在資料庫新增的 thumbnail 欄位
interface MedusaArticle {
  id: string
  title: string
  handle: string
  content: string
  seo_description: string
  created_at: string
  is_published: boolean
  schema_data: any
  faq_schema: any
  thumbnail?: string // 👈 加上主圖欄位
}

async function getArticles() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
    const targetUrl = `${baseUrl}/store/articles`

    const res = await fetch(targetUrl, {
      headers: {
        "x-publishable-api-key": publishableKey,
      },
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error("❌ [前台 GET] API 發生錯誤，內容：", errText)
      return null
    }

    const data = await res.json()

    if (!data.articles) return []

    const publishedArticles = data.articles
      .filter((a: MedusaArticle) => a.is_published)
      .slice(0, 6)

    return publishedArticles as MedusaArticle[]
  } catch (error) {
    console.error("❌ [前台 GET] 網路連線或程式崩潰錯誤：", error)
    return null
  }
}

export default async function NewsSection() {
  const articles = await getArticles()

  // 🛡️ 假資料墊檔
  const fallbackArticles = [
    {
      title: "國際金價避險需求升溫，銀樓牌價同步調整",
      handle: "#",
      seo_description:
        "受全球經濟波動影響，實體黃金買氣不減。唐宋珠寶提醒顧客關注每日即時牌價，掌握最佳配置時機。",
      created_at: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?q=80&w=2070&auto=format&fit=crop",
      authorName: "唐宋財經特報",
    },
    {
      title: "珠寶投資趨勢：金飾不再只是保值，更是時尚配戴首選",
      handle: "#",
      seo_description:
        "隨傳統工藝與現代設計結合，黃金輕珠寶成為年輕族群新寵。專家解析今年春夏珠寶市場的三大熱點。",
      created_at: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2070&auto=format&fit=crop",
      authorName: "珠寶週刊",
    },
    {
      title: "聯準會降息預期變動，全球金融市場波動加劇",
      handle: "#",
      seo_description:
        "投資者聚焦本週經濟數據。金價作為避險資產，在利率環境變動下展現極強韌性，吸引長期買盤進場。",
      created_at: new Date().toISOString(),
      imageUrl:
        "https://images.unsplash.com/photo-1611974717535-7c857a13ecb6?q=80&w=2070&auto=format&fit=crop",
      authorName: "時事經緯",
    },
  ]

  const hasRealArticles = articles && articles.length > 0

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-16 font-sans border-t border-stone-100">
      <div className="flex items-center justify-between mb-10 pb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-wide">
            珠寶知識與最新動態
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            第一手市場資訊 • 專業鑑賞指南
          </p>
        </div>
        <a
          href="/blog"
          className="text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors"
        >
          查看全部文章 →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(!hasRealArticles ? fallbackArticles : articles).map(
          (article: any, index: number) => {
            // 💡 關鍵更新：優先抓取後台專屬的 thumbnail 欄位！如果是假資料則退回使用 imageUrl
            let imageUrl = article.thumbnail || article.imageUrl
            let authorName = article.authorName || "唐宋珠寶專欄"
            let description = article.seo_description

            // 如果是真實文章，我們還是要從 Schema 把「作者」抓出來 (因為作者沒有獨立欄位)
            if (hasRealArticles) {
              const savedSchema = article.schema_data || article.faq_schema
              if (savedSchema && savedSchema["@graph"]) {
                const articleNode = savedSchema["@graph"].find((n: any) =>
                  ["Article", "BlogPosting", "NewsArticle"].includes(n["@type"])
                )
                if (articleNode) {
                  if (articleNode.author && articleNode.author.name)
                    authorName = articleNode.author.name
                }
              }
              // 自動摘要生成
              if (!description && article.content) {
                description =
                  article.content.replace(/<[^>]+>/g, "").substring(0, 85) +
                  "..."
              }
            }

            const dateObj = new Date(article.created_at)
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })

            return (
              <a
                key={article.id || index}
                href={`/tw/blog/${article.handle}`}
                className="group flex flex-col bg-white rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 border border-stone-200 overflow-hidden"
              >
                <div className="relative h-60 overflow-hidden rounded-none">
                  <img
                    src={
                      imageUrl ||
                      "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?q=80&w=2070&auto=format&fit=crop"
                    }
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-0 left-0 bg-white px-4 py-2 z-10 rounded-none border-b border-r border-stone-200 shadow-sm">
                    <span className="text-[9px] text-stone-500 block mb-0.5 leading-none">
                      written by
                    </span>
                    <span className="text-[11px] font-extrabold text-[#5A1216] uppercase tracking-wider leading-none">
                      {authorName}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow bg-white rounded-none">
                  <span className="text-[11px] text-stone-400 font-semibold mb-3 tracking-wide">
                    {formattedDate}
                  </span>

                  <h3 className="text-xl font-extrabold text-stone-900 leading-snug mb-3 group-hover:text-[#5A1216] transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-stone-500 line-clamp-2 mb-6 flex-grow">
                    {description}
                  </p>

                  <div className="flex justify-between items-center mt-auto pt-4">
                    <div className="flex gap-4 text-stone-400">
                      <button className="hover:text-[#D4AF37] transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="square"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          ></path>
                        </svg>
                      </button>
                      <button className="hover:text-[#5A1216] transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="square"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          ></path>
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 border border-stone-200 px-3 py-1.5 rounded-none text-xs font-bold text-[#5A1216] group-hover:bg-[#5A1216] group-hover:text-white transition-colors">
                      <span className="tracking-widest">閱讀全文</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="square"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            )
          }
        )}
      </div>
    </section>
  )
}
