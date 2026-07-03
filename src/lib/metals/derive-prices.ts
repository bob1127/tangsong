import type { MetalDisplayPrices, MetalPriceOffer, MetalsData } from "./types"

export function deriveMetalDisplayPrices(
  data: MetalsData | null | undefined
): MetalDisplayPrices | null {
  if (!data) return null

  const rawGold = data.base_gold_twd_qian ?? data.gold_price_qian ?? 0
  const rawPt = data.base_platinum_twd_qian ?? data.platinum_price_qian ?? 0
  const rawAg = data.base_silver_twd_qian ?? data.silver_price_qian ?? 0
  const rawPd = data.base_palladium_twd_qian ?? data.palladium_price_qian ?? 0

  const rate = data.exchange_rate_usd_twd ?? 32.0
  const updateTime =
    data.fetch_timestamp ?? data.updated_at ?? new Date().toISOString()

  const storeGoldSell = data.gold_sell ?? (rawGold > 0 ? rawGold + 800 : 0)
  const storeGoldBuy = data.gold_buy ?? (rawGold > 0 ? rawGold - 200 : 0)
  const storeGoldBullionBuy =
    data.gold_bullion_buy ?? (rawGold > 0 ? rawGold - 100 : 0)
  const storeSilverBuy =
    data.silver_buy ?? (rawAg > 0 ? rawAg - 5 : 0)
  const store18kBuy =
    data.k18_buy ?? (storeGoldBuy > 0 ? Math.round(storeGoldBuy * 0.6) : 0)
  const store14kBuy =
    data.k14_buy ?? (storeGoldBuy > 0 ? Math.round(storeGoldBuy * 0.45) : 0)
  const storePtBuy = data.pt950_buy ?? (rawPt > 0 ? rawPt - 500 : 0)
  const storePdBuy = data.pd_buy ?? (rawPd > 0 ? rawPd - 500 : 0)

  return {
    updateTime,
    storePricesUpdatedAt: data.store_prices_updated_at ?? null,
    rate,
    rawGold,
    rawPt,
    rawAg,
    rawPd,
    storeGoldSell,
    storeGoldBuy,
    storeGoldBullionBuy,
    store18kBuy,
    store14kBuy,
    storeSilverBuy,
    storePtBuy,
    storePdBuy,
    intlGoldBuy: rawGold > 0 ? rawGold - 30 : 0,
    intlGoldSell: rawGold > 0 ? rawGold + 30 : 0,
    intlPtBuy: rawPt > 0 ? rawPt - 50 : 0,
    intlPtSell: rawPt > 0 ? rawPt + 50 : 0,
    intlAgBuy: rawAg > 0 ? rawAg - 0.5 : 0,
    intlAgSell: rawAg > 0 ? rawAg + 0.5 : 0,
    intlPdBuy: rawPd > 0 ? rawPd - 50 : 0,
    intlPdSell: rawPd > 0 ? rawPd + 50 : 0,
  }
}

/** 門市牌告價項目（與首頁價格表一致，供結構化資料使用） */
export function buildStorePriceOffers(
  prices: MetalDisplayPrices
): MetalPriceOffer[] {
  const items: MetalPriceOffer[] = [
    { name: "黃金賣出牌價", price: prices.storeGoldSell, unitText: "台錢", offerType: "sell" },
    { name: "黃金條塊回收價", price: prices.storeGoldBullionBuy, unitText: "台錢", offerType: "buy" },
    { name: "黃金飾金回收價", price: prices.storeGoldBuy, unitText: "台錢", offerType: "buy" },
    { name: "18K金回收價", price: prices.store18kBuy, unitText: "台錢", offerType: "buy" },
    { name: "14K金回收價", price: prices.store14kBuy, unitText: "台錢", offerType: "buy" },
    { name: "白銀回收價", price: prices.storeSilverBuy, unitText: "台錢", offerType: "buy" },
    { name: "白金Pt950回收價", price: prices.storePtBuy, unitText: "台錢", offerType: "buy" },
    { name: "鈀金Pd回收價", price: prices.storePdBuy, unitText: "台錢", offerType: "buy" },
  ]

  return items.filter((item) => item.price > 0)
}

export function getPriceValidUntil(updateTime: string): string {
  const next = new Date(updateTime)
  next.setDate(next.getDate() + 1)
  return next.toISOString().split("T")[0]
}
