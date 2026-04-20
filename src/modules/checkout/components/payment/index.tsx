"use client"

import { Button, Heading, Text, clx } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

const Payment = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  // 只要有選運送方式，就當作這關 Ready 了
  const paymentReady = cart?.shipping_methods?.length !== 0

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = () => {
    // 直接跳到最後一步 Review
    router.push(pathname + "?" + createQueryString("step", "review"), {
      scroll: false,
    })
  }

  return (
    <div className="bg-[#FAF8F5] p-6 rounded-sm border border-[#E8E2D9] mb-4">
      <div className="flex flex-row items-center justify-between mb-6 border-b border-[#E8E2D9] pb-4">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-2xl font-serif text-[#4A3B32] gap-x-2 items-baseline tracking-widest",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          付款方式
          {!isOpen && paymentReady && <span className="text-[#8B2500]">✓</span>}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-[#8B2500] hover:text-[#5c1800] font-serif tracking-widest text-sm transition-colors"
            >
              編輯
            </button>
          </Text>
        )}
      </div>

      <div>
        <div
          className={
            isOpen ? "block animate-in fade-in duration-500" : "hidden"
          }
        >
          {/* 💡 赭紅色飾條的高級提示框 */}
          <div className="p-5 bg-[#FFFDFC] border border-[#E8E2D9] border-l-4 border-l-[#8B2500] mb-6 text-[#7A6B5D] text-sm font-serif leading-relaxed">
            <span className="font-bold text-[#4A3B32] block mb-1 tracking-wider">
              尊榮預約，專屬為您
            </span>
            本網站提供專屬一對一服務，訂單送出後將由系統引導您至 LINE
            官方帳號，由專員為您確認庫存與後續結帳事宜。
          </div>

          <Button
            size="large"
            className="w-full md:w-auto bg-[#8B2500] hover:bg-[#5c1800] text-[#FFFDFC] font-serif tracking-widest transition-colors rounded-none px-12"
            onClick={handleSubmit}
            disabled={!paymentReady}
            data-testid="submit-payment-button"
          >
            下一步
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {paymentReady && (
            <div className="flex flex-col w-full mt-2">
              <Text className="font-serif text-[#4A3B32] tracking-wider text-sm">
                已選擇：
                <span className="font-bold text-[#8B2500]">
                  專人 LINE 預約服務
                </span>
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Payment
