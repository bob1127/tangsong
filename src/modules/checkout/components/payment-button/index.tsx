"use client"

import { Button } from "@medusajs/ui"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import { placeOrder } from "@lib/data/cart"
import LineContactCard from "@modules/order/components/line-contact-card"

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
  const [isSuccess, setIsSuccess] = useState(false)

  const handleCheckout = async () => {
    if (submitting) return

    setSubmitting(true)
    setErrorMessage(null)

    try {
      const result = await placeOrder()

      if (!result.ok) {
        const errMsg = result.error

        if (
          errMsg.includes("衝突") ||
          errMsg.includes("處理中") ||
          errMsg.toLowerCase().includes("conflict") ||
          errMsg.toLowerCase().includes("idempotency")
        ) {
          setIsSuccess(true)
          return
        }

        setErrorMessage(errMsg || "建立預約單時發生錯誤，請聯繫客服。")
        setSubmitting(false)
        return
      }

      setIsSuccess(true)
    } catch (err: any) {
      const isRedirect =
        err?.name === "NEXT_REDIRECT" ||
        err?.message?.includes("NEXT_REDIRECT") ||
        err?.digest?.includes("NEXT_REDIRECT")

      if (isRedirect) {
        throw err
      }

      console.error("❌ 結帳發生錯誤:", err)
      setErrorMessage(err?.message || "建立預約單時發生錯誤，請聯繫客服。")
      setSubmitting(false)
    }
  }

  if (isSuccess) {
    const tempOrderId = cart?.id
      ? cart.id.slice(-6).toUpperCase()
      : "系統處理中"
    const customerName = cart?.billing_address?.first_name || ""

    return (
      <div className="mt-6 animate-in fade-in zoom-in duration-500">
        <LineContactCard
          orderId={`(購物車號) ${tempOrderId}`}
          customerName={customerName}
          items={cart?.items}
        />
      </div>
    )
  }

  return (
    <>
      <Button
        type="button"
        disabled={submitting}
        isLoading={submitting}
        onClick={handleCheckout}
        size="large"
        className="w-full font-serif tracking-widest text-base mt-6 rounded-none transition-all duration-300 bg-[#8B2500] text-[#FFFDFC] hover:bg-[#5c1800]"
        data-testid={dataTestId}
      >
        確認預約鑑賞
      </Button>

      <ErrorMessage error={errorMessage} data-testid="payment-error-message" />
    </>
  )
}

export default PaymentButton
