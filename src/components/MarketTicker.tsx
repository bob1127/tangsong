"use client"

import { useEffect, useState } from "react"

interface MetalsData {
  updated_at?: string
  fetch_timestamp?: string
  exchange_rate_usd_twd: number
  // 國際現貨價 (基礎運算用)
  gold_price_qian?: number
  platinum_price_qian?: number
  silver_price_qian?: number
  base_gold_twd_qian?: number
  base_platinum_twd_qian?: number
  base_silver_twd_qian?: number

  // 後台手動設定的門市牌告價
  gold_sell?: number
  gold_buy?: number
  pt950_sell?: number
  pt950_buy?: number
  silver_buy?: number // 預留白銀後台欄位

  // K金欄位
  k18_buy?: number
  k14_buy?: number

  // 原本程式碼的舊屬性名稱 (為了相容性保留)
  store_gold_sell?: number
  store_gold_buy?: number
  store_platinum_sell?: number
  store_platinum_buy?: number
}

// 當後台沒有填寫時的備用加減碼
const DEFAULT_SPREAD = {
  gold_sell: 800,
  gold_buy: -200,
  pt_sell: 1500,
  pt_buy: -500,
}

// 試算選項定義
const METAL_OPTIONS = [
  { id: "gold", label: "黃金" },
  { id: "18k", label: "18K" },
  { id: "14k", label: "14K" },
  { id: "pt", label: "白金" },
  { id: "silver", label: "白銀" },
] as const

type CalcMetalType = (typeof METAL_OPTIONS)[number]["id"]

export default function MarketTicker() {
  const [data, setData] = useState<MetalsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [activeView, setActiveView] = useState<"prices" | "calc">("prices")

  // 試算材質選擇狀態 (支援 5 種材質)
  const [calcMetal, setCalcMetal] = useState<CalcMetalType>("gold")
  const [inputValue, setInputValue] = useState<string>("")

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setError(false)
        const backendUrl =
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

        // 防快取機制
        const targetUrl = `${backendUrl}/store/metals?nocache=${new Date().getTime()}`

        const res = await fetch(targetUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": apiKey,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          cache: "no-store",
        })

        if (!res.ok) throw new Error("API 請求失敗")

        const json = await res.json()

        if (json.success) {
          const latestData = Array.isArray(json.data) ? json.data[0] : json.data
          setData(latestData)
        } else {
          throw new Error("回傳格式不符預期")
        }
      } catch (error) {
        console.error("無法取得金價:", error)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPrice()
    const interval = setInterval(fetchPrice, 180000) // 3分鐘更新一次
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[999] w-72 p-5 bg-[#b62f26]/90 backdrop-blur-md border border-[#D4AF37]/20 rounded-xl animate-pulse">
        <div className="h-4 bg-[#D4AF37]/20 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-12 bg-[#5A1216]/50 rounded"></div>
          <div className="h-12 bg-[#5A1216]/50 rounded"></div>
        </div>
      </div>
    )
  }

  // 1. 取得基礎現貨價
  const rawGold = data?.base_gold_twd_qian ?? data?.gold_price_qian ?? 0
  const rawPt = data?.base_platinum_twd_qian ?? data?.platinum_price_qian ?? 0
  const rawAg = data?.base_silver_twd_qian ?? data?.silver_price_qian ?? 0
  const rate = data?.exchange_rate_usd_twd ?? 32.0

  // 2. 取得各金屬牌價
  const goldSell =
    data?.gold_sell ??
    data?.store_gold_sell ??
    (rawGold > 0 ? rawGold + DEFAULT_SPREAD.gold_sell : 0)
  const goldBuy =
    data?.gold_buy ??
    data?.store_gold_buy ??
    (rawGold > 0 ? rawGold + DEFAULT_SPREAD.gold_buy : 0)

  const ptBuy =
    data?.pt950_buy ??
    data?.store_platinum_buy ??
    (rawPt > 0 ? rawPt + DEFAULT_SPREAD.pt_buy : 0)

  // 白銀回收價 (若無後台設定，則扣除 5 元)
  const silverBuy = data?.silver_buy ?? (rawAg > 0 ? rawAg - 5 : 0)

  // 3. 取得 18K 與 14K 回收價
  const store18kBuy =
    data?.k18_buy ?? (goldBuy > 0 ? Math.round(goldBuy * 0.6) : 0)
  const store14kBuy =
    data?.k14_buy ?? (goldBuy > 0 ? Math.round(goldBuy * 0.45) : 0)

  // 格式化價格：0 顯示為 "---"
  const formatPrice = (price: number) =>
    price > 0 ? price.toLocaleString() : "---"

  // 舊金回收試算功能
  const getCalcResult = () => {
    const val = parseFloat(inputValue)
    if (isNaN(val) || val <= 0) return 0

    if (calcMetal === "gold") return Math.round(val * goldBuy)
    if (calcMetal === "18k") return Math.round(val * store18kBuy)
    if (calcMetal === "14k") return Math.round(val * store14kBuy)
    if (calcMetal === "pt") return Math.round(val * ptBuy)
    if (calcMetal === "silver") return Math.round(val * silverBuy)

    return 0
  }

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[999] flex flex-col items-center justify-center gap-1 bg-[#b62f26]/95 backdrop-blur-md border border-r-0 border-[#D4AF37]/50 p-2 py-4 rounded-l-xl transition-all duration-300 hover:bg-[#5A1216] group shadow-2xl"
      >
        <span
          className={`w-2 h-2 rounded-full animate-pulse mb-1 ${
            error ? "bg-red-500" : "bg-green-500"
          }`}
        ></span>
        <span className="text-[#D4AF37] font-bold text-sm">牌</span>
        <span className="text-[#D4AF37] font-bold text-sm">告</span>
        <span className="text-[#D4AF37] font-bold text-sm">價</span>
        <span className="text-[#E8DCC4]/50 text-xs mt-1">◀</span>
      </button>
    )
  }

  return (
    <div className="fixed right-2 md:right-6 top-1/2 -translate-y-1/2 z-[999] flex flex-col gap-4 w-[310px] md:w-[330px] p-5 bg-[#3A0A0E] backdrop-blur-md border border-[#D4AF37]/40 transition-all duration-500 hover:border-[#D4AF37]/70 transform origin-right scale-90 md:scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]  ">
      {/* Header */}
      <div className="border-b border-[#D4AF37]/30 pb-2 relative">
        <div className="flex items-center justify-between pr-6">
          <h3 className="text-sm font-bold tracking-widest text-[#D4AF37] flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  error ? "bg-red-400" : "bg-green-400"
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  error ? "bg-red-500" : "bg-green-500"
                }`}
              ></span>
            </span>
            唐宋珠寶即時行情
          </h3>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-[10px] text-[#E8DCC4]/60">
            {error ? "連線異常，請稍後再試" : `1 USD = ${rate.toFixed(2)} TWD`}
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
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
            {/* 黃金 */}
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
                    {formatPrice(goldSell)}
                  </span>
                </div>
                <div className="w-[1px] h-8 bg-[#D4AF37]/20"></div>
                <div className="flex flex-col text-right">
                  <span className="text-[#E8DCC4]/60 text-[10px] mb-0.5">
                    回收價
                  </span>
                  <span className="font-mono text-lg font-bold text-[#D4AF37]/80">
                    {formatPrice(goldBuy)}
                  </span>
                </div>
              </div>
            </div>

            {/* 白金 (只有回收價) */}
            <div className="bg-[#5A1216]/50 px-3 py-2.5 rounded-lg border border-[#D4AF37]/15 flex justify-between items-center">
              <div className="text-[#E4E4E4] text-xs font-bold tracking-widest">
                白金 Pt950{" "}
                <span className="text-[10px] font-normal opacity-70">
                  (每錢)
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[#E8DCC4]/50 text-[9px] mb-0.5">
                  回收價
                </span>
                <span className="font-mono text-base font-semibold text-[#E4E4E4]/90">
                  {formatPrice(ptBuy)}
                </span>
              </div>
            </div>

            {/* 白銀 (只有回收價) */}
            <div className="bg-[#5A1216]/40 px-3 py-2.5 rounded-lg border border-[#D4AF37]/10 flex justify-between items-center">
              <div className="text-[#D1D5DB] text-xs font-bold tracking-widest">
                白銀 Ag{" "}
                <span className="text-[10px] font-normal opacity-70">
                  (每錢)
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[#E8DCC4]/50 text-[9px] mb-0.5">
                  回收價
                </span>
                <span className="font-mono text-base font-semibold text-[#D1D5DB]/90">
                  {formatPrice(silverBuy)}
                </span>
              </div>
            </div>

            {/* K金回收 */}
            <div className="flex justify-between items-center bg-[#5A1216]/40 px-3 py-2.5 rounded-lg border border-[#D4AF37]/10">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#D4AF37]/60 mb-0.5 tracking-wider font-bold">
                  K金回收 (每錢)
                </span>
              </div>
              <div className="flex gap-4 font-mono text-sm">
                <span className="text-[#E8DCC4] flex flex-col text-right leading-tight">
                  <span className="text-[9px] text-[#D4AF37]/70">18K</span>
                  <span className="font-bold text-[#FDF5E6]">
                    {formatPrice(store18kBuy)}
                  </span>
                </span>
                <div className="w-[1px] h-6 bg-[#D4AF37]/20 self-center"></div>
                <span className="text-[#E8DCC4]/80 flex flex-col text-right leading-tight">
                  <span className="text-[9px] text-[#D4AF37]/70">14K</span>
                  <span className="font-bold text-[#FDF5E6]">
                    {formatPrice(store14kBuy)}
                  </span>
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2">
            {/* 🚀 材質選擇 Tab (加入 Flex-wrap 自動折行適應) */}
            <div className="flex flex-wrap gap-1 bg-black/20 p-1.5 rounded-lg">
              {METAL_OPTIONS.map((metal) => (
                <button
                  key={metal.id}
                  onClick={() => {
                    setCalcMetal(metal.id)
                    setInputValue("") // 切換材質時清空輸入框
                  }}
                  className={`flex-1 basis-[30%] min-w-[50px] py-2 text-[11px] font-bold rounded transition-all tracking-wider ${
                    calcMetal === metal.id
                      ? "bg-[#5A1216] text-[#FDF5E6] border border-[#D4AF37]/40 shadow-inner"
                      : "text-stone-400 hover:text-stone-300"
                  }`}
                >
                  {metal.label}
                </button>
              ))}
            </div>

            <div className="space-y-4 mt-2">
              <div className="relative">
                <label className="text-[10px] text-[#D4AF37]/70 uppercase tracking-widest mb-1.5 block flex justify-between">
                  <span>輸入您的飾品重量</span>
                  <span>(單位：台錢)</span>
                </label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="例如: 1.25"
                  className="w-full bg-black/40 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-[#FDF5E6] font-mono outline-none focus:border-[#D4AF37] transition-all"
                  disabled={error}
                />
              </div>

              <div className="bg-gradient-to-b from-[#5A1216]/80 to-[#3A0A0E] border border-[#D4AF37]/30 rounded-xl p-4 text-center mt-4">
                <span className="text-[10px] text-[#E8DCC4]/50 uppercase tracking-widest block mb-1">
                  預估回收總額 (新台幣)
                </span>
                <div className="text-2xl font-mono font-bold text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                  NT$ {Number(getCalcResult()).toLocaleString()}
                </div>
                <div className="mt-2 text-[9px] text-[#E8DCC4]/40 leading-relaxed italic">
                  * 試算結果僅供參考，實際價格以門市秤重及鑑定後為準
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Contact */}
      <span className="text-[10px] font-normal text-[#E8DCC4]/50 text-center tracking-wider mt-2">
        不強迫交易 ‧ 儀器精準檢測 ｜ 實際價格以門市為準
      </span>
      <a href="https://lin.ee/p4ywHz1" target="_blank" rel="noreferrer">
        <button className="mt-1 w-full py-3 bg-[#D4AF37] hover:bg-[#B8942E] text-[#3A0A0E] font-bold text-sm tracking-[0.2em] transition-all rounded-xl shadow-[0_5px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_5px_20px_rgba(212,175,55,0.4)] active:scale-95">
          聯絡我們 / 預約鑑價
        </button>
      </a>
    </div>
  )
}
