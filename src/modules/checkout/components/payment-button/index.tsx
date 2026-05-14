"use client"

import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Text, clx } from "@medusajs/ui"
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

    // ==========================================
    // 1. 準備 Payload 與背景通知
    // ==========================================
    const visitDateTime = `${savedDate} ${savedTime}`
    const payload = {
      cartId: cart.id,
      cartItems: cart.items,
      email: cart.email || "未提供",
      firstName: cart.shipping_address?.first_name,
      lastName: cart.shipping_address?.last_name,
      phone: cart.shipping_address?.phone,
      visitDate: visitDateTime,
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

    fetch(`${backendUrl}/store/line-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": publishableKey,
      },
      body: JSON.stringify(payload),
    }).catch(() => {})

    // ==========================================
    // 2. 綁定付款模組 (如果失敗不影響後續流程)
    // ==========================================
    try {
      await initiatePaymentSession(cart, {
        provider_id: "pp_system_default",
      })
    } catch (sessionErr) {
      console.log("付款綁定忽略:", sessionErr)
    }

    // ==========================================
    // 3. 建立訂單與跳轉 (獨立區塊，避免被外層 catch 吃掉跳轉動作)
    // ==========================================
    try {
      // 呼叫 placeOrder，成功的話內部會自動執行 redirect
      // 如果 redirect 發生，下面的 setSubmitting(false) 就不會執行
      await placeOrder()

      // 注意：Next.js 的 redirect 是透過拋出一個特殊的 Error 來實現的！
      // 如果外層沒有正確放行，跳轉就會失敗！
    } catch (error: any) {
      // Next.js 的跳轉機制會丟出一個名字叫 NEXT_REDIRECT 的錯誤
      // 如果是這個錯誤，我們必須放行讓它跳轉！
      if (error.message && error.message === "NEXT_REDIRECT") {
        throw error // 放行跳轉
      }

      // 如果是真的結帳失敗，我們才印出錯誤並解除轉圈圈
      console.error("建立訂單失敗:", error)
      setErrorMessage(
        "您的預約訂單可能已經建立，但系統跳轉發生異常，請至「會員中心」查看訂單紀錄。"
      )
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={submitting}
        isLoading={submitting}
        onClick={handleLineCheckout}
        size="large"
        className="w-full font-serif tracking-widest text-base mt-6 rounded-none transition-all duration-300 bg-[#8B2500] text-[#FFFDFC] hover:bg-[#5c1800]"
        data-testid={dataTestId}
      >
        確認預約鑑賞
      </Button>
      <ErrorMessage error={errorMessage} />
    </>
  )
}

export default PaymentButton
