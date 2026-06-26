import Link from "next/link"
import type { MedusaArticle } from "@lib/blog/types"
import {
  formatArticleCardDate,
  resolveArticleAuthor,
  resolveArticleDescription,
  resolveArticleImage,
} from "@lib/blog/article-display"

type ArticleCardProps = {
  article: MedusaArticle
  /** 無有效 handle 時不連結（首頁假資料用） */
  linkable?: boolean
}

export default function ArticleCard({
  article,
  linkable = true,
}: ArticleCardProps) {
  const imageUrl = resolveArticleImage(article)
  const authorName = resolveArticleAuthor(article)
  const description = resolveArticleDescription(article)
  const formattedDate = formatArticleCardDate(article.created_at)
  const canLink = linkable && article.handle && article.handle !== "#"

  const cardClassName =
    "group flex flex-col bg-white rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 border border-stone-200 overflow-hidden"

  const content = (
    <>
      <div className="relative h-60 overflow-hidden rounded-none">
        <img
          src={imageUrl}
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
        <time
          dateTime={article.created_at}
          className="text-[11px] text-stone-400 font-semibold mb-3 tracking-wide"
        >
          {formattedDate}
        </time>

        <h3 className="text-xl font-extrabold text-stone-900 leading-snug mb-3 group-hover:text-[#5A1216] transition-colors line-clamp-2">
          {article.title}
        </h3>

        {description && (
          <p className="text-sm text-stone-500 line-clamp-2 mb-6 flex-grow">
            {description}
          </p>
        )}

        <div className="flex justify-between items-center mt-auto pt-4">
          <div className="flex gap-4 text-stone-400">
            <span className="hover:text-[#D4AF37] transition-colors" aria-hidden>
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
                />
              </svg>
            </span>
            <span className="hover:text-[#5A1216] transition-colors" aria-hidden>
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
                />
              </svg>
            </span>
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
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  )

  if (canLink) {
    return (
      <Link href={`/blog/${article.handle}`} className={cardClassName}>
        {content}
      </Link>
    )
  }

  return <div className={cardClassName}>{content}</div>
}
