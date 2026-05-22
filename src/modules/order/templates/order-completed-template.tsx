import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

import LineContactCard from "@modules/order/components/line-contact-card"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  const orderId = order.display_id ? String(order.display_id) : order.id
  const customerName =
    order.billing_address?.first_name || order.customer?.first_name || ""

  return (
    <div className="py-6 min-h-[calc(100vh-64px)] bg-[#FDF5E6]/30 flex justify-center">
      {/* 💡 這裡加上 px-4 sm:px-6 避免手機版破圖 */}
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full px-4 sm:px-6">
        {isOnboarding && <OnboardingCta orderId={order.id} />}

        {/* 💡 這裡加上 px-6 md:px-12 讓白框裡面的內容有呼吸空間，修復錯亂問題 */}
        <div
          className="flex flex-col gap-4 max-w-4xl w-full bg-white py-10 px-6 md:px-12 shadow-sm border border-[#D4AF37]/20 rounded-sm"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-[#3A0A0E] text-3xl mb-4 font-serif tracking-widest text-center"
          >
            <span>預約成功！</span>
            <span className="text-xl mt-2 text-[#3A0A0E]/80">
              您的預約鑑賞單已成功建立
            </span>
          </Heading>

          <div className="w-full mt-2 mb-6">
            {/* 💡 傳入 order.items 讓 LINE 可以抓到明細 */}
            <LineContactCard
              orderId={orderId}
              customerName={customerName}
              items={order.items || []}
            />
          </div>

          <OrderDetails order={order} />

          <Heading
            level="h2"
            className="flex flex-row text-2xl-regular font-serif text-[#3A0A0E] mt-8 border-t border-gray-100 pt-8"
          >
            預約明細
          </Heading>

          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
