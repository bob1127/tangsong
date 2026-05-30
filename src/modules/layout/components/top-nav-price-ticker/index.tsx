"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { deriveMetalDisplayPrices } from "@lib/metals/derive-prices"
import type { MetalsData } from "@lib/metals/types"
import styles from "./top-nav-price-ticker.module.css"

type TopNavPriceTickerProps = {
  initialData?: MetalsData | null
}

const ROTATE_MS = 3500
const ITEM_HEIGHT_REM = 2
const TRANSITION_MS = 600

function formatBuyPrice(price: number | undefined): string {
  if (!price || price <= 0) return "更新中"
  return `NT$ ${price.toLocaleString()} / 台錢`
}

function buildTickerItems(data: MetalsData | null): string[] {
  const prices = deriveMetalDisplayPrices(data)
  return [
    "今日國際金價已更新",
    `黃金飾金回收價 ${formatBuyPrice(prices?.storeGoldBuy)}`,
    `18K金回收價 ${formatBuyPrice(prices?.store18kBuy)}`,
    `14K金回收價 ${formatBuyPrice(prices?.store14kBuy)}`,
    `白金 Pt950 回收價 ${formatBuyPrice(prices?.storePtBuy)}`,
    "歡迎線上預約門市鑑賞",
  ]
}

async function fetchLatestMetals(): Promise<MetalsData | null> {
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

  const res = await fetch(`${backendUrl}/store/metals?nocache=${Date.now()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": apiKey,
    },
    cache: "no-store",
  })

  if (!res.ok) return null

  const json = await res.json()
  if (!json.success) return null

  return Array.isArray(json.data) ? json.data[0] : json.data
}

export default function TopNavPriceTicker({
  initialData = null,
}: TopNavPriceTickerProps) {
  const [data, setData] = useState<MetalsData | null>(initialData)
  const [activeIndex, setActiveIndex] = useState(0)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const itemsKeyRef = useRef("")
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    const refresh = async () => {
      try {
        const latest = await fetchLatestMetals()
        if (!cancelled && latest) setData(latest)
      } catch {
        // 保留 initialData / 上次成功資料
      }
    }

    refresh()
    const interval = setInterval(refresh, 180000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const tickerItems = useMemo(() => buildTickerItems(data), [data])
  const itemsKey = tickerItems.join("|")
  const itemCount = tickerItems.length

  // 末尾加第一則 clone，讓最後→第一則可以同方向滑動
  const loopItems = useMemo(
    () =>
      itemCount > 0 ? [...tickerItems, tickerItems[0]] : tickerItems,
    [tickerItems, itemCount]
  )

  useEffect(() => {
    if (itemsKeyRef.current !== itemsKey) {
      itemsKeyRef.current = itemsKey
      setTransitionEnabled(true)
      setActiveIndex(0)
    }
  }, [itemsKey])

  useEffect(() => {
    if (itemCount <= 1) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => prev + 1)
    }, ROTATE_MS)

    return () => clearInterval(timer)
  }, [itemsKey, itemCount])

  // 滑到 clone（index === itemCount）後，無動畫跳回 0
  useEffect(() => {
    if (activeIndex !== itemCount || itemCount <= 1) return

    const track = trackRef.current
    if (!track) return

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName !== "transform") return

      setTransitionEnabled(false)
      setActiveIndex(0)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTransitionEnabled(true))
      })
    }

    track.addEventListener("transitionend", handleTransitionEnd)
    return () => track.removeEventListener("transitionend", handleTransitionEnd)
  }, [activeIndex, itemCount])

  return (
    <div className="topNav w-full bg-[#3A0A0E] border-b border-[#D4AF37]/30 py-1">
      <div className={styles.wrapper} aria-live="polite" aria-atomic="true">
        <div className={styles.viewport}>
          <div
            ref={trackRef}
            className={`${styles.track} ${transitionEnabled ? "" : styles.trackInstant}`}
            style={{
              transform: `translateY(-${activeIndex * ITEM_HEIGHT_REM}rem)`,
              transitionDuration: transitionEnabled
                ? `${TRANSITION_MS}ms`
                : "0ms",
            }}
          >
            {loopItems.map((text, index) => (
              <div key={`${index}-${text}`} className={styles.item}>
                <span className={styles.dot} aria-hidden />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
