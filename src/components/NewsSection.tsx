import React from "react"
import Link from "next/link"
import { getPublishedArticles, sortArticlesByDate } from "@lib/blog"
import ArticleCardGrid from "./articles/ArticleCardGrid"

export const revalidate = 60

const fallbackArticles = [
  {
    id: "fallback-1",
    title: "國際金價避險需求升溫，銀樓牌價同步調整",
    handle: "#",
    content: "",
    seo_description:
      "受全球經濟波動影響，實體黃金買氣不減。唐宋珠寶提醒顧客關注每日即時牌價，掌握最佳配置時機。",
    created_at: new Date().toISOString(),
    is_published: true,
    thumbnail:
      "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "fallback-2",
    title: "珠寶投資趨勢：金飾不再只是保值，更是時尚配戴首選",
    handle: "#",
    content: "",
    seo_description:
      "隨傳統工藝與現代設計結合，黃金輕珠寶成為年輕族群新寵。專家解析今年春夏珠寶市場的三大熱點。",
    created_at: new Date().toISOString(),
    is_published: true,
    thumbnail:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "fallback-3",
    title: "聯準會降息預期變動，全球金融市場波動加劇",
    handle: "#",
    content: "",
    seo_description:
      "投資者聚焦本週經濟數據。金價作為避險資產，在利率環境變動下展現極強韌性，吸引長期買盤進場。",
    created_at: new Date().toISOString(),
    is_published: true,
    thumbnail:
      "https://images.unsplash.com/photo-1611974717535-7c857a13ecb6?q=80&w=2070&auto=format&fit=crop",
  },
]

export default async function NewsSection() {
  const articles = sortArticlesByDate(await getPublishedArticles()).slice(0, 6)
  const hasRealArticles = articles.length > 0
  const displayArticles = hasRealArticles ? articles : fallbackArticles

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
        <Link
          href="/blog"
          className="text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors"
        >
          查看全部文章 →
        </Link>
      </div>

      <ArticleCardGrid articles={displayArticles} />
    </section>
  )
}
