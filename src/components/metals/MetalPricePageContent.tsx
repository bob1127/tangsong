"use client"

import type { MetalsData } from "@lib/metals/types"
import type { MetalPricePageConfig } from "@lib/seo/metal-price-pages"
import TradingViewChart from "../TradingViewChart"
import MetalPricePageShell from "./MetalPricePageShell"
import MetalMarketSidePanels, {
  InternationalSpotPricesTable,
  StoreListedPricesTable,
} from "./MetalMarketPanels"
import { useMetalsData } from "./useMetalsData"

type MetalPricePageContentProps = {
  pageKey: MetalPricePageConfig["key"]
  page: MetalPricePageConfig
  initialData?: MetalsData | null
}

export default function MetalPricePageContent({
  pageKey,
  page,
  initialData = null,
}: MetalPricePageContentProps) {
  const { prices, loading, error } = useMetalsData(initialData)

  if (loading) {
    return (
      <MetalPricePageShell page={page}>
        <div className="w-full h-64 bg-[#3A0A0E]/40 animate-pulse rounded-xl border border-[#D4AF37]/20" />
      </MetalPricePageShell>
    )
  }

  if (!prices) {
    return (
      <MetalPricePageShell page={page}>
        <div className="w-full h-64 bg-[#3A0A0E]/40 rounded-xl border border-[#D4AF37]/20 flex items-center justify-center text-[#FDF5E6]/70">
          暫無法載入金價資料
        </div>
      </MetalPricePageShell>
    )
  }

  return (
    <MetalPricePageShell page={page} updateTime={prices.updateTime}>
      {error && (
        <p className="text-sm text-amber-700 mb-4">
          連線異常，顯示最近一次可用資料。
        </p>
      )}

      {pageKey === "gold-price-chart" ? (
        <div className="bg-[#3A0A0E] border border-[#D4AF37]/30 overflow-hidden shadow-xl rounded-sm">
          <div className="bg-[#3A0A0E]/10 px-4 py-3.5 text-sm font-bold text-[#F3E5AB] border-b border-[#D4AF37]/20 tracking-wider">
            國際貴金屬走勢圖
          </div>
          <div className="bg-[#FAFAFA]">
            <TradingViewChart embedded />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-1 lg:col-span-3">
            {pageKey === "store-gold-prices" && (
              <StoreListedPricesTable prices={prices} />
            )}
            {pageKey === "international-gold-prices" && (
              <InternationalSpotPricesTable prices={prices} />
            )}
          </div>
          <MetalMarketSidePanels rate={prices.rate} />
        </div>
      )}
    </MetalPricePageShell>
  )
}
