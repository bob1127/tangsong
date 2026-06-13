import { fetchLatestMetals } from "@lib/metals/fetch-metals"
import type { MetalsData } from "@lib/metals/types"

export async function getLatestMetals(): Promise<MetalsData | null> {
  // 牌告價由後台手動設定，不可快取舊 API 回應（否則新欄位如 gold_bullion_buy 會卡住）
  return fetchLatestMetals({ revalidate: false })
}
