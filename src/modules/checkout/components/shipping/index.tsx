"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || null
  )

  // 💡 預計來店日期的狀態
  const [visitDate, setVisitDate] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  // 載入時讀取舊的日期紀錄
  useEffect(() => {
    const savedDate = sessionStorage.getItem("temp_visit_date")
    if (savedDate) {
      setVisitDate(savedDate)
    }
  }, [])

  useEffect(() => {
    setIsLoadingPrices(true)

    if (availableShippingMethods?.length) {
      const promises = availableShippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      } else {
        setIsLoadingPrices(false)
      }
    }
  }, [availableShippingMethods])

  const handleEdit = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const handleSubmit = () => {
    // 💡 防呆檢查：只要有選物流，就一定要選日期
    if (shippingMethodId && !visitDate) {
      setError("請先選擇您的「預計來店日期」喔！")
      return
    }

    setError(null)
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (id: string) => {
    setError(null)
    let currentId: string | null = null
    setIsLoading(true)

    setShippingMethodId((prev) => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err) => {
        setShippingMethodId(currentId)
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  // 取得今天的日期作為最小值限制
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="bg-[#FAF8F5] p-6 rounded-sm border border-[#E8E2D9]">
      <div className="flex flex-row items-center justify-between mb-6 border-b border-[#E8E2D9] pb-4">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-2xl font-serif text-[#4A3B32] gap-x-2 items-baseline tracking-widest",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && cart.shipping_methods?.length === 0,
            }
          )}
        >
          配送方式
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <span className="text-[#8B2500]">✓</span>
          )}
        </Heading>
        {!isOpen && cart?.shipping_address && cart?.email && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-[#8B2500] hover:text-[#5c1800] font-serif tracking-widest text-sm"
              data-testid="edit-delivery-button"
            >
              編輯
            </button>
          </Text>
        )}
      </div>

      {isOpen ? (
        <>
          <div className="grid">
            <div className="flex flex-col mb-4">
              <span className="font-serif text-[#4A3B32] tracking-wider text-lg">
                請選擇配送方式
              </span>
              <span className="mt-1 text-[#7A6B5D] text-sm font-serif">
                您希望如何收取商品？
              </span>
            </div>

            <div data-testid="delivery-options-container">
              <div className="pb-4">
                <RadioGroup
                  value={shippingMethodId}
                  onChange={(v) => {
                    if (v) handleSetShippingMethod(v)
                  }}
                >
                  {availableShippingMethods?.map((option) => {
                    const isDisabled =
                      option.price_type === "calculated" &&
                      !isLoadingPrices &&
                      typeof calculatedPricesMap[option.id] !== "number"

                    return (
                      <Radio
                        key={option.id}
                        value={option.id}
                        data-testid="delivery-option-radio"
                        disabled={isDisabled}
                        className={clx(
                          "flex items-center justify-between text-sm cursor-pointer py-4 px-6 mb-3 border transition-all duration-300",
                          {
                            "border-[#8B2500] bg-[#FFFDFC] shadow-[0_0_0_1px_#8B2500]":
                              option.id === shippingMethodId,
                            "border-[#E8E2D9] hover:border-[#8B2500]/50":
                              option.id !== shippingMethodId,
                            "cursor-not-allowed opacity-50": isDisabled,
                          }
                        )}
                      >
                        <div className="flex items-center gap-x-4">
                          {/* 💡 客製化：宋代風雅的單選圈圈 */}
                          <div
                            className={clx(
                              "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                              {
                                "border-[#8B2500]":
                                  option.id === shippingMethodId,
                                "border-[#C2B8A3]":
                                  option.id !== shippingMethodId,
                              }
                            )}
                          >
                            {option.id === shippingMethodId && (
                              <div className="w-2 h-2 bg-[#8B2500] rounded-full" />
                            )}
                          </div>
                          <span className="font-serif text-[#4A3B32] tracking-wider font-bold">
                            {option.name}
                          </span>
                        </div>
                        <span className="justify-self-end text-[#4A3B32] font-serif">
                          {option.price_type === "flat" ? (
                            convertToLocale({
                              amount: option.amount!,
                              currency_code: cart?.currency_code,
                            })
                          ) : calculatedPricesMap[option.id] ? (
                            convertToLocale({
                              amount: calculatedPricesMap[option.id],
                              currency_code: cart?.currency_code,
                            })
                          ) : isLoadingPrices ? (
                            <Loader />
                          ) : (
                            "-"
                          )}
                        </span>
                      </Radio>
                    )
                  })}
                </RadioGroup>

                {/* 💡 魔法區塊：只有UI改變，日期選擇邏輯完全保留 */}
                {shippingMethodId && (
                  <div className="mt-6 p-6 bg-[#FFFDFC] border border-[#E8E2D9] animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-2 mb-4 border-b border-[#E8E2D9] pb-2">
                      <div className="w-1 h-4 bg-[#8B2500]"></div>
                      <Heading
                        level="h3"
                        className="text-lg font-serif text-[#4A3B32] tracking-widest"
                      >
                        預計來店日期
                      </Heading>
                    </div>
                    <Text className="text-sm text-[#7A6B5D] mb-5 font-serif">
                      為提供最高品質的專屬服務，請選擇您方便前來的日期：
                    </Text>

                    <div className="relative">
                      <input
                        type="date"
                        value={visitDate}
                        min={today}
                        onChange={(e) => {
                          setVisitDate(e.target.value)
                          setError(null) // 選了日期就清除錯誤
                          sessionStorage.setItem(
                            "temp_visit_date",
                            e.target.value
                          )
                        }}
                        className="w-full p-3 bg-transparent text-[#4A3B32] border-b border-[#C2B8A3] focus:border-[#8B2500] focus:outline-none focus:ring-0 transition-colors cursor-pointer font-serif"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            <Button
              size="large"
              className="mt-6 w-full md:w-auto bg-[#8B2500] hover:bg-[#5c1800] text-[#FFFDFC] font-serif tracking-widest transition-colors rounded-none px-12"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!cart.shipping_methods?.[0]}
              data-testid="submit-delivery-option-button"
            >
              前往下一步
            </Button>
          </div>
        </>
      ) : (
        <div>
          <div className="text-sm">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col w-full">
                <Text className="font-serif text-[#4A3B32] tracking-wider mb-2">
                  已選擇：{cart.shipping_methods!.at(-1)!.name}
                </Text>
                {/* 💡 關閉狀態時，顯示客人選好的日期 */}
                {visitDate && (
                  <Text className="font-serif text-[#8B2500] tracking-widest text-sm">
                    預計來店：{visitDate.replace(/-/g, "/")}
                  </Text>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Shipping
