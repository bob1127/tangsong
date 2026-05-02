"use client"

import React, { useState, useEffect } from "react"

export default function TradeNoticePopup() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 檢查瀏覽器 LocalStorage 是否已經有同意的紀錄
    const hasAccepted = localStorage.getItem("tangsong_trade_notice_accepted")

    if (!hasAccepted) {
      // 為了讓進站體驗更好，延遲 1.5 秒後再優雅滑入
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // 將同意紀錄存入瀏覽器，下次進站就不會再彈出
    localStorage.setItem("tangsong_trade_notice_accepted", "true")
  }

  // 如果不可見，就完全不渲染
  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-[100] w-[calc(100%-2rem)] md:w-[380px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-7 animate-in slide-in-from-bottom-10 fade-in duration-700 font-sans border border-stone-100">
      {/* 關閉按鈕 (X) */}
      <button
        onClick={handleClose}
        className="absolute top-5 right-5 text-stone-300 hover:text-stone-700 transition-colors p-1"
        aria-label="Close"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* 頂部標籤與標題 */}
      <div className="mb-5">
        <div className="text-[10px] font-black tracking-[0.2em] text-stone-400 uppercase mb-2">
          Notice
        </div>
        <h3 className="text-[22px] font-extrabold text-stone-900 tracking-wide mb-1">
          交 易 須 知
        </h3>
        <p className="text-[11px] font-bold tracking-widest text-[#5A1216] uppercase">
          唐宋珠寶銀樓 Tangsong Jewelry
        </p>
      </div>

      {/* 條款內容區塊 */}
      <div className="text-[13px] text-stone-600 space-y-3 mb-8 leading-relaxed">
        <p>
          為保障雙方權益及配合政府法規，進行黃金與珠寶買賣前請詳閱以下規範：
        </p>
        <ul className="space-y-2 ml-1 mt-3">
          <li className="flex items-start gap-2.5">
            <span className="text-[#D4AF37] font-bold mt-0.5">•</span>
            <span>
              <strong className="text-stone-800">未滿 20 歲</strong>
              依法無法進行任何交易。
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#D4AF37] font-bold mt-0.5">•</span>
            <span>
              交易時需登記證件，請務必攜帶您的
              <strong className="text-stone-800">「身分證」正本</strong>。
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-[#D4AF37] font-bold mt-0.5">•</span>
            <span>更多詳細規範請參閱本公司的隱私與服務條款政策。</span>
          </li>
        </ul>
      </div>

      {/* 確認按鈕 */}
      <button
        onClick={handleClose}
        className="w-full bg-stone-900 text-white rounded-xl py-3.5 text-[13px] font-bold tracking-[0.15em] hover:bg-[#5A1216] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      >
        我已了解並同意
      </button>
    </div>
  )
}
