"use client"

import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text, clx } from "@medusajs/ui" // 💡 已包含 clx
import React, { useState, useEffect } from "react"
import ErrorMessage from "../error-message"
import { XMark } from "@medusajs/icons"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [orderMessage, setOrderMessage] = useState("")
  const [isMobile, setIsMobile] = useState(true)
  const [hasSentNotification, setHasSentNotification] = useState(false)

  useEffect(() => {
    // 偵測裝置與讀取舊紀錄
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera
    setIsMobile(/android|ipad|iphone|ipod/i.test(userAgent.toLowerCase()))

    if (cart?.id) {
      const isSent = sessionStorage.getItem(`line_sent_${cart.id}`)
      const savedMsg = sessionStorage.getItem(`line_msg_${cart.id}`)
      if (isSent === "true" && savedMsg) {
        setHasSentNotification(true)
        setOrderMessage(savedMsg)
      }
    }
  }, [cart?.id])

  const handleLineCheckout = async () => {
    if (submitting) return

    // 💡 同時抓取客人在 Delivery 步驟選的「日期」與「時間」
    const savedDate = sessionStorage.getItem("temp_visit_date")
    const savedTime = sessionStorage.getItem("temp_visit_time")

    if (!hasSentNotification && (!savedDate || !savedTime)) {
      setErrorMessage("請先在上方步驟選擇完整的「預約來店時段」")
      return
    }

    if (hasSentNotification) {
      isMobile ? triggerLineRedirect() : setShowModal(true)
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    try {
      const visitDateTime = `${savedDate} ${savedTime}`
      const payload = {
        cartItems: cart.items,
        email: cart.email || "未提供",
        firstName: cart.shipping_address?.first_name,
        lastName: cart.shipping_address?.last_name,
        phone: cart.shipping_address?.phone,
        visitDate: visitDateTime, // 合併後傳給後端 API
      }

      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const publishableKey =
        process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

      const res = await fetch(`${backendUrl}/store/line-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": publishableKey,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "預約失敗")

      // 💡 組合給客人的專屬預約訊息
      const msg = `您好，我想預約唐宋珠寶專屬鑑賞！\n單號：#${
        data.display_id
      }\n時間：${visitDateTime}\n----------------------\n${cart.items
        ?.map((i: any) => `- ${i.title} x ${i.quantity}`)
        .join("\n")}\n----------------------\n聯絡電話：${
        cart.shipping_address?.phone
      }\n期待您的安排。`

      setOrderMessage(msg)
      setHasSentNotification(true)
      if (cart?.id) {
        sessionStorage.setItem(`line_sent_${cart.id}`, "true")
        sessionStorage.setItem(`line_msg_${cart.id}`, msg)
      }

      isMobile ? triggerLineRedirect(msg) : setShowModal(true)
      setSubmitting(false)
    } catch (error: any) {
      setErrorMessage(error.message)
      setSubmitting(false)
    }
  }

  const triggerLineRedirect = (msg?: string) => {
    const finalMsg = msg || orderMessage
    window.location.href = `https://line.me/R/oaMessage/@496zhpoz/?${encodeURIComponent(
      finalMsg
    )}`
  }

  // 💡 生成赭紅色的 QR Code (加入 color=8B2500 參數)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=8B2500&data=${encodeURIComponent(
    `https://line.me/R/oaMessage/@496zhpoz/?${encodeURIComponent(orderMessage)}`
  )}`

  return (
    <>
      <Button
        disabled={submitting}
        isLoading={submitting}
        onClick={handleLineCheckout}
        size="large"
        className={clx(
          "w-full font-serif tracking-widest text-base mt-6 rounded-none transition-all duration-300",
          hasSentNotification
            ? "bg-[#FAF8F5] border border-[#8B2500] text-[#8B2500] hover:bg-[#8B2500] hover:text-[#FFFDFC]"
            : "bg-[#8B2500] text-[#FFFDFC] hover:bg-[#5c1800]"
        )}
        data-testid={dataTestId}
      >
        {hasSentNotification ? "顯示專屬預約條碼" : "確認預約鑑賞"}
      </Button>

      <ErrorMessage error={errorMessage} />

      {/* 💡 電腦版：宋代現代風 赭紅色系彈窗 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B221B]/80 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#FAF8F5] shadow-2xl w-full max-w-sm relative border border-[#E8E2D9]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 頂部裝飾線 */}
            <div className="h-1 w-full bg-[#8B2500]"></div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#C2B8A3] hover:text-[#8B2500] transition-colors"
            >
              <XMark className="w-5 h-5" />
            </button>

            <div className="p-10 flex flex-col items-center">
              <Heading
                level="h2"
                className="text-xl font-serif text-[#8B2500] mb-4 tracking-widest border-b border-[#E8E2D9] pb-4 w-full text-center"
              >
                唐宋專屬服務
              </Heading>

              <Text className="text-sm text-[#7A6B5D] mb-8 text-center font-serif leading-relaxed tracking-wider">
                預約明細已為您準備妥當。
                <br />
                請掃描下方條碼，系統將為您接通專屬顧問。
              </Text>

              <div className="p-4 border border-[#8B2500] bg-[#FFFDFC]">
                <img src={qrCodeUrl} alt="專屬條碼" className="w-40 h-40" />
              </div>

              <Text className="mt-6 text-xs text-[#8B2500] font-serif tracking-widest">
                掃描後點擊傳送即可
              </Text>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PaymentButton
