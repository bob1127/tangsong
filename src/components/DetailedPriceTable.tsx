"use client"

import React, { useEffect, useState } from "react"
import { deriveMetalDisplayPrices } from "@lib/metals/derive-prices"
import type { MetalsData } from "@lib/metals/types"
import TradingViewChart from "./TradingViewChart"

type DetailedPriceTableProps = {
  initialData?: MetalsData | null
}

async function fetchLatestMetals(): Promise<MetalsData | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  const res = await fetch(
    `${backendUrl}/store/metals?nocache=${Date.now()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": apiKey,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      cache: "no-store",
    }
  )

  if (!res.ok) throw new Error("API 請求失敗")

  const contentType = res.headers.get("content-type")
  if (!contentType?.includes("application/json")) {
    throw new TypeError("回傳的格式不是 JSON，請確認 API 路徑是否正確")
  }

  const json = await res.json()
  if (!json.success) throw new Error("回傳格式不符預期")

  return Array.isArray(json.data) ? json.data[0] : json.data
}

export default function DetailedPriceTable({
  initialData = null,
}: DetailedPriceTableProps) {
  const [data, setData] = useState<MetalsData | null>(initialData)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState(false)
  const [isChartOpen, setIsChartOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    const refreshPrice = async () => {
      try {
        setError(false)
        const latest = await fetchLatestMetals()
        if (!cancelled && latest) {
          setData(latest)
        }
      } catch (fetchError) {
        console.error("無法取得金價:", fetchError)
        if (!cancelled && !initialData) {
          setError(true)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    refreshPrice()
    return () => {
      cancelled = true
    }
  }, [initialData])

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
        <div className="w-full h-64 bg-[#3A0A0E]/40 animate-pulse rounded-xl mt-8 border border-[#D4AF37]/20"></div>
      </div>
    )
  }

  const prices = deriveMetalDisplayPrices(data)
  if (!prices) {
    return (
      <div className="w-full max-w-[1400px] mx-auto mt-12 px-4 lg:px-8 mb-20">
        <div className="w-full h-64 bg-[#3A0A0E]/40 rounded-xl mt-8 border border-[#D4AF37]/20 flex items-center justify-center text-[#FDF5E6]/70">
          暫無法載入金價資料
        </div>
      </div>
    )
  }

  const {
    updateTime,
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
    intlGoldBuy,
    intlGoldSell,
    intlPtBuy,
    intlPtSell,
    intlAgBuy,
    intlAgSell,
    intlPdBuy,
    intlPdSell,
  } = prices

  const formatPrice = (price: number) => {
    if (price <= 0) return "—"
    return price.toLocaleString()
  }

  const formatFinancial = (price: number) =>
    price > 0 || price === 0
      ? price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "—"

  return (
    <>
      {isChartOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-in fade-in duration-200 p-2 md:p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full md:w-[90vw] max-w-[1600px] h-[90vh] bg-white border border-[#D4AF37]/50 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl rounded-sm">
            <div className="flex justify-between items-center px-6 pt-4 shrink-0 bg-[#f8f8f8] border-b border-gray-200 pb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-gray-800">
                  國際貴金屬走勢圖
                </h3>
              </div>
              <button
                onClick={() => setIsChartOpen(false)}
                className="text-stone-500 hover:text-black p-2 transition-all duration-200 flex items-center justify-center group bg-white rounded-full border border-gray-300 shadow-sm"
              >
                <svg
                  className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
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

      <div
        id="metal-prices"
        className="w-full max-w-[1400px] mx-auto mt-12 px-4 lg:px-8 mb-20 font-mono"
      >
        {/* 頭部資訊區 */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-4 border-b border-[#D4AF37]/40 pb-3 gap-4 md:gap-0">
          <div>
            <h2 className="text-2xl md:text-4xl font-serif text-[#3A0A0E] font-bold tracking-widest flex items-center gap-3">
              {error && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
              國際貴金屬與門市即時行情
            </h2>
            <p className="text-[#3A0A0E]/70 font-bold text-sm tracking-wider mt-2">
              {error
                ? "連線異常，顯示備用資料"
                : `資料更新時間：${new Date(updateTime).toLocaleString(
                    "zh-TW"
                  )}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-end">
            <span className="text-xs text-[#FDF5E6]/90 bg-[#3A0A0E] border border-[#D4AF37]/30 px-3 py-2 rounded-sm flex items-center shadow-sm">
              美元匯率基準:{" "}
              <span className="text-[#F3E5AB] font-bold ml-1">
                {rate.toFixed(2)}
              </span>
            </span>
            <button
              onClick={() => setIsChartOpen(true)}
              className="group flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8942E] hover:from-[#FDF5E6] hover:to-[#D4AF37] text-[#3A0A0E] text-xs font-bold px-4 py-2 rounded-sm border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.2)] hover:shadow-[0_0_15px_rgba(212,175,55,0.5)] transition-all duration-300"
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
          {/* ================= 左側資訊欄 ================= */}
          <div className="col-span-1 space-y-6">
            {/* 匯率表 */}
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

            {/* 指數表 */}
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

          {/* ================= 右側主表格欄 ================= */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            {/* 實體門市牌告價 */}
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
                      <th className="py-3 px-4 font-bold w-1/4">
                        賣出價 (NT$)
                      </th>
                      <th className="py-3 px-4 font-bold w-1/4">
                        回收價 (NT$)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors">
                      <td className="py-4 px-4 text-[#FDF5E6] font-bold text-base tracking-widest">
                        黃金賣出牌價
                      </td>
                      <td className="py-4 px-4 text-[#FDF5E6]/80">台錢</td>
                      <td className="py-4 px-4 text-xl font-bold text-[#FDF5E6] drop-shadow-md">
                        {formatPrice(storeGoldSell)}
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
                        {formatPrice(storeGoldBullionBuy)}
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
                        {formatPrice(storeGoldBuy)}
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
                        {formatPrice(store18kBuy)}
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
                        {formatPrice(store14kBuy)}
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
                        {formatPrice(storeSilverBuy)}
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
                        {formatPrice(storePtBuy)}
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
                        {formatPrice(storePdBuy)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 國際現貨行情表 */}
            <div className="bg-[#3A0A0E] border border-[#D4AF37]/30 overflow-hidden shadow-xl rounded-sm">
              <div className="bg-[#3A0A0E]/10 px-4 py-3.5 text-sm font-bold text-[#F3E5AB] border-b border-[#D4AF37]/20 tracking-wider">
                國際現貨金價及貴金屬即時行情 (新台幣 / 台錢)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center">
                  <thead className="bg-black/15 text-[#F3E5AB] text-xs">
                    <tr>
                      <th className="py-3 px-4 font-bold tracking-wider">
                        商品名稱
                      </th>
                      <th className="py-3 px-4 font-bold text-[#A3E635]">
                        買入 (Bid)
                      </th>
                      <th className="py-3 px-4 font-bold text-[#FF9B9B]">
                        賣出 (Ask)
                      </th>
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
                        {formatFinancial(intlGoldBuy)}
                      </td>
                      <td className="py-3 px-4 text-[#FF9B9B] font-bold font-mono text-base">
                        {formatFinancial(intlGoldSell)}
                      </td>
                      <td className="py-3 px-4 text-[#FF9B9B] font-medium">
                        -40.03 ▼
                      </td>
                      <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                        {formatFinancial(rawGold + 160)}
                      </td>
                      <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                        {formatFinancial(rawGold - 150)}
                      </td>
                    </tr>
                    <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors bg-black/10">
                      <td className="py-3 px-4 text-[#E4E4E4] font-bold tracking-widest">
                        白金 Pt
                      </td>
                      <td className="py-3 px-4 text-[#A3E635] font-bold font-mono text-base">
                        {formatFinancial(intlPtBuy)}
                      </td>
                      <td className="py-3 px-4 text-[#FF9B9B] font-bold font-mono text-base">
                        {formatFinancial(intlPtSell)}
                      </td>
                      <td className="py-3 px-4 text-[#A3E635] font-medium">
                        -236.01 ▼
                      </td>
                      <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                        {formatFinancial(rawPt + 240)}
                      </td>
                      <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                        {formatFinancial(rawPt - 20)}
                      </td>
                    </tr>
                    <tr className="border-b border-[#D4AF37]/10 hover:bg-black/20 transition-colors">
                      <td className="py-3 px-4 text-[#D1D5DB] font-bold tracking-widest">
                        白銀 Ag
                      </td>
                      <td className="py-3 px-4 text-[#A3E635] font-bold font-mono text-base">
                        {formatFinancial(intlAgBuy)}
                      </td>
                      <td className="py-3 px-4 text-[#FF9B9B] font-bold font-mono text-base">
                        {formatFinancial(intlAgSell)}
                      </td>
                      <td className="py-3 px-4 text-[#A3E635] font-medium">
                        -8.06 ▼
                      </td>
                      <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                        {formatFinancial(rawAg + 10)}
                      </td>
                      <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                        {formatFinancial(rawAg - 6)}
                      </td>
                    </tr>
                    <tr className="hover:bg-black/20 transition-colors bg-black/10">
                      <td className="py-3 px-4 text-[#C1B6A4] font-bold tracking-widest">
                        鈀金 Pd
                      </td>
                      <td className="py-3 px-4 text-[#A3E635] font-bold font-mono text-base">
                        {formatFinancial(intlPdBuy)}
                      </td>
                      <td className="py-3 px-4 text-[#FF9B9B] font-bold font-mono text-base">
                        {formatFinancial(intlPdSell)}
                      </td>
                      <td className="py-3 px-4 text-[#FF9B9B] font-medium">
                        -15.20 ▼
                      </td>
                      <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
                        {formatFinancial(rawPd + 80)}
                      </td>
                      <td className="py-3 px-4 text-[#FDF5E6]/70 font-mono">
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
