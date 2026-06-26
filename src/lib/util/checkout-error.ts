/** 將 Medusa / 結帳 API 英文錯誤轉成中文 */
export function translateCheckoutError(message: string): string {
  const text = message.trim()
  const lower = text.toLowerCase()

  if (lower.includes("already completed")) {
    return "此購物車已完成結帳，請重新加入商品後再試。"
  }
  if (lower.includes("no existing cart found")) {
    return "找不到購物車，請重新加入商品。"
  }
  if (lower.includes("no form data found")) {
    return "表單資料遺失，請重新填寫。"
  }
  if (lower.includes("no response received")) {
    return "無法連線至伺服器，請稍後再試。"
  }
  if (lower.includes("payment") && lower.includes("not authorized")) {
    return "付款尚未完成授權，請稍候再試或聯絡客服。"
  }
  if (lower.includes("email") && lower.includes("required")) {
    return "請填寫聯絡信箱，或確認電話欄位已填寫。"
  }
  if (lower.includes("shipping") && lower.includes("required")) {
    return "請先選擇到店取貨方式。"
  }
  if (lower.includes("conflict") || lower.includes("idempotency")) {
    return "訂單處理中，請稍候或聯絡客服確認是否已建立成功。"
  }
  if (lower.startsWith("error setting up the request:")) {
    const detail = text.replace(/^error setting up the request:\s*/i, "")
    return translateCheckoutError(detail)
  }

  return text
}
