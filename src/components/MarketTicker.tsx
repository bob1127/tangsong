"use client"

import { useEffect, useState } from "react"

// 👑 資料介面
interface MetalsData {
  updated_at?: string
  fetch_timestamp?: string
  exchange_rate_usd_twd: number
  gold_price_qian?: number
  platinum_price_qian?: number
  silver_price_qian?: number
  base_gold_twd_qian?: number
  base_platinum_twd_qian?: number
  base_silver_twd_qian?: number
}

// ==========================================
// 👑 店家利潤參數
// ==========================================
const STORE_SPREAD = {
  gold_sell_premium: 800,
  gold_buy_discount: -200,
  platinum_sell_premium: 1500,
  platinum_buy_discount: -500,
  silver_sell_premium: 40,
  silver_buy_discount: -20,
}

export default function MarketTicker() {
  const [data, setData] = useState<MetalsData | null>(null)
  const [loading, setLoading] = useState(true)

  // 🌟 新增：控制視窗是否收合的狀態 (預設為展開 false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("http://localhost:9000/store/metals", {
          headers: {
            "x-publishable-api-key":
              process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
              "pk_88148e6cb6c2e437308f3be55ffc48bccd3a8956ebd9f0073cc9901382c39bb5",
          },
        })
        const json = await res.json()

        let targetData = null
        if (json.metals && Array.isArray(json.metals)) {
          targetData = json.metals[0]
        } else if (json.data && Array.isArray(json.data)) {
          targetData = json.data[0]
        } else if (json.data) {
          targetData = json.data
        } else if (Array.isArray(json)) {
          targetData = json[0]
        }

        if (targetData) {
          setData(targetData)
        } else {
          console.error("找不到相容的資料格式！")
        }
      } catch (error) {
        console.error("無法取得金價:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 180000)
    return () => clearInterval(interval)
  }, [])

  // 🚨 骨架屏 (Loading 狀態) 色系同步更新為深紅色
  if (loading) {
    return (
      <div className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[999] w-72 p-5 bg-[#3A0A0E]/90 backdrop-blur-md border border-[#D4AF37]/20 rounded-xl  animate-pulse transform origin-right scale-90 md:scale-100">
        <div className="h-4 bg-[#D4AF37]/20 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-[#5A1216]/50 rounded"></div>
          <div className="h-12 bg-[#5A1216]/50 rounded"></div>
        </div>
      </div>
    )
  }

  if (!data) return null

  const rawGold = data.base_gold_twd_qian ?? data.gold_price_qian ?? 0
  const rawPt = data.base_platinum_twd_qian ?? data.platinum_price_qian ?? 0
  const rawAg = data.base_silver_twd_qian ?? data.silver_price_qian ?? 0
  const rate = data.exchange_rate_usd_twd ?? 32.0

  if (rawGold === 0) return null

  const goldSell = rawGold + STORE_SPREAD.gold_sell_premium
  const goldBuy = rawGold + STORE_SPREAD.gold_buy_discount
  const ptSell = rawPt + STORE_SPREAD.platinum_sell_premium
  const ptBuy = rawPt + STORE_SPREAD.platinum_buy_discount
  const agSell = rawAg + STORE_SPREAD.silver_sell_premium
  const agBuy = rawAg + STORE_SPREAD.silver_buy_discount

  // ==========================================
  // 🌟 狀態一：收合時顯示的「側邊小標籤」
  // ==========================================
  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[999] flex flex-col items-center justify-center gap-1 bg-[#3A0A0E]/95 backdrop-blur-md border border-r-0 border-[#D4AF37]/50 p-2 py-4 rounded-l-xl  transition-all duration-300 hover:bg-[#5A1216] group"
      >
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mb-1"></span>
        <span className="text-[#D4AF37] font-bold text-sm group-hover:text-[#FDF5E6]">
          牌
        </span>
        <span className="text-[#D4AF37] font-bold text-sm group-hover:text-[#FDF5E6]">
          告
        </span>
        <span className="text-[#D4AF37] font-bold text-sm group-hover:text-[#FDF5E6]">
          價
        </span>
        <span className="text-[#E8DCC4]/50 text-xs mt-1">◀</span>
      </button>
    )
  }

  // ==========================================
  // 🌟 狀態二：展開時顯示的「完整面板」(古典燕脂紅配色)
  // ==========================================
  return (
    <div className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[999] flex flex-col gap-4 w-[300px] md:w-[320px] p-5 bg-[#3A0A0E]/95 backdrop-blur-md border border-[#D4AF37]/40 rounded-xl   transition-all duration-500 hover:border-[#D4AF37]/70 transform origin-right scale-90 md:scale-100">
      {/* 標頭區塊 */}
      <div className="border-b border-[#D4AF37]/30 pb-2 relative">
        <div className="flex items-center justify-between pr-6">
          <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            門市牌告價
          </h3>
        </div>
        <p className="text-[10px] text-[#E8DCC4]/60 mt-1">
          國際匯率：1 USD = {rate.toFixed(2)} TWD
        </p>

        {/* 🌟 收合按鈕 (右上角 X) */}
        <button
          onClick={() => setIsCollapsed(true)}
          className="absolute right-0 top-0 text-[#E8DCC4]/50 hover:text-[#FDF5E6] hover:rotate-90 transition-all duration-300 w-6 h-6 flex items-center justify-center text-lg"
          title="收起面板"
        >
          ✕
        </button>
      </div>

      {/* 價格列表區塊 */}
      <div className="flex flex-col gap-3">
        {/* 黃金飾金 (帶有暗紅漸層凸顯) */}
        <div className="bg-gradient-to-r from-[#73171C]/60 to-transparent p-3 rounded-lg border border-[#D4AF37]/30">
          <div className="text-[#D4AF37] text-sm font-bold tracking-widest mb-2 border-b border-[#D4AF37]/20 pb-1">
            黃金飾金{" "}
            <span className="text-xs font-normal opacity-70">(每錢)</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[#E8DCC4]/60 text-[10px] mb-0.5">
                賣出價
              </span>
              <span className="font-mono text-xl font-bold text-[#FDF5E6]">
                {goldSell.toLocaleString()}
              </span>
            </div>
            <div className="w-[1px] h-8 bg-[#D4AF37]/20"></div>
            <div className="flex flex-col text-right">
              <span className="text-[#E8DCC4]/60 text-[10px] mb-0.5">
                回收價
              </span>
              <span className="font-mono text-lg font-bold text-[#D4AF37]/80">
                {goldBuy.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 白金 Pt950 */}
        <div className="bg-[#5A1216]/50 p-3 rounded-lg border border-[#D4AF37]/15">
          <div className="text-[#E4E4E4] text-xs font-bold tracking-widest mb-2 border-b border-[#D4AF37]/15 pb-1">
            白金 Pt950{" "}
            <span className="text-[10px] font-normal opacity-70">(每錢)</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[#E8DCC4]/50 text-[10px]">賣出</span>
              <span className="font-mono text-base font-semibold text-[#FDF5E6]">
                {ptSell.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[#E8DCC4]/50 text-[10px]">回收</span>
              <span className="font-mono text-base font-semibold text-[#E4E4E4]/70">
                {ptBuy.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 白銀 */}
        <div className="flex justify-between items-center bg-[#5A1216]/40 px-3 py-2 rounded-lg border border-[#D4AF37]/10">
          <span className="text-xs tracking-widest text-[#D1D5DB] font-bold">
            白銀{" "}
            <span className="text-[10px] font-normal opacity-70">(每錢)</span>
          </span>
          <div className="flex gap-4 font-mono text-sm">
            <span className="text-[#FDF5E6]">售 {agSell.toLocaleString()}</span>
            <span className="text-[#D1D5DB]/70">
              收 {agBuy.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 聯絡按鈕 (改為雅緻金底，深紅字) */}
      <button className="mt-1 w-full py-2.5 bg-[#D4AF37] hover:bg-[#B8942E] text-[#3A0A0E] font-bold text-sm tracking-widest transition-colors rounded shadow-[0_0_15px_rgba(212,175,55,0.3)]">
        聯絡我們 / 預約鑑價
      </button>
    </div>
  )
}
