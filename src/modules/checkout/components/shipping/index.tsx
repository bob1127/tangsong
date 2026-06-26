"use client"

import { Radio, RadioGroup } from "@headlessui/react"
import { translateCheckoutError } from "@lib/util/checkout-error"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, Heading, Text } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
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

  const [visitDate, setVisitDate] = useState("")
  const [visitTime, setVisitTime] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  useEffect(() => {
    const savedDate = sessionStorage.getItem("temp_visit_date")
    const savedTime = sessionStorage.getItem("temp_visit_time")
    if (savedDate) setVisitDate(savedDate)
    if (savedTime) setVisitTime(savedTime)
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
    if (shippingMethodId && (!visitDate || !visitTime)) {
      setError("請完整選擇您的「預計來店日期與時段」喔！")
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
        setError(translateCheckoutError(err.message))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

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

        {/* 🚀 關鍵修正：放寬條件！只要沒有展開，且已有選擇配送方式，就顯示編輯按鈕 */}
        {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-[#8B2500] hover:text-[#5c1800] font-serif font-bold tracking-widest text-sm"
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
                目前僅提供到店取貨及現場付款
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

                {shippingMethodId && (
                  <div className="mt-6 p-6 bg-[#FFFDFC] border border-[#E8E2D9] animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center gap-2 mb-4 border-b border-[#E8E2D9] pb-2">
                      <div className="w-1 h-4 bg-[#8B2500]"></div>
                      <Heading
                        level="h3"
                        className="text-lg font-serif text-[#4A3B32] tracking-widest"
                      >
                        預計來店時間
                      </Heading>
                    </div>
                    <Text className="text-sm text-[#7A6B5D] mb-5 font-serif">
                      為提供最高品質的專屬服務，請選擇您方便前來的日期與時段：
                    </Text>

                    <div className="flex flex-col md:flex-row gap-6 relative">
                      <div className="w-full relative">
                        <label className="text-xs text-[#C2B8A3] font-serif absolute -top-4 left-0">
                          日期
                        </label>
                        <input
                          type="date"
                          value={visitDate}
                          min={today}
                          onChange={(e) => {
                            setVisitDate(e.target.value)
                            setError(null)
                            sessionStorage.setItem(
                              "temp_visit_date",
                              e.target.value
                            )
                          }}
                          className="w-full p-3 bg-transparent text-[#4A3B32] border-b border-[#C2B8A3] focus:border-[#8B2500] focus:outline-none focus:ring-0 transition-colors cursor-pointer font-serif"
                        />
                      </div>
                      <div className="w-full relative">
                        <label className="text-xs text-[#C2B8A3] font-serif absolute -top-4 left-0">
                          時段
                        </label>
                        <select
                          value={visitTime}
                          onChange={(e) => {
                            setVisitTime(e.target.value)
                            setError(null)
                            sessionStorage.setItem(
                              "temp_visit_time",
                              e.target.value
                            )
                          }}
                          className="w-full p-3 bg-transparent text-[#4A3B32] border-b border-[#C2B8A3] focus:border-[#8B2500] focus:outline-none focus:ring-0 transition-colors cursor-pointer font-serif appearance-none"
                        >
                          <option value="" disabled>
                            請選擇來店時段
                          </option>
                          <option value="11:00 - 13:00">
                            上午 11:00 - 13:00
                          </option>
                          <option value="13:00 - 15:00">
                            下午 13:00 - 15:00
                          </option>
                          <option value="15:00 - 17:00">
                            下午 15:00 - 17:00
                          </option>
                          <option value="17:00 - 19:00">
                            傍晚 17:00 - 19:00
                          </option>
                          <option value="19:00 - 21:00">
                            晚上 19:00 - 21:00
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#8B2500] pt-1">
                          <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
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
          <Text className="font-serif text-[#7A6B5D] text-sm mb-3">
            目前僅提供到店取貨及現場付款
          </Text>
          <div className="text-sm">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col w-full">
                <Text className="font-serif text-[#4A3B32] tracking-wider mb-2">
                  已選擇：{cart.shipping_methods!.at(-1)!.name}
                </Text>
                {visitDate && visitTime && (
                  <Text className="font-serif text-[#8B2500] tracking-widest text-sm">
                    預計來店：{visitDate.replace(/-/g, "/")} ({visitTime})
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
