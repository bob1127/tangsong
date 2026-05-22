import { retrieveOrder } from "@lib/data/orders"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

// 👉 引入我們剛剛新增的卡片元件 (請確認路徑是否與你存放的一致)
import LineContactCard from "@modules/order/components/line-contact-card"

type Props = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    return notFound()
  }

  // 取得訂單編號
  const orderId = order.display_id ? String(order.display_id) : order.id
  // 取得顧客名字
  const customerName =
    order.billing_address?.first_name || order.customer?.first_name || ""

  return (
    <div className="bg-white min-h-screen">
      {/* 原本的結帳成功明細模板 */}
      <OrderCompletedTemplate order={order} />

      {/* 👉 我們新增的 LINE 自動引導區塊 */}
      <div className="max-w-3xl mx-auto px-4 pb-20 -mt-8">
        <LineContactCard orderId={orderId} customerName={customerName} />
      </div>
    </div>
  )
}
