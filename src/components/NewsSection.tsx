import React from "react"

interface Article {
  title: string
  description: string
  url: string
  image: string
  publishedAt: string
  source: {
    name: string
    url: string
  }
}

async function getNews() {
  const GNEWS_API_KEY = "812283ba75b7735c852f1ff144450433"

  try {
    const res = await fetch(
      `https://gnews.io/api/v4/top-headlines?category=business&lang=zh-Hant&country=tw&max=6&apikey=${GNEWS_API_KEY}`,
      { next: { revalidate: 14400 } }
    )

    if (!res.ok) {
      const errorData = await res.json()
      console.error("GNews API 錯誤詳情:", errorData)
      return null
    }

    const data = await res.json()
    return data.articles as Article[]
  } catch (error) {
    console.error("無法連線至 GNews API:", error)
    return null
  }
}

export default async function NewsSection() {
  const news = await getNews()

  // 🛡️ 準備三篇「高質量」假資料，萬一 API 沒動靜時確保 UI 漂亮
  const fallbackNews: Article[] = [
    {
      title: "國際金價避險需求升溫，銀樓牌價同步調整",
      description:
        "受全球經濟波動影響，實體黃金買氣不減。唐宋珠寶提醒顧客關注每日即時牌價，掌握最佳配置時機。",
      url: "#",
      image:
        "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?q=80&w=2070&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      source: { name: "唐宋財經特報", url: "#" },
    },
    {
      title: "珠寶投資趨勢：金飾不再只是保值，更是時尚配戴首選",
      description:
        "隨傳統工藝與現代設計結合，黃金輕珠寶成為年輕族群新寵。專家解析今年春夏珠寶市場的三大熱點。",
      url: "#",
      image:
        "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2070&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      source: { name: "珠寶週刊", url: "#" },
    },
    {
      title: "聯準會降息預期變動，全球金融市場波動加劇",
      description:
        "投資者聚焦本週經濟數據。金價作為避險資產，在利率環境變動下展現極強韌性，吸引長期買盤進場。",
      url: "#",
      image:
        "https://images.unsplash.com/photo-1611974717535-7c857a13ecb6?q=80&w=2070&auto=format&fit=crop",
      publishedAt: new Date().toISOString(),
      source: { name: "時事經緯", url: "#" },
    },
  ]

  const displayNews = news && news.length > 0 ? news : fallbackNews

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-16 font-sans border-t border-stone-100">
      <div className="flex items-center justify-between mb-10 pb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-wide">
            即時財經時事
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            4 小時定時更新 • 掌握全球金融脈動
          </p>
        </div>
        <a
          href="https://news.google.com/"
          target="_blank"
          className="text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors"
        >
          查看更多新聞 →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayNews.map((article, index) => {
          // 格式化日期 (例如：Monday, 20th January 2026)
          const dateObj = new Date(article.publishedAt)
          const formattedDate = dateObj.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })

          return (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              // 💡 關鍵：rounded-none 確保零圓角，並加上精緻的陰影與 hover 浮動效果
              className="group flex flex-col bg-white rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 border border-stone-200 overflow-hidden"
            >
              {/* 圖片區塊 */}
              <div className="relative h-60 overflow-hidden rounded-none">
                <img
                  src={
                    article.image ||
                    "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?q=80&w=2070&auto=format&fit=crop"
                  }
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                {/* 💡 左上角來源標籤 (還原參考圖設計，零圓角) */}
                <div className="absolute top-0 left-0 bg-white px-4 py-2 z-10 rounded-none border-b border-r border-stone-200 shadow-sm">
                  <span className="text-[9px] text-stone-500 block mb-0.5 leading-none">
                    presented by
                  </span>
                  <span className="text-[11px] font-extrabold text-[#5A1216] uppercase tracking-wider leading-none">
                    {article.source.name}
                  </span>
                </div>
              </div>

              {/* 文字與內容區塊 */}
              <div className="p-6 flex flex-col flex-grow bg-white rounded-none">
                <span className="text-[11px] text-stone-400 font-semibold mb-3 tracking-wide">
                  {formattedDate}
                </span>

                <h3 className="text-xl font-extrabold text-stone-900 leading-snug mb-3 group-hover:text-[#5A1216] transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-stone-500 line-clamp-2 mb-6 flex-grow">
                  {article.description}
                </p>

                {/* 💡 底部操作列 (完全還原參考圖的圖示與按鈕排列) */}
                <div className="flex justify-between items-center mt-auto pt-4">
                  {/* 左側 Icons */}
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

                  {/* 右側閱讀按鈕 (直角外框) */}
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
        })}
      </div>
    </section>
  )
}
