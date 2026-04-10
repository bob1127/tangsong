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
}

type MetalTab = "gold" | "platinum" | "silver"

export default function HistoricalTrendChart() {
  const [historyData, setHistoryData] = useState<HistoricalData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<MetalTab>("gold")
  const [daysRange, setDaysRange] = useState<number>(7)
  const [roi, setRoi] = useState<{ diff: number; percent: number } | null>(null)

  const chartContainerRef = useRef<HTMLDivElement>(null)
  // 保存 chart 實例以便更新資料
  const chartRef = useRef<IChartApi | null>(null)
  // 保存 series 實例以便更新資料
  const sellSeriesRef = useRef<ISeriesApi<"Area"> | null>(null)
  const buySeriesRef = useRef<ISeriesApi<"Area"> | null>(null)

  const TIME_RANGES = [
    { label: "近 24 小時", value: 1 },
    { label: "近 7 天", value: 7 },
    { label: "近 30 天", value: 30 },
  ]

  // 定義門市的買賣價差參數 (可以隨時調整)
  const SPREADS = {
    gold: { sell: 800, buy: -200 },
    platinum: { sell: 1500, buy: -500 },
    silver: { sell: 40, buy: -20 }, // 假設白銀的價差
  }

  // 1. 抓取資料函數 (獨立出來，方便重複呼叫)
  const fetchHistory = async (showLoading = true) => {
    if (showLoading) setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
      if (!backendUrl) return

      // 加上時間戳防止快取
      const timestamp = new Date().getTime()
      const res = await fetch(
        `${backendUrl}/store/metals?days=${daysRange}&t=${timestamp}`,
        {
          headers: {
            "x-publishable-api-key": process.env
              .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
          },
        }
      )

      if (!res.ok) throw new Error("獲取歷史資料失敗")

      const json = await res.json()
      const dataArray = Array.isArray(json.data) ? json.data : [json.data]

      setHistoryData(dataArray)
    } catch (error) {
      console.error("無法取得歷史資料:", error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  // 初次載入與天數切換時抓取資料
  useEffect(() => {
    fetchHistory(true)
  }, [daysRange])

  // 🌟 自動即時更新：每 15 分鐘 (900000 毫秒) 背景偷偷抓新資料
  useEffect(() => {
    const intervalId = setInterval(() => {
      // 傳入 false 代表不要顯示轉圈圈，讓圖表無縫更新
      fetchHistory(false)
    }, 900000)

    return () => clearInterval(intervalId)
  }, [daysRange]) // 天數切換時重新計時

  // 2. 渲染 TradingView 圖表
  useEffect(() => {
    if (historyData.length === 0 || !chartContainerRef.current) return

    // 準備兩組資料：賣出價與回收價
    const sellData: { time: Time; value: number }[] = []
    const buyData: { time: Time; value: number }[] = []
    const seenTimes = new Set<number>()

    const sortedData = [...historyData].sort(
      (a, b) =>
        new Date(a.fetch_timestamp).getTime() -
        new Date(b.fetch_timestamp).getTime()
    )

    // 取得當前金屬的價差設定
    const currentSpread = SPREADS[activeTab]

    sortedData.forEach((d) => {
      const unixTime = Math.floor(new Date(d.fetch_timestamp).getTime() / 1000)

      let basePrice = 0
      if (activeTab === "gold") basePrice = Number(d.base_gold_twd_qian) || 0
      if (activeTab === "platinum")
        basePrice = Number(d.base_platinum_twd_qian) || 0
      if (activeTab === "silver")
        basePrice = Number(d.base_silver_twd_qian) || 0

      if (!seenTimes.has(unixTime) && basePrice > 0) {
        seenTimes.add(unixTime)

        // 🌟 分別計算賣出價(較高)與回收價(較低)
        sellData.push({
          time: unixTime as Time,
          value: basePrice + currentSpread.sell,
        })
        buyData.push({
          time: unixTime as Time,
          value: basePrice + currentSpread.buy,
        })
      }
    })

    if (sellData.length === 0) return

    // 計算 ROI (投資回報率)
    if (sellData.length >= 2) {
      const firstPrice = sellData[0].value
      const lastPrice = sellData[sellData.length - 1].value
      const diff = lastPrice - firstPrice
      const percent = (diff / firstPrice) * 100
      setRoi({ diff, percent })
    }

    // 如果圖表還沒建立，就建立它
    if (!chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "#A8A29E",
          attributionLogo: false, // 隱藏浮水印
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
        crosshair: {
          mode: 1, // Magnet mode (十字線會吸附到資料點上)
        },
      })
      chartRef.current = chart

      // 建立「賣出價」(上方的線)
      // 💡 這裡換成正確的 V5 寫法
      const sellSeries = chart.addSeries(AreaSeries, {
        lineColor: "#DC2626", // 紅色代表漲/賣出
        topColor: "rgba(220, 38, 38, 0.2)",
        bottomColor: "rgba(220, 38, 38, 0.0)",
        lineWidth: 2,
        priceFormat: { type: "price", precision: 0, minMove: 1 },
      })
      sellSeriesRef.current = sellSeries

      // 建立「回收價」(下方的線)
      // 💡 這裡換成正確的 V5 寫法
      const buySeries = chart.addSeries(AreaSeries, {
        lineColor: "#16A34A", // 綠色代表回收
        topColor: "rgba(22, 163, 74, 0.2)",
        bottomColor: "rgba(22, 163, 74, 0.0)",
        lineWidth: 2,
        priceFormat: { type: "price", precision: 0, minMove: 1 },
      })
      buySeriesRef.current = buySeries
      // RWD 處理
      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({ width: chartContainerRef.current.clientWidth })
        }
      }
      window.addEventListener("resize", handleResize)
    }

    // 更新圖表資料
    if (sellSeriesRef.current && buySeriesRef.current) {
      sellSeriesRef.current.setData(sellData)
      buySeriesRef.current.setData(buyData)
      chartRef.current?.timeScale().fitContent()
    }

    // Cleanup 只在元件真正卸載時執行
    return () => {
      // 這裡不直接刪除圖表，而是保留實例供下次資料更新時重複使用
    }
  }, [historyData, activeTab]) // 當資料或 Tab 改變時重新計算

  // 獨立的 Cleanup：當整個組件被拔掉時才清掉 TradingView 實體
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
    }
  }, [])

  const getMetalName = () => {
    switch (activeTab) {
      case "gold":
        return "黃金"
      case "platinum":
        return "白金"
      case "silver":
        return "白銀"
    }
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 mb-20 font-sans">
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Header 控制區 */}
        <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 border-b border-stone-100 bg-stone-50/50 gap-4">
          <div className="flex p-1 bg-stone-200/50 rounded-lg">
            <button
              onClick={() => setActiveTab("gold")}
              className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${
                activeTab === "gold"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              黃金走勢
            </button>
            <button
              onClick={() => setActiveTab("platinum")}
              className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${
                activeTab === "platinum"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              白金走勢
            </button>
            <button
              onClick={() => setActiveTab("silver")}
              className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${
                activeTab === "silver"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              白銀走勢
            </button>
          </div>

          <div className="flex space-x-2">
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

        {/* 圖表呈現區塊 */}
        <div className="p-4 md:p-6 relative bg-white">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                {getMetalName()} 門市買賣走勢
              </h3>
              <span className="text-sm font-sans text-stone-400">
                (新台幣 / 台錢)
              </span>
            </div>

            {/* ROI 投資回報率顯示 */}
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

          {/* 圖例 Legend */}
          <div className="flex gap-6 mb-4 px-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#DC2626]"></div>
              <span className="text-xs text-stone-600 font-semibold">
                門市賣出價
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#16A34A]"></div>
              <span className="text-xs text-stone-600 font-semibold">
                門市回收價
              </span>
            </div>
          </div>

          {/* TradingView 圖表容器 */}
          <div className="h-[400px] md:h-[500px] w-full relative group">
            {loading && !chartRef.current && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-stone-200 border-t-[#D4AF37]"></div>
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
