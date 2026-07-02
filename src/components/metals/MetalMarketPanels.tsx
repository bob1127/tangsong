import type { MetalDisplayPrices } from "@lib/metals/types"
import { formatMetalPrice } from "@lib/metals/format"

type MetalMarketSidePanelsProps = {
  rate: number
}

export default function MetalMarketSidePanels({
  rate,
}: MetalMarketSidePanelsProps) {
  return (
    <div className="col-span-1 space-y-6">
      <div className="bg-[#3A0A0E] border border-[#D4AF37]/30 overflow-hidden shadow-md rounded-sm">
        <div className="bg-[#3A0A0E] px-4 py-3 text-sm font-bold text-[#F3E5AB] border-b border-[#D4AF37]/20 tracking-wider">
          新台幣匯率表
        </div>
        <table className="w-full text-sm text-left">
          <tbody>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/10 transition-colors">
              <td className="py-3 px-4 text-[#FDF5E6]">美元 USD</td>
              <td className="py-3 px-4 text-right text-[#FFD3D3] font-bold">
                {rate.toFixed(3)}
              </td>
            </tr>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/10 transition-colors bg-black/10">
              <td className="py-3 px-4 text-[#FDF5E6]">人民幣 CNY</td>
              <td className="py-3 px-4 text-right text-[#FFD3D3] font-bold">
                4.425
              </td>
            </tr>
            <tr className="hover:bg-black/10 transition-colors">
              <td className="py-3 px-4 text-[#FDF5E6]">歐元 EUR</td>
              <td className="py-3 px-4 text-right text-[#A3E635] font-bold">
                34.612
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-[#3A0A0E] border border-[#D4AF37]/30 overflow-hidden shadow-md rounded-sm">
        <div className="bg-[#3A0A0E] px-4 py-3 text-sm font-bold text-[#F3E5AB] border-b border-[#D4AF37]/20 tracking-wider">
          國際金融指數
        </div>
        <table className="w-full text-sm text-left">
          <tbody>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/10 transition-colors">
              <td className="py-3 px-4 text-[#FDF5E6]">台灣加權</td>
              <td className="py-3 px-4 text-right text-[#FFD3D3] font-bold">
                20,352.14
              </td>
            </tr>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/10 transition-colors bg-black/10">
              <td className="py-3 px-4 text-[#FDF5E6]">美元指數</td>
              <td className="py-3 px-4 text-right text-[#A3E635] font-bold">
                104.25
              </td>
            </tr>
            <tr className="hover:bg-black/10 transition-colors">
              <td className="py-3 px-4 text-[#FDF5E6]">紐約原油</td>
              <td className="py-3 px-4 text-right text-[#FFD3D3] font-bold">
                85.43
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

type StoreListedPricesTableProps = {
  prices: MetalDisplayPrices
}

export function StoreListedPricesTable({ prices }: StoreListedPricesTableProps) {
  return (
    <div className="bg-gradient-to-br from-[#3A0A0E] to-[#801b15] border border-[#D4AF37]/40 overflow-hidden shadow-xl rounded-sm">
      <div className="bg-black/15 px-4 py-3.5 text-sm font-bold text-[#F3E5AB] border-b border-[#D4AF37]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <span className="tracking-widest font-serif text-base">
          唐宋珠寶 實體門市牌告價 (新台幣 / 台錢)
        </span>
        <span className="text-xs font-normal text-[#FDF5E6]/70">
          不強迫交易 ‧ 儀器精準檢測 ｜ 實際價格依門市內公布為準
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-[#3A0A0E]/50 text-[#F3E5AB] text-xs tracking-wider">
            <tr>
              <th className="py-3 px-4 font-bold w-1/4">商品項目</th>
              <th className="py-3 px-4 font-normal w-1/4">單位</th>
              <th className="py-3 px-4 font-bold w-1/4">賣出價 (NT$)</th>
              <th className="py-3 px-4 font-bold w-1/4">回收價 (NT$)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors">
              <td className="py-4 px-4 text-[#FDF5E6] font-bold text-base tracking-widest">
                黃金賣出牌價
              </td>
              <td className="py-4 px-4 text-[#FDF5E6]/80">台錢</td>
              <td className="py-4 px-4 text-xl font-bold text-[#FDF5E6] drop-shadow-md">
                {formatMetalPrice(prices.storeGoldSell)}
              </td>
              <td className="py-4 px-4 text-xl font-medium text-[#FDF5E6]/30">
                —
              </td>
            </tr>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors bg-black/10">
              <td className="py-4 px-4 text-[#F3E5AB]/90 font-bold text-base tracking-widest">
                黃金條塊回收價
              </td>
              <td className="py-4 px-4 text-[#FDF5E6]/80">台錢</td>
              <td className="py-4 px-4 text-xl font-medium text-[#FDF5E6]/30">
                —
              </td>
              <td className="py-4 px-4 text-xl font-bold text-[#F3E5AB]">
                {formatMetalPrice(prices.storeGoldBullionBuy)}
              </td>
            </tr>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors">
              <td className="py-4 px-4 text-[#F3E5AB] font-bold text-base tracking-widest">
                黃金飾金回收價
              </td>
              <td className="py-4 px-4 text-[#FDF5E6]/80">台錢</td>
              <td className="py-4 px-4 text-xl font-medium text-[#FDF5E6]/30">
                —
              </td>
              <td className="py-4 px-4 text-xl font-bold text-[#F3E5AB]">
                {formatMetalPrice(prices.storeGoldBuy)}
              </td>
            </tr>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors bg-black/10">
              <td className="py-3 px-4 text-[#F3E5AB]/90 font-bold text-base tracking-widest">
                18K 金回收價
              </td>
              <td className="py-3 px-4 text-[#FDF5E6]/70">台錢</td>
              <td className="py-3 px-4 text-lg font-medium text-[#FDF5E6]/30">
                —
              </td>
              <td className="py-3 px-4 text-lg font-bold text-[#F3E5AB]">
                {formatMetalPrice(prices.store18kBuy)}
              </td>
            </tr>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors">
              <td className="py-3 px-4 text-[#F3E5AB]/90 font-bold text-base tracking-widest">
                14K 金回收價
              </td>
              <td className="py-3 px-4 text-[#FDF5E6]/70">台錢</td>
              <td className="py-3 px-4 text-lg font-medium text-[#FDF5E6]/30">
                —
              </td>
              <td className="py-3 px-4 text-lg font-bold text-[#F3E5AB]">
                {formatMetalPrice(prices.store14kBuy)}
              </td>
            </tr>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors bg-black/10">
              <td className="py-4 px-4 text-[#D1D5DB] font-bold text-base tracking-widest">
                白銀回收價
              </td>
              <td className="py-4 px-4 text-[#FDF5E6]/80">台錢</td>
              <td className="py-4 px-4 text-xl font-medium text-[#FDF5E6]/30">
                —
              </td>
              <td className="py-4 px-4 text-xl font-bold text-[#C1B6A4]">
                {formatMetalPrice(prices.storeSilverBuy)}
              </td>
            </tr>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors">
              <td className="py-4 px-4 text-[#E4E4E4] font-bold text-base tracking-widest">
                白金 Pt950 回收價
              </td>
              <td className="py-4 px-4 text-[#FDF5E6]/80">台錢</td>
              <td className="py-4 px-4 text-xl font-medium text-[#FDF5E6]/30">
                —
              </td>
              <td className="py-4 px-4 text-xl font-bold text-[#E4E4E4]">
                {formatMetalPrice(prices.storePtBuy)}
              </td>
            </tr>
            <tr className="hover:bg-black/20 transition-colors bg-black/10">
              <td className="py-4 px-4 text-[#C1B6A4] font-bold text-base tracking-widest">
                鈀金 Pd 回收價
              </td>
              <td className="py-4 px-4 text-[#FDF5E6]/80">台錢</td>
              <td className="py-4 px-4 text-xl font-medium text-[#FDF5E6]/30">
                —
              </td>
              <td className="py-4 px-4 text-xl font-bold text-[#C1B6A4]">
                {formatMetalPrice(prices.storePdBuy)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

type InternationalSpotPricesTableProps = {
  prices: MetalDisplayPrices
}

export function InternationalSpotPricesTable({
  prices,
}: InternationalSpotPricesTableProps) {
  return (
    <div className="bg-[#3A0A0E] border border-[#D4AF37]/30 overflow-hidden shadow-xl rounded-sm">
      <div className="bg-[#3A0A0E]/10 px-4 py-3.5 text-sm font-bold text-[#F3E5AB] border-b border-[#D4AF37]/20 tracking-wider">
        國際現貨金價及貴金屬即時行情 (新台幣 / 台錢)
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead className="bg-black/15 text-[#F3E5AB] text-xs">
            <tr>
              <th className="py-3 px-4 font-bold tracking-wider">商品名稱</th>
              <th className="py-3 px-4 font-bold text-[#A3E635]">買入 (Bid)</th>
              <th className="py-3 px-4 font-bold text-[#FF9B9B]">賣出 (Ask)</th>
              <th className="py-3 px-4 font-medium">漲跌 (+/-)</th>
              <th className="py-3 px-4 font-normal text-[#FDF5E6]/80">
                本日最高 (估位)
              </th>
              <th className="py-3 px-4 font-normal text-[#FDF5E6]/80">
                本日最低 (估位)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors">
              <td className="py-3 px-4 text-[#F3E5AB] font-bold tracking-widest">
                黃金 Au
              </td>
              <td className="py-3 px-4 text-[#A3E635] font-bold font-mono text-base">
                {formatMetalPrice(prices.intlGoldBuy)}
              </td>
              <td className="py-3 px-4 text-[#FF9B9B] font-bold font-mono text-base">
                {formatMetalPrice(prices.intlGoldSell)}
              </td>
              <td className="py-3 px-4 text-[#FF9B9B] font-medium">—</td>
              <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                {formatMetalPrice(prices.rawGold + 160)}
              </td>
              <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                {formatMetalPrice(prices.rawGold - 150)}
              </td>
            </tr>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors bg-black/10">
              <td className="py-3 px-4 text-[#E4E4E4] font-bold tracking-widest">
                白金 Pt
              </td>
              <td className="py-3 px-4 text-[#A3E635] font-bold font-mono text-base">
                {formatMetalPrice(prices.intlPtBuy)}
              </td>
              <td className="py-3 px-4 text-[#FF9B9B] font-bold font-mono text-base">
                {formatMetalPrice(prices.intlPtSell)}
              </td>
              <td className="py-3 px-4 text-[#A3E635] font-medium">—</td>
              <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                {formatMetalPrice(prices.rawPt + 240)}
              </td>
              <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                {formatMetalPrice(prices.rawPt - 20)}
              </td>
            </tr>
            <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors">
              <td className="py-3 px-4 text-[#D1D5DB] font-bold tracking-widest">
                白銀 Ag
              </td>
              <td className="py-3 px-4 text-[#A3E635] font-bold font-mono text-base">
                {formatMetalPrice(prices.intlAgBuy)}
              </td>
              <td className="py-3 px-4 text-[#FF9B9B] font-bold font-mono text-base">
                {formatMetalPrice(prices.intlAgSell)}
              </td>
              <td className="py-3 px-4 text-[#A3E635] font-medium">—</td>
              <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                {formatMetalPrice(prices.rawAg + 10)}
              </td>
              <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                {formatMetalPrice(prices.rawAg - 6)}
              </td>
            </tr>
            <tr className="hover:bg-black/20 transition-colors bg-black/10">
              <td className="py-3 px-4 text-[#C1B6A4] font-bold tracking-widest">
                鈀金 Pd
              </td>
              <td className="py-3 px-4 text-[#A3E635] font-bold font-mono text-base">
                {formatMetalPrice(prices.intlPdBuy)}
              </td>
              <td className="py-3 px-4 text-[#FF9B9B] font-bold font-mono text-base">
                {formatMetalPrice(prices.intlPdSell)}
              </td>
              <td className="py-3 px-4 text-[#FF9B9B] font-medium">—</td>
              <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                {formatMetalPrice(prices.rawPd + 80)}
              </td>
              <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                {formatMetalPrice(prices.rawPd - 60)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
