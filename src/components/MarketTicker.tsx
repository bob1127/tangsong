"use client"

import { useEffect, useState } from "react"

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
  const [isCollapsed, setIsCollapsed] = useState(false)

  // 試算器狀態
  const [activeView, setActiveView] = useState<"prices" | "calc">("prices")
  const [calcMode, setCalcMode] = useState<"recycle" | "budget">("recycle")
  const [inputValue, setInputValue] = useState<string>("")

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
        if (!backendUrl) throw new Error("尚未設定後端 API 網址")

        const res = await fetch(`${backendUrl}/store/metals`, {
          headers: {
            "x-publishable-api-key": process.env
              .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
          },
        })

        if (!res.ok) throw new Error("API 請求失敗")

        const contentType = res.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("回傳格式錯誤")
        }

        const json = await res.json()
        let targetData =
          json.metals?.[0] ||
          json.data?.[0] ||
          json.data ||
          (Array.isArray(json) ? json[0] : null)

        if (targetData) setData(targetData)
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

  if (loading) {
    return (
      <div className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[999] w-72 p-5 bg-[#3A0A0E]/90 backdrop-blur-md border border-[#D4AF37]/20 rounded-xl animate-pulse">
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

  const goldSell = rawGold + STORE_SPREAD.gold_sell_premium
  const goldBuy = rawGold + STORE_SPREAD.gold_buy_discount
  const ptSell = rawPt + STORE_SPREAD.platinum_sell_premium
  const ptBuy = rawPt + STORE_SPREAD.platinum_buy_discount
  const agSell = rawAg + STORE_SPREAD.silver_sell_premium
  const agBuy = rawAg + STORE_SPREAD.silver_buy_discount

  // 試算邏輯
  const getCalcResult = () => {
    const val = parseFloat(inputValue)
    if (isNaN(val) || val <= 0) return 0
    if (calcMode === "recycle") {
      return Math.round(val * goldBuy) // 秤重(錢) * 回收價
    } else {
      return (val / goldSell).toFixed(3) // 預算 / 賣出價 = 重量
    }
  }

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[999] flex flex-col items-center justify-center gap-1 bg-[#3A0A0E]/95 backdrop-blur-md border border-r-0 border-[#D4AF37]/50 p-2 py-4 rounded-l-xl transition-all duration-300 hover:bg-[#5A1216] group shadow-2xl"
      >
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mb-1"></span>
        <span className="text-[#D4AF37] font-bold text-sm">牌</span>
        <span className="text-[#D4AF37] font-bold text-sm">告</span>
        <span className="text-[#D4AF37] font-bold text-sm">價</span>
        <span className="text-[#E8DCC4]/50 text-xs mt-1">◀</span>
      </button>
    )
  }

  return (
    <div className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[999] flex flex-col gap-4 w-[310px] md:w-[330px] p-5 bg-[#3A0A0E]/95 backdrop-blur-md border border-[#D4AF37]/40 rounded-2xl transition-all duration-500 hover:border-[#D4AF37]/70 transform origin-right scale-90 md:scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/30 pb-2 relative">
        <div className="flex items-center justify-between pr-6">
          <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            唐宋珠寶即時行情
          </h3>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-[10px] text-[#E8DCC4]/60">
            1 USD = {rate.toFixed(2)} TWD
          </p>
          <div className="flex bg-black/30 rounded-md p-0.5 border border-[#D4AF37]/20">
            <button
              onClick={() => setActiveView("prices")}
              className={`px-2 py-0.5 text-[9px] rounded transition-all ${
                activeView === "prices"
                  ? "bg-[#D4AF37] text-[#3A0A0E] font-bold"
                  : "text-[#D4AF37]/50"
              }`}
            >
              牌價
            </button>
            <button
              onClick={() => setActiveView("calc")}
              className={`px-2 py-0.5 text-[9px] rounded transition-all ${
                activeView === "calc"
                  ? "bg-[#D4AF37] text-[#3A0A0E] font-bold"
                  : "text-[#D4AF37]/50"
              }`}
            >
              試算
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(true)}
          className="absolute right-0 top-0 text-[#E8DCC4]/50 hover:text-[#FDF5E6] hover:rotate-90 transition-all duration-300 w-6 h-6 flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[220px]">
        {activeView === "prices" ? (
          /* 牌價視圖 (原本的設計) */
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
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

            <div className="bg-[#5A1216]/50 p-3 rounded-lg border border-[#D4AF37]/15">
              <div className="text-[#E4E4E4] text-xs font-bold tracking-widest mb-2 border-b border-[#D4AF37]/15 pb-1">
                白金 Pt950{" "}
                <span className="text-[10px] font-normal opacity-70">
                  (每錢)
                </span>
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

            <div className="flex justify-between items-center bg-[#5A1216]/40 px-3 py-2 rounded-lg border border-[#D4AF37]/10">
              <span className="text-xs tracking-widest text-[#D1D5DB] font-bold">
                白銀{" "}
                <span className="text-[10px] font-normal opacity-70">
                  (每錢)
                </span>
              </span>
              <div className="flex gap-4 font-mono text-sm">
                <span className="text-[#FDF5E6]">
                  售 {agSell.toLocaleString()}
                </span>
                <span className="text-[#D1D5DB]/70">
                  收 {agBuy.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* 動態試算視圖 (新增) */
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-2 bg-black/20 p-1 rounded-lg">
              <button
                onClick={() => {
                  setCalcMode("recycle")
                  setInputValue("")
                }}
                className={`flex-1 py-2 text-xs rounded transition-all ${
                  calcMode === "recycle"
                    ? "bg-[#5A1216] text-[#FDF5E6] border border-[#D4AF37]/40 shadow-inner"
                    : "text-stone-500"
                }`}
              >
                舊金回收試算
              </button>
              <button
                onClick={() => {
                  setCalcMode("budget")
                  setInputValue("")
                }}
                className={`flex-1 py-2 text-xs rounded transition-all ${
                  calcMode === "budget"
                    ? "bg-[#5A1216] text-[#FDF5E6] border border-[#D4AF37]/40 shadow-inner"
                    : "text-stone-500"
                }`}
              >
                預算購金試算
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] text-[#D4AF37]/70 uppercase tracking-widest mb-1 block">
                  {calcMode === "recycle"
                    ? "輸入您的黃金重量 (單位：台錢)"
                    : "輸入您的預算金額 (TWD)"}
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    calcMode === "recycle" ? "例如: 1.25" : "例如: 50000"
                  }
                  className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-[#FDF5E6] font-mono outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>

              <div className="bg-gradient-to-b from-[#5A1216]/80 to-[#3A0A0E] border border-[#D4AF37]/30 rounded-xl p-4 text-center">
                <span className="text-[10px] text-[#E8DCC4]/50 uppercase tracking-widest block mb-1">
                  {calcMode === "recycle"
                    ? "預估回收總額 (新台幣)"
                    : "預估可購買重量 (台錢)"}
                </span>
                <div className="text-2xl font-mono font-bold text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                  {calcMode === "recycle"
                    ? `NT$ ${Number(getCalcResult()).toLocaleString()}`
                    : `${getCalcResult()} 錢`}
                </div>
                <div className="mt-2 text-[9px] text-[#E8DCC4]/40 leading-relaxed italic">
                  * 試算結果僅供參考，實際價格以門市秤重及鑑定後為準
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Button */}
      <button className="mt-1 w-full py-3 bg-[#D4AF37] hover:bg-[#B8942E] text-[#3A0A0E] font-bold text-sm tracking-[0.2em] transition-all rounded-xl shadow-[0_5px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_5px_20px_rgba(212,175,55,0.4)] active:scale-95">
        聯絡我們 / 預約鑑價
      </button>
    </div>
  )
}
