"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  // 💡 關鍵修復：移除 cart.payment_collection 檢查，讓按鈕一定會顯示！
  const previousStepsCompleted =
    cart?.shipping_address && cart?.shipping_methods?.length > 0

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline font-serif tracking-widest",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          最後確認
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1 font-bold">
                請確認右方的購物車明細是否正確。
              </Text>
              <Text className="txt-medium text-ui-fg-subtle">
                點擊下方按鈕後，系統將為您建立預約單，並導向 LINE
                官方帳號由專員為您服務。
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
