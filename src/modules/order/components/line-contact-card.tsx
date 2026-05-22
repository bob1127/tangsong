"use client"

import React, { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"

interface LineContactCardProps {
  orderId: string
  customerName?: string
  items?: any[] // 💡 新增：接收商品明細
}

export default function LineContactCard({
  orderId,
  customerName,
  items = [],
}: LineContactCardProps) {
  const officialLineId = "@nfr7726z"
  const [visitInfo, setVisitInfo] = useState("讀取中...")

  // 💡 在前端讀取客人的預約時間
  useEffect(() => {
    const date = sessionStorage.getItem("temp_visit_date") || "未指定日期"
    const time = sessionStorage.getItem("temp_visit_time") || "未指定時間"
    setVisitInfo(`${date} ${time}`)
  }, [])

  // 💡 組合商品明細字串
  const itemsText =
    items.length > 0
      ? items
          .map(
            (item) =>
              `- ${item.title} x${
                item.quantity
              } (NT$${item.unit_price?.toLocaleString()})`
          )
          .join("\n")
      : "依系統明細為主"

  // 💡 組合出給 LINE 的完整預約訊息
  const message = `你好，我是 ${
    customerName || "顧客"
  }，我剛在官網建立了預約鑑賞單！\n\n單號：${orderId}\n預約時段：${visitInfo}\n\n【預約明細】\n${itemsText}\n\n請協助我確認預約細節，謝謝！`

  // 組合 URL Scheme
  const lineUrl = `https://line.me/R/oaMessage/${officialLineId}/?${encodeURIComponent(
    message
  )}`

  return (
    <div className="mt-8 p-6 bg-[#FDF5E6] border border-[#D4AF37]/40 flex flex-col items-center justify-center text-center rounded-sm">
      <h3 className="text-xl font-serif font-bold text-[#3A0A0E] tracking-widest mb-2">
        預約單已建立！下一步：聯繫專員
      </h3>
      <p className="text-sm text-[#3A0A0E]/80 mb-6 max-w-md leading-relaxed">
        為了確保您的預約時段，請加入我們的官方
        LINE，系統將自動為您帶入單號與專員對接。
      </p>

      {/* 電腦版顯示 QR Code */}
      <div className="hidden md:block bg-white p-3 border border-gray-200 shadow-sm mb-4">
        <QRCodeSVG value={lineUrl} size={160} level="M" />
      </div>
      <p className="hidden md:block text-xs text-gray-500 mb-6">
        請使用手機掃描上方 QR Code
      </p>

      {/* 手機版與按鈕點擊 */}
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full md:w-auto bg-[#06C755] hover:bg-[#05b04b] text-white font-bold py-3 px-8 rounded-sm transition-colors duration-300 flex items-center justify-center gap-2"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-3.843 2.572-5.992z" />
        </svg>
        立即開啟 LINE 聯繫專員
      </a>
    </div>
  )
}
