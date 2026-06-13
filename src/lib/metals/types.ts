export interface MetalsData {
  updated_at?: string
  fetch_timestamp?: string
  exchange_rate_usd_twd: number
  gold_price_qian?: number
  platinum_price_qian?: number
  silver_price_qian?: number
  palladium_price_qian?: number
  base_gold_twd_qian?: number
  base_platinum_twd_qian?: number
  base_silver_twd_qian?: number
  base_palladium_twd_qian?: number
  gold_sell?: number
  gold_buy?: number
  gold_bullion_buy?: number
  silver_buy?: number
  k18_buy?: number
  k14_buy?: number
  pt950_sell?: number
  pt950_buy?: number
  pd_sell?: number
  pd_buy?: number
}

export interface MetalDisplayPrices {
  updateTime: string
  rate: number
  rawGold: number
  rawPt: number
  rawAg: number
  rawPd: number
  storeGoldSell: number
  storeGoldBuy: number
  storeGoldBullionBuy: number
  store18kBuy: number
  store14kBuy: number
  storeSilverBuy: number
  storePtBuy: number
  storePdBuy: number
  intlGoldBuy: number
  intlGoldSell: number
  intlPtBuy: number
  intlPtSell: number
  intlAgBuy: number
  intlAgSell: number
  intlPdBuy: number
  intlPdSell: number
}

export interface MetalPriceOffer {
  name: string
  price: number
  unitText: string
  offerType: "buy" | "sell"
}
