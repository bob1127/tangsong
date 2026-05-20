"use client"

import { useEffect, useState, useRef } from "react"
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  Time,
  AreaSeries,
} from "lightweight-charts"

interface HistoricalData {
  fetch_timestamp: string
  base_gold_twd_qian: number
  base_platinum_twd_qian: number
  base_silver_twd_qian: number
  base_palladium_twd_qian?: number // 🚀 名稱統一
}

type MetalTab = "gold" | "platinum" | "silver" | "pd"

export default function HistoricalTrendChart() {
  const [historyData, setHistoryData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<MetalTab>("gold")
  const [daysRange, setDaysRange] = useState<number>(7)
  const [roi, setRoi] = useState<{ diff: number; percent: number } | null>(null)

  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const priceSeriesRef = useRef<ISeriesApi<"Area"> | null>(null)

  const TIME_RANGES = [
    { label: "近 24 小時", value: 1 },
    { label: "近 7 天", value: 7 },
    { label: "近 30 天", value: 30 },
  ]

  const fetchHistory = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
      const timestamp = new Date().getTime()

      const res = await fetch(
        `${backendUrl}/store/metals?days=${daysRange}&t=${timestamp}`,
        {
          headers: {
            "x-publishable-api-key": apiKey,
            "Cache-Control": "no-store",
          },
          cache: "no-store",
        }
      )

      if (!res.ok) throw new Error("獲取歷史資料失敗")
      const json = await res.json()
      setHistoryData(Array.isArray(json.data) ? json.data : [json.data])
    } catch (error) {
      console.error(error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory(true)
  }, [daysRange])
  useEffect(() => {
    const intervalId = setInterval(() => fetchHistory(false), 900000)
    return () => clearInterval(intervalId)
  }, [daysRange])

  useEffect(() => {
    if (historyData.length === 0 || !chartContainerRef.current) return

    const priceData: { time: Time; value: number }[] = []
    const seenTimes = new Set<number>()

    const sortedData = [...historyData].sort(
      (a, b) =>
        new Date(a.fetch_timestamp).getTime() -
        new Date(b.fetch_timestamp).getTime()
    )

    sortedData.forEach((d) => {
      const unixTime = Math.floor(new Date(d.fetch_timestamp).getTime() / 1000)
      if (!seenTimes.has(unixTime)) {
        seenTimes.add(unixTime)
        let price = 0

        // 🚀 直球對決抓取資料
        if (activeTab === "gold") price = Number(d.base_gold_twd_qian)
        if (activeTab === "platinum") price = Number(d.base_platinum_twd_qian)
        if (activeTab === "silver") price = Number(d.base_silver_twd_qian)
        if (activeTab === "pd") price = Number(d.base_palladium_twd_qian) // 統一名稱

        if (price > 0 && !isNaN(price)) {
          priceData.push({ time: unixTime as Time, value: price })
        }
      }
    })

    if (priceData.length === 0) {
      priceSeriesRef.current?.setData([])
      setRoi(null)
      return
    }

    if (priceData.length >= 2) {
      const firstPrice = priceData[0].value
      const lastPrice = priceData[priceData.length - 1].value
      setRoi({
        diff: lastPrice - firstPrice,
        percent: ((lastPrice - firstPrice) / firstPrice) * 100,
      })
    } else {
      setRoi(null)
    }

    if (!chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "#A8A29E",
          attributionLogo: false,
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { color: "#F5F5F4" },
        },
        rightPriceScale: {
          borderVisible: false,
          autoScale: true,
          alignLabels: true,
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: { mode: 1 },
      })
      chartRef.current = chart

      priceSeriesRef.current = chart.addSeries(AreaSeries, {
        lineColor: "#D4AF37",
        topColor: "rgba(212, 175, 55, 0.3)",
        bottomColor: "rgba(212, 175, 55, 0.0)",
        lineWidth: 2,
        priceFormat: { type: "price", precision: 0, minMove: 1 },
      })
      window.addEventListener("resize", () =>
        chart.applyOptions({
          width: chartContainerRef.current?.clientWidth || 0,
        })
      )
    }

    priceSeriesRef.current?.setData(priceData)
    if (priceData.length > 0) chartRef.current?.timeScale().fitContent()
  }, [historyData, activeTab])

  useEffect(() => {
    return () => {
      chartRef.current?.remove()
      chartRef.current = null
    }
  }, [])

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mb-20 font-sans">
      <div className="bg-white border border-stone-200 overflow-hidden shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 border-b border-stone-100 bg-stone-50/50 gap-4">
          <div className="flex flex-wrap p-1 bg-stone-200/50 rounded-lg gap-1">
            {["gold", "platinum", "silver", "pd"].map((metal) => (
              <button
                key={metal}
                onClick={() => setActiveTab(metal as MetalTab)}
                className={`px-4 md:px-5 py-2 rounded-md text-sm font-bold transition-all ${
                  activeTab === metal
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {metal === "gold" && "黃金走勢"}
                {metal === "platinum" && "白金走勢"}
                {metal === "silver" && "白銀走勢"}
                {metal === "pd" && "鈀金走勢"}
              </button>
            ))}
          </div>
          <div className="flex space-x-2 shrink-0">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setDaysRange(range.value)}
                disabled={loading}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                  daysRange === range.value
                    ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                    : "border-stone-200 bg-white text-stone-500 hover:border-stone-300 hover:text-stone-700"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-6 relative bg-white">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {activeTab === "gold"
                  ? "黃金"
                  : activeTab === "platinum"
                  ? "白金"
                  : activeTab === "silver"
                  ? "白銀"
                  : "鈀金 (Pd)"}{" "}
                國際基準走勢
              </h3>
              <span className="text-sm font-sans text-stone-400">
                (新台幣 / 台錢)
              </span>
            </div>
            {roi && (
              <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                <span className="text-sm text-stone-500">所選期間趨勢：</span>
                <span
                  className={`font-bold ${
                    roi.diff >= 0 ? "text-[#DC2626]" : "text-[#16A34A]"
                  }`}
                >
                  {roi.diff > 0 ? "+" : ""}
                  {Math.round(roi.diff).toLocaleString()}(
                  {roi.percent > 0 ? "+" : ""}
                  {roi.percent.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-6 mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
              <span className="text-xs text-stone-600 font-semibold">
                國際基準價
              </span>
            </div>
          </div>

          <div className="h-[400px] md:h-[500px] w-full relative group">
            {loading && !chartRef.current && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-stone-200 border-t-[#D4AF37]"></div>
              </div>
            )}
            {historyData.length > 0 &&
              priceSeriesRef.current &&
              roi === null &&
              !loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <span className="text-stone-400 text-sm">
                    由於是剛加入的新追蹤項目，目前只有一筆資料，請等待排程累積後即會畫出走勢線條。
                  </span>
                </div>
              )}
            <div
              ref={chartContainerRef}
              className="w-full h-full cursor-crosshair"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
