"use client"

import React, { useEffect, useRef } from "react"

export default function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 避免在開發模式下重複載入腳本
    if (document.getElementById("tradingview-widget-script")) return

    const script = document.createElement("script")
    script.id = "tradingview-widget-script"
    script.src = "https://s3.tradingview.com/tv.js"
    script.type = "text/javascript"
    script.async = true
    script.onload = () => {
      if (typeof window !== "undefined" && (window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: "OANDA:XAUUSD",
          interval: "60",
          timezone: "Asia/Taipei",
          // 🎯 核心修改：改為淺色主題
          theme: "light",
          style: "1",
          locale: "zh_TW",
          enable_publishing: false,

          // 🎨 淺色古典風色彩設定
          backgroundColor: "#FDFBF7", // 溫潤的米白色 (類似頂級宣紙)
          gridColor: "rgba(212, 175, 55, 0.15)", // 稍微加深一點點的金線網格，確保在白底上看得到
          toolbar_bg: "#F4EFE6", // 淺卡其色工具列

          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          container_id: "tradingview_chart_container",
        })
      }
    }

    document.head.appendChild(script)

    return () => {
      const scriptElement = document.getElementById("tradingview-widget-script")
      if (scriptElement) {
        document.head.removeChild(scriptElement)
      }
    }
  }, [])

  return (
    // 外層容器也改為明亮的米白色系，並加入細緻的金線邊框
    <div className="w-full bg-[#FAFAFA] py-12 px-4 md:px-12 border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* 標題區 */}
        <div className="flex flex-col gap-2">
          {/* 左側金線保留，文字改為深燕脂紅，在白底上非常典雅 */}
          <h2 className="text-2xl md:text-4xl font-serif text-[#5A1216] tracking-widest    ">
            國際貴金屬即時行情
          </h2>
          <p className="text-[#5A1216]/50 text-sm tracking-wider mt-2 font-bold">
            Real-time Market Chart
          </p>
        </div>

        {/* TradingView 圖表容器 */}
        {/* 陰影改為較柔和的淺色陰影，避免突兀 */}
        <div className="w-full h-[500px] md:h-[700px] rounded-xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_10px_40px_rgba(90,18,22,0.08)]">
          <div
            id="tradingview_chart_container"
            className="h-full w-full"
            ref={containerRef}
          />
        </div>
      </div>
    </div>
  )
}
