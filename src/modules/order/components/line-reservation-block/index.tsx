// src/modules/order/components/line-reservation-block.tsx
"use client"

import { Text } from "@medusajs/ui"
import React, { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"

type LineReservationBlockProps = {
  order: HttpTypes.StoreOrder
}

const LineReservationBlock: React.FC<LineReservationBlockProps> = ({
  order,
}) => {
  const [isMobile, setIsMobile] = useState(true)
  const [orderMessage, setOrderMessage] = useState("")

  useEffect(() => {
    // 判斷是否為手機
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera
    setIsMobile(/android|ipad|iphone|ipod/i.test(userAgent.toLowerCase()))

    // 取得商品明細
    const itemsList = order.items
      ?.map((i: any) => `- ${i.title} x ${i.quantity}`)
      .join("\n")
    const phone = order.shipping_address?.phone || "未提供"

    // 讀取暫存的預約時間
    const savedDate =
      sessionStorage.getItem("temp_visit_date") || "請與專員確認"
    const savedTime = sessionStorage.getItem("temp_visit_time") || ""
    const visitDateTime =
      savedDate !== "請與專員確認" ? `${savedDate} ${savedTime}` : savedDate

    // 訂單編號
    const displayId =
      (order as any).display_id ||
      order.id.split("_")[1]?.slice(0, 6).toUpperCase() ||
      order.id.slice(-6).toUpperCase()

    const msg = `您好，我想預約唐宋珠寶專屬鑑賞！\n預約單號：#${displayId}\n預約時間：${visitDateTime}\n----------------------\n${itemsList}\n----------------------\n聯絡電話：${phone}\n期待您的安排。`
    setOrderMessage(msg)
  }, [order])

  const triggerLineRedirect = () => {
    window.location.href = `https://line.me/R/oaMessage/@496zhpoz/?${encodeURIComponent(
      orderMessage
    )}`
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=8B2500&data=${encodeURIComponent(
    `https://line.me/R/oaMessage/@496zhpoz/?${encodeURIComponent(orderMessage)}`
  )}`

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#E8E2D9] p-6 flex flex-col md:flex-row items-center justify-between gap-6 my-8 rounded-lg shadow-sm">
      <div className="flex-1">
        <h3 className="text-xl font-serif text-[#8B2500] mb-2 font-bold tracking-widest">
          最後一步：聯繫專屬顧問
        </h3>
        <Text className="text-stone-600 text-sm leading-relaxed mb-4">
          您的預約訂單已成立！為確保能為您安排專屬時段，請
          {isMobile ? "點擊下方按鈕" : "掃描右方條碼"}，系統將自動帶入明細至
          LINE 官方帳號，由專員為您服務。
        </Text>

        {isMobile && (
          <button
            onClick={triggerLineRedirect}
            className="w-full md:w-auto bg-[#06C755] hover:bg-[#05b34c] text-white font-bold py-3 px-8 rounded-full shadow transition-transform transform hover:scale-105 tracking-widest"
          >
            點擊前往 LINE 聯繫客服
          </button>
        )}
      </div>

      {!isMobile && (
        <div className="flex flex-col items-center shrink-0">
          <div className="p-2 border-2 border-[#8B2500] bg-white rounded-md">
            <img src={qrCodeUrl} alt="專屬條碼" className="w-32 h-32" />
          </div>
          <Text className="mt-2 text-xs text-[#8B2500] font-bold tracking-widest">
            請用手機掃描
          </Text>
        </div>
      )}
    </div>
  )
}

export default LineReservationBlock
