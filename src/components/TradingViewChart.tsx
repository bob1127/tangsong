"use client"

import React, { useEffect, useRef } from "react"

type TradingViewChartProps = {
  embedded?: boolean
}

export default function TradingViewChart({ embedded = false }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetContainerId = embedded
    ? "tradingview_chart_embedded"
    : "tradingview_chart_container"

  useEffect(() => {
    const initWidget = () => {
      if (typeof window === "undefined" || !(window as any).TradingView) return
      if (!document.getElementById(widgetContainerId)) return

      new (window as any).TradingView.widget({
        autosize: true,
        symbol: "OANDA:XAUUSD",
        interval: "60",
        timezone: "Asia/Taipei",
        theme: "light",
        style: "1",
        locale: "zh_TW",
        enable_publishing: false,
        backgroundColor: "#FDFBF7",
        gridColor: "rgba(212, 175, 55, 0.15)",
        toolbar_bg: "#F4EFE6",
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: widgetContainerId,
      })
    }

    const existingScript = document.getElementById("tradingview-widget-script")
    if (existingScript) {
      initWidget()
      return
    }

    const script = document.createElement("script")
    script.id = "tradingview-widget-script"
    script.src = "https://s3.tradingview.com/tv.js"
    script.type = "text/javascript"
    script.async = true
    script.onload = initWidget
    document.head.appendChild(script)
  }, [widgetContainerId])

  const chartBox = (
    <div
      className={
        embedded
          ? "w-full h-[420px] md:h-[560px] overflow-hidden bg-[#FAFAFA]"
          : "w-full h-[500px] md:h-[700px] rounded-xl overflow-hidden border border-[#D4AF37]/40 shadow-[0_10px_40px_rgba(90,18,22,0.08)]"
      }
    >
      <div
        id={widgetContainerId}
        className="h-full w-full"
        ref={containerRef}
      />
    </div>
  )

  if (embedded) {
    return chartBox
  }

  return (
    <div className="w-full bg-[#FAFAFA] py-12 px-4 md:px-12 border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl md:text-4xl font-serif text-[#5A1216] tracking-widest">
            國際貴金屬即時行情
          </h2>
          <p className="text-[#5A1216]/50 text-sm tracking-wider mt-2 font-bold">
            Real-time Market Chart
          </p>
        </div>
        {chartBox}
      </div>
    </div>
  )
}
