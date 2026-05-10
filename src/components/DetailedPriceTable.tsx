"use client"

import { useEffect, useState } from "react"
import TradingViewChart from "./TradingViewChart"

interface MetalsData {
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
  k18_buy?: number
  k14_buy?: number
  pt950_sell?: number
  pt950_buy?: number
  pd_sell?: number
  pd_buy?: number
}

export default function DetailedPriceTable() {
  const [data, setData] = useState<MetalsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isChartOpen, setIsChartOpen] = useState(false)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setError(false)
        const backendUrl =
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

        // 🚀 核彈級防快取網址
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

        if (!res.ok) {
          throw new Error("API 請求失敗")
        }

        const contentType = res.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("回傳的格式不是 JSON，請確認 API 路徑是否正確")
        }

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
  }, [])

  useEffect(() => {
    if (isChartOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isChartOpen])

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto mt-12 px-4 lg:px-8 mb-20">
        <div className="w-full h-64 bg-[#5A1216]/50 animate-pulse rounded-xl mt-8 border border-[#D4AF37]/20"></div>
      </div>
    )
  }

  const rawGold = data?.base_gold_twd_qian ?? data?.gold_price_qian ?? 0
  const rawPt = data?.base_platinum_twd_qian ?? data?.platinum_price_qian ?? 0
  const rawAg = data?.base_silver_twd_qian ?? data?.silver_price_qian ?? 0
  const rawPd = data?.base_palladium_twd_qian ?? data?.palladium_price_qian ?? 0

  const rate = data?.exchange_rate_usd_twd ?? 32.0
  const updateTime =
    data?.fetch_timestamp ?? data?.updated_at ?? new Date().toISOString()

  // 門市牌告價
  const storeGoldSell = data?.gold_sell ?? (rawGold > 0 ? rawGold + 800 : 0)
  const storeGoldBuy = data?.gold_buy ?? (rawGold > 0 ? rawGold - 200 : 0)
  const store18kBuy =
    data?.k18_buy ?? (storeGoldBuy > 0 ? Math.round(storeGoldBuy * 0.6) : 0)
  const store14kBuy =
    data?.k14_buy ?? (storeGoldBuy > 0 ? Math.round(storeGoldBuy * 0.45) : 0)
  const storePtSell = data?.pt950_sell ?? (rawPt > 0 ? rawPt + 1500 : 0)
  const storePtBuy = data?.pt950_buy ?? (rawPt > 0 ? rawPt - 500 : 0)
  const storePdSell = data?.pd_sell ?? (rawPd > 0 ? rawPd + 1500 : 0)
  const storePdBuy = data?.pd_buy ?? (rawPd > 0 ? rawPd - 500 : 0)

  // 國際現貨價
  const intlGoldBuy = rawGold > 0 ? rawGold - 30 : 0
  const intlGoldSell = rawGold > 0 ? rawGold + 30 : 0
  const intlPtBuy = rawPt > 0 ? rawPt - 50 : 0
  const intlPtSell = rawPt > 0 ? rawPt + 50 : 0
  const intlAgBuy = rawAg > 0 ? rawAg - 0.5 : 0
  const intlAgSell = rawAg > 0 ? rawAg + 0.5 : 0
  const intlPdBuy = rawPd > 0 ? rawPd - 50 : 0
  const intlPdSell = rawPd > 0 ? rawPd + 50 : 0

  // 🚀 核心修正：將 0 替換為溫馨提示文字，並縮小字體防止表格跑版
  const formatPrice = (price: number) => {
    if (price === 0) {
      return (
        <span className="text-xs md:text-sm font-normal text-[#E8DCC4]/60 tracking-normal whitespace-nowrap">
          尚待公佈，有疑問請聯繫我們
        </span>
      )
    }
    return price > 0 ? price.toLocaleString() : "---"
  }

  const formatFinancial = (price: number) =>
    price > 0 || price === 0
      ? price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "---"

  return (
    <>
      {isChartOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-200 p-2 md:p-4">
          <div className="relative w-full md:w-[90vw] max-w-[1600px] h-[90vh] bg-white border border-[#D4AF37]/50 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 pt-4 shrink-0">
              <div className="flex items-center gap-3"></div>
              <button
                onClick={() => setIsChartOpen(false)}
                className="text-stone-800 hover:text-black p-2 transition-all duration-200 flex items-center justify-center group"
              >
                <svg
                  className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="flex-1 w-full relative overflow-y-auto bg-stone-50">
              <TradingViewChart />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1400px] mx-auto mt-12 px-4 lg:px-8 mb-20 font-mono">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-4 border-b border-[#D4AF37]/40 pb-3 gap-4 md:gap-0">
          <div>
            <h2 className="text-2xl md:text-4xl font-serif text-[#5A1216] tracking-widest flex items-center gap-3">
              {error && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
              國際貴金屬與門市即時行情
            </h2>
            <p className="text-[#5A1216]/50 font-bold text-sm tracking-wider mt-2">
              {error
                ? "連線異常，顯示備用資料"
                : `資料更新時間：${new Date(updateTime).toLocaleString(
                    "zh-TW"
                  )}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-end">
            <span className="text-xs text-[#E8DCC4]/70 bg-[#5A1216]/50 border border-[#D4AF37]/20 px-3 py-2 rounded flex items-center">
              美元匯率基準:{" "}
              <span className="text-[#FDF5E6] ml-1">{rate.toFixed(2)}</span>
            </span>
            <button
              onClick={() => setIsChartOpen(true)}
              className="group flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8942E] hover:from-[#FDF5E6] hover:to-[#D4AF37] text-[#3A0A0E] text-xs font-bold px-4 py-2 rounded border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-300"
            >
              <svg
                className="w-4 h-4 text-[#3A0A0E]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                ></path>
              </svg>
              國際即時走勢
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="col-span-1 space-y-6">
            <div className="bg-[#5A1216] border border-[#D4AF37]/30 overflow-hidden">
              <div className="bg-[#3A0A0E] px-4 py-2 text-sm font-bold text-[#D4AF37] border-b border-[#D4AF37]/20">
                新台幣匯率表
              </div>
              <table className="w-full text-sm text-left">
                <tbody>
                  <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                    <td className="py-2 px-4 text-[#E8DCC4]">美元 USD</td>
                    <td className="py-2 px-4 text-right text-[#FF6B6B] font-medium">
                      {rate.toFixed(3)}
                    </td>
                  </tr>
                  <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                    <td className="py-2 px-4 text-[#E8DCC4]">人民幣 CNY</td>
                    <td className="py-2 px-4 text-right text-[#FF6B6B] font-medium">
                      4.425
                    </td>
                  </tr>
                  <tr className="hover:bg-[#D4AF37]/10 transition-colors">
                    <td className="py-2 px-4 text-[#E8DCC4]">歐元 EUR</td>
                    <td className="py-2 px-4 text-right text-[#4ADE80] font-medium">
                      34.612
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#5A1216] border border-[#D4AF37]/30 overflow-hidden">
              <div className="bg-[#3A0A0E] px-4 py-2 text-sm font-bold text-[#D4AF37] border-b border-[#D4AF37]/20">
                國際金融指數
              </div>
              <table className="w-full text-sm text-left">
                <tbody>
                  <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                    <td className="py-2 px-4 text-[#E8DCC4]">台灣加權</td>
                    <td className="py-2 px-4 text-right text-[#FF6B6B] font-medium">
                      20,352.14
                    </td>
                  </tr>
                  <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                    <td className="py-2 px-4 text-[#E8DCC4]">美元指數</td>
                    <td className="py-2 px-4 text-right text-[#4ADE80] font-medium">
                      104.25
                    </td>
                  </tr>
                  <tr className="hover:bg-[#D4AF37]/10 transition-colors">
                    <td className="py-2 px-4 text-[#E8DCC4]">紐約原油</td>
                    <td className="py-2 px-4 text-right text-[#FF6B6B] font-medium">
                      85.43
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-3 space-y-6">
            <div className="bg-gradient-to-br from-[#73171C] to-[#4A0E12] border border-[#D4AF37]/50 overflow-hidden shadow-2xl">
              <div className="bg-[#D4AF37]/10 px-4 py-3 text-sm font-bold text-[#D4AF37] border-b border-[#D4AF37]/30 flex justify-between items-center">
                <span>唐宋珠寶 實體門市牌告價 (新台幣 / 台錢)</span>
                <span className="text-xs font-normal text-[#E8DCC4]/60">
                  不強迫交易 ‧ 儀器精準檢測
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center">
                  <thead className="bg-[#3A0A0E] text-[#D4AF37]/70 text-xs">
                    <tr>
                      <th className="py-3 px-4 font-normal w-1/4">商品項目</th>
                      <th className="py-3 px-4 font-normal w-1/4">單位</th>
                      <th className="py-3 px-4 font-normal w-1/4">
                        賣出價 (NT$)
                      </th>
                      <th className="py-3 px-4 font-normal w-1/4">
                        回收價 (NT$)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                      <td className="py-4 px-4 text-[#D4AF37] font-bold text-base tracking-widest">
                        黃金飾金
                      </td>
                      <td className="py-4 px-4 text-[#E8DCC4]/70">台錢</td>
                      <td className="py-4 px-4 text-xl font-bold text-[#FDF5E6]">
                        {formatPrice(storeGoldSell)}
                      </td>
                      <td className="py-4 px-4 text-xl font-bold text-[#E8DCC4]/90">
                        {formatPrice(storeGoldBuy)}
                      </td>
                    </tr>
                    <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors bg-[#000000]/10">
                      <td className="py-3 px-4 text-[#D4AF37]/80 font-bold text-base tracking-widest">
                        18K 金
                      </td>
                      <td className="py-3 px-4 text-[#E8DCC4]/70">台錢</td>
                      <td className="py-3 px-4 text-base font-medium text-[#E8DCC4]/40">
                        -
                      </td>
                      <td className="py-3 px-4 text-lg font-bold text-[#E8DCC4]/90">
                        {formatPrice(store18kBuy)}
                      </td>
                    </tr>
                    <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors bg-[#000000]/10">
                      <td className="py-3 px-4 text-[#D4AF37]/80 font-bold text-base tracking-widest">
                        14K 金
                      </td>
                      <td className="py-3 px-4 text-[#E8DCC4]/70">台錢</td>
                      <td className="py-3 px-4 text-base font-medium text-[#E8DCC4]/40">
                        -
                      </td>
                      <td className="py-3 px-4 text-lg font-bold text-[#E8DCC4]/90">
                        {formatPrice(store14kBuy)}
                      </td>
                    </tr>
                    <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                      <td className="py-4 px-4 text-[#E4E4E4] font-bold text-base tracking-widest">
                        白金 Pt950
                      </td>
                      <td className="py-4 px-4 text-[#E8DCC4]/70">台錢</td>
                      <td className="py-4 px-4 text-xl font-bold text-[#FDF5E6]">
                        {formatPrice(storePtSell)}
                      </td>
                      <td className="py-4 px-4 text-xl font-bold text-[#E8DCC4]/90">
                        {formatPrice(storePtBuy)}
                      </td>
                    </tr>
                    <tr className="hover:bg-[#D4AF37]/10 transition-colors">
                      <td className="py-4 px-4 text-[#A89F91] font-bold text-base tracking-widest">
                        鈀金 Pd
                      </td>
                      <td className="py-4 px-4 text-[#E8DCC4]/70">台錢</td>
                      <td className="py-4 px-4 text-xl font-bold text-[#FDF5E6]">
                        {formatPrice(storePdSell)}
                      </td>
                      <td className="py-4 px-4 text-xl font-bold text-[#E8DCC4]/90">
                        {formatPrice(storePdBuy)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-[#5A1216] border border-[#D4AF37]/30 overflow-hidden">
              <div className="bg-[#3A0A0E] px-4 py-2 text-sm font-bold text-[#D4AF37] border-b border-[#D4AF37]/20">
                國際現貨金價及貴金屬即時行情 (新台幣 / 台錢)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center">
                  <thead className="bg-[#3A0A0E] text-[#D4AF37]/70 text-xs">
                    <tr>
                      <th className="py-3 px-4 font-normal">商品名稱</th>
                      <th className="py-3 px-4 font-normal text-[#4ADE80]">
                        買入 (Bid)
                      </th>
                      <th className="py-3 px-4 font-normal text-[#FF6B6B]">
                        賣出 (Ask)
                      </th>
                      <th className="py-3 px-4 font-normal">漲跌 (+/-)</th>
                      <th className="py-3 px-4 font-normal">本日最高 (估位)</th>
                      <th className="py-3 px-4 font-normal">本日最低 (估位)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                      <td className="py-3 px-4 text-[#D4AF37] font-medium tracking-wider">
                        黃金 Au
                      </td>
                      <td className="py-3 px-4 text-[#4ADE80] font-bold font-mono">
                        {formatFinancial(intlGoldBuy)}
                      </td>
                      <td className="py-3 px-4 text-[#FF6B6B] font-bold font-mono">
                        {formatFinancial(intlGoldSell)}
                      </td>
                      <td className="py-3 px-4 text-[#FF6B6B] font-medium">
                        -40.03 ▼
                      </td>
                      <td className="py-3 px-4 text-[#E8DCC4]/60 font-mono">
                        {formatFinancial(rawGold + 160)}
                      </td>
                      <td className="py-3 px-4 text-[#E8DCC4]/60 font-mono">
                        {formatFinancial(rawGold - 150)}
                      </td>
                    </tr>
                    <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                      <td className="py-3 px-4 text-[#E4E4E4] font-medium tracking-wider">
                        白金 Pt
                      </td>
                      <td className="py-3 px-4 text-[#4ADE80] font-bold font-mono">
                        {formatFinancial(intlPtBuy)}
                      </td>
                      <td className="py-3 px-4 text-[#FF6B6B] font-bold font-mono">
                        {formatFinancial(intlPtSell)}
                      </td>
                      <td className="py-3 px-4 text-[#4ADE80] font-medium">
                        -236.01 ▼
                      </td>
                      <td className="py-3 px-4 text-[#E8DCC4]/60 font-mono">
                        {formatFinancial(rawPt + 240)}
                      </td>
                      <td className="py-3 px-4 text-[#E8DCC4]/60 font-mono">
                        {formatFinancial(rawPt - 20)}
                      </td>
                    </tr>
                    <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                      <td className="py-3 px-4 text-[#D1D5DB] font-medium tracking-wider">
                        白銀 Ag
                      </td>
                      <td className="py-3 px-4 text-[#4ADE80] font-bold font-mono">
                        {formatFinancial(intlAgBuy)}
                      </td>
                      <td className="py-3 px-4 text-[#FF6B6B] font-bold font-mono">
                        {formatFinancial(intlAgSell)}
                      </td>
                      <td className="py-3 px-4 text-[#4ADE80] font-medium">
                        -8.06 ▼
                      </td>
                      <td className="py-3 px-4 text-[#E8DCC4]/60 font-mono">
                        {formatFinancial(rawAg + 10)}
                      </td>
                      <td className="py-3 px-4 text-[#E8DCC4]/60 font-mono">
                        {formatFinancial(rawAg - 6)}
                      </td>
                    </tr>
                    <tr className="hover:bg-[#D4AF37]/10 transition-colors">
                      <td className="py-3 px-4 text-[#A89F91] font-medium tracking-wider">
                        鈀金 Pd
                      </td>
                      <td className="py-3 px-4 text-[#4ADE80] font-bold font-mono">
                        {formatFinancial(intlPdBuy)}
                      </td>
                      <td className="py-3 px-4 text-[#FF6B6B] font-bold font-mono">
                        {formatFinancial(intlPdSell)}
                      </td>
                      <td className="py-3 px-4 text-[#FF6B6B] font-medium">
                        -15.20 ▼
                      </td>
                      <td className="py-3 px-4 text-[#E8DCC4]/60 font-mono">
                        {formatFinancial(rawPd + 80)}
                      </td>
                      <td className="py-3 px-4 text-[#E8DCC4]/60 font-mono">
                        {formatFinancial(rawPd - 60)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
