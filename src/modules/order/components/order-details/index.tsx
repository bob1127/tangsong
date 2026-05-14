import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  // 💡 針對 Medusa 狀態進行中文化映射
  const formatStatus = (str: string) => {
    const statusMap: Record<string, string> = {
      // 履行狀態 (Fulfillment Status)
      not_fulfilled: "待處理",
      partially_fulfilled: "部分出貨",
      fulfilled: "已出貨",
      canceled: "已取消",
      shipped: "已寄送",
      returned: "已退貨",
      // 付款狀態 (Payment Status)
      not_paid: "未付款",
      awaiting: "待確認",
      captured: "已付款",
      partially_refunded: "部分退款",
      refunded: "已退款",
      requires_action: "需執行操作",
    }

    return statusMap[str] || str
  }

  return (
    <div>
      <Text>
        我們已將訂單確認詳情發送至{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        。
      </Text>
      <Text className="mt-2">
        訂單日期：{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        訂單編號： <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              訂單狀態：{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              付款狀態：{" "}
              <span
                className="text-ui-fg-subtle "
                data-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
