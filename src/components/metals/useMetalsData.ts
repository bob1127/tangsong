"use client"

import { useEffect, useState } from "react"
import { deriveMetalDisplayPrices } from "@lib/metals/derive-prices"
import { fetchLatestMetalsClient } from "@lib/metals/fetch-metals"
import type { MetalsData } from "@lib/metals/types"

export function useMetalsData(initialData?: MetalsData | null) {
  const [data, setData] = useState<MetalsData | null>(initialData ?? null)
  const [loading, setLoading] = useState(!initialData)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    const refreshPrice = async () => {
      try {
        setError(false)
        const latest = await fetchLatestMetalsClient()
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

  const prices = deriveMetalDisplayPrices(data)

  return {
    data,
    prices,
    loading,
    error,
  }
}
