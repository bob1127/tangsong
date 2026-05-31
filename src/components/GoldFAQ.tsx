"use client"

import Link from "next/link"
import { useState } from "react"
import { GOLD_FAQ_ITEMS } from "@lib/data/gold-faqs"

const INITIAL_VISIBLE = 10

type GoldFAQProps = {
  /** 獨立 Q&A 頁：預設展開全部 */
  showAllByDefault?: boolean
  /** 首頁區塊：顯示「查看全部 Q&A」連結 */
  showViewAllLink?: boolean
  /** 獨立頁面已有主標題時隱藏區塊標題 */
  hideHeader?: boolean
}

export default function GoldFAQ({
  showAllByDefault = false,
  showViewAllLink = false,
  hideHeader = false,
}: GoldFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(showAllByDefault)

  const visibleFaqs = showAll
    ? GOLD_FAQ_ITEMS
    : GOLD_FAQ_ITEMS.slice(0, INITIAL_VISIBLE)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section className="w-full bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto">
        {!hideHeader ? (
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] text-[#b8973a] uppercase mb-3">
              FAQ
            </p>
            <h2 className="text-2xl md:text-3xl font-light text-stone-800 tracking-wide">
              黃金回收常見問題
            </h2>
            <div className="mt-4 mx-auto w-10 h-px bg-[#b8973a]/60" />
          </div>
        ) : null}

        <div className="divide-y divide-stone-200">
          {visibleFaqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div key={faq.q}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="flex gap-4 items-start">
                    <span className="text-[#b8973a] text-xs font-mono mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-stone-700 text-sm md:text-base font-light leading-relaxed group-hover:text-[#b8973a] transition-colors duration-200">
                      {faq.q}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 mt-1 w-5 h-5 flex items-center justify-center rounded-full border transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 border-[#b8973a] text-[#b8973a]"
                        : "border-stone-300 text-stone-400 group-hover:border-[#b8973a] group-hover:text-[#b8973a]"
                    }`}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M5 1V9M1 5H9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pb-6 pl-9 text-stone-500 text-sm leading-relaxed font-light">
                    {faq.a}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {!showAllByDefault && !showAll && (
          <div className="mt-10 text-center flex flex-col items-center gap-4">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-8 py-3 border border-[#b8973a]/50 text-[#b8973a] text-sm tracking-widest uppercase hover:bg-[#b8973a]/5 hover:border-[#b8973a] transition-all duration-200"
            >
              <span>顯示更多</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="translate-y-px"
              >
                <path
                  d="M6 1V11M1 6H11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-stone-400 text-xs ml-1">
                +{GOLD_FAQ_ITEMS.length - INITIAL_VISIBLE}
              </span>
            </button>
            {showViewAllLink ? (
              <Link
                href="/faq"
                className="text-sm text-[#b8973a] tracking-widest hover:text-[#8a7330] transition-colors underline underline-offset-4"
              >
                查看全部 Q&amp;A
              </Link>
            ) : null}
          </div>
        )}

        {!showAllByDefault && showAll && (
          <div className="mt-10 text-center">
            <button
              onClick={() => {
                setShowAll(false)
                setOpenIndex(null)
              }}
              className="inline-flex items-center gap-2 px-8 py-3 border border-stone-200 text-stone-400 text-sm tracking-widest uppercase hover:border-stone-300 hover:text-stone-600 transition-all duration-200"
            >
              <span>收起</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="rotate-45 translate-y-px"
              >
                <path
                  d="M6 1V11M1 6H11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
