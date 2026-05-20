"use client"

import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import { placeOrder, initiatePaymentSession } from "@lib/data/cart"

type PaymentButtonProps = {
  cart: any
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const handleLineCheckout = async () => {
    if (submitting) return

    const savedDate = sessionStorage.getItem("temp_visit_date")
    const savedTime = sessionStorage.getItem("temp_visit_time")

    if (!savedDate || !savedTime) {
      setErrorMessage(
        "請先在上方步驟點擊「編輯」，選擇完整的「預約來店日期與時段」"
      )
      return
    }

    setSubmitting(true)
    setErrorMessage(null)
    setDebugInfo(null)

    console.log("🛒 [Debug 1] 開始結帳流程, 目前購物車狀態:", cart.id)

    // ==========================================
    // 🔪 已經將 LINE 通知 API 拔除！
    // 為了確認是不是它導致死鎖，我們暫時不要在結帳前呼叫任何自訂 API。
    // ==========================================

    // ==========================================
    // 2. 綁定付款與建立訂單
    // ==========================================
    const executeCheckout = async (retries = 3, delay = 1000) => {
      try {
        console.log(
          `💳 [Debug 2] 嘗試綁定付款模組 (剩餘重試次數: ${retries})...`
        )

        try {
          await initiatePaymentSession(cart, {
            provider_id: "pp_system_default",
          })
          console.log("✅ [Debug 3] 付款模組綁定成功")
        } catch (sessionErr: any) {
          throw new Error(`付款綁定失敗: ${sessionErr?.message || sessionErr}`)
        }

        console.log("⏳ [Debug 4] 等待 500ms 緩衝...")
        await new Promise((resolve) => setTimeout(resolve, 500))

        console.log("📦 [Debug 5] 準備呼叫 placeOrder()...")
        await placeOrder()
        console.log("✅ [Debug 6] placeOrder() 執行成功！準備跳轉...")
      } catch (error: any) {
        console.log("🚨 [Debug 7] 捕獲到錯誤:", error)

        const isRedirect =
          error?.name === "NEXT_REDIRECT" ||
          error?.message?.includes("NEXT_REDIRECT") ||
          error?.digest?.includes("NEXT_REDIRECT")

        if (isRedirect) {
          console.log("🔄 [Debug 8] 這是 NEXT_REDIRECT 跳轉，放行！")
          throw error
        }

        const isConflict =
          error?.message?.includes("request conflicted with another request") ||
          error?.message?.includes("idempotency") ||
          error?.message?.includes("lock")

        if (isConflict && retries > 0) {
          console.warn(`⚠️ [Debug] 遇到冪等性衝突，等待 ${delay}ms 後重試...`)
          setDebugInfo((prev) => `${prev || ""}\n[遇到衝突]: 嘗試重試中...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          return executeCheckout(retries - 1, delay * 1.5)
        }

        console.error("❌ [Debug 9] 建立訂單發生真實錯誤:", error)
        setDebugInfo(
          (prev) =>
            `${prev || ""}\n[建立訂單錯誤]: ${
              error?.message || JSON.stringify(error)
            }`
        )
        throw error
      }
    }

    try {
      await executeCheckout()
    } catch (error: any) {
      console.error("❌ [Debug 10] 最終錯誤:", error)
      setErrorMessage("結帳發生異常，請查看下方除錯資訊！")
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        disabled={submitting}
        isLoading={submitting}
        onClick={handleLineCheckout}
        size="large"
        className="w-full font-serif tracking-widest text-base mt-6 rounded-none transition-all duration-300 bg-[#8B2500] text-[#FFFDFC] hover:bg-[#5c1800]"
        data-testid={dataTestId}
      >
        確認預約鑑賞
      </Button>

      <ErrorMessage error={errorMessage} data-testid="payment-error-message" />

      {debugInfo && (
        <div className="mt-4 p-4 bg-stone-100 border-l-4 border-red-500 text-[#5A1216] text-xs font-mono whitespace-pre-wrap rounded-r-md text-left shadow-inner break-words">
          <p className="font-bold mb-2">🛠️ 系統回傳的真實除錯資訊：</p>
          {debugInfo}
        </div>
      )}
    </>
  )
}

export default PaymentButton
