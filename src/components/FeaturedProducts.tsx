"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

// ==========================================
// 1. 定義 Medusa 商品相關的 TypeScript 型別
// ==========================================
interface ProductPrice {
  currency_code: string
  amount: number
}

interface ProductVariant {
  id: string
  prices?: ProductPrice[]
}

interface Product {
  id: string
  title: string
  handle: string
  thumbnail?: string | null
  variants?: ProductVariant[]
}

// ==========================================
// 2. 首頁精選商品元件
// ==========================================
export default function FeaturedProducts() {
  // 明確指定 state 的型別
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError(false)
        // 自動抓取 Medusa 後端網址與 API Key
        const backendUrl =
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const apiKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

        // 呼叫 Medusa 預設的商品 API (抓取前 4 筆商品)
        const res = await fetch(`${backendUrl}/store/products?limit=4`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": apiKey,
          },
          // 首頁商品建議可以加上快取或 Revalidate 時間
          next: { revalidate: 60 },
        })

        if (!res.ok) throw new Error("無法取得商品資料")

        const json = await res.json()
        // 確保 json.products 存在，否則給予空陣列
        setProducts(json.products || [])
      } catch (err) {
        console.error("抓取商品失敗:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // 輔助函式：解析 Medusa 商品價格 (為傳入的 product 參數加上型別)
  const formatPrice = (product: Product): string => {
    try {
      const variants = product.variants
      if (!variants || variants.length === 0) return "價格請洽門市"

      const prices = variants[0].prices
      if (!prices || prices.length === 0) return "價格請洽門市"

      // 找出台幣定價 (或是第一個定價)
      const twdPrice =
        prices.find((p) => p.currency_code === "twd") || prices[0]

      // Medusa 的金額通常是實際金額 (例如台幣不需除以 100，但美金可能需要)
      // 若你的 Medusa 設定中台幣有小數位數，可能需要除以 100，請依實際情況調整
      return `NT$ ${twdPrice.amount.toLocaleString()}`
    } catch (e) {
      return "價格請洽門市"
    }
  }

  return (
    <section className="w-full bg-[#fbfcfd] py-24 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-10 pb-4">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-wide">
              最新珍藏與精選
            </h2>
            <p className="text-sm text-stone-500 mt-1">我們的商品</p>
          </div>
        </div>

        {/* 錯誤狀態 */}
        {error && (
          <div className="text-center py-10 text-stone-400 text-sm tracking-widest">
            目前無法載入商品，請稍後再試或聯繫客服。
          </div>
        )}

        {/* 載入中：骨架屏 (Skeleton) */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col gap-4 animate-pulse">
                <div className="w-full aspect-[4/5] bg-stone-200 rounded-sm"></div>
                <div className="w-2/3 h-4 bg-stone-200 rounded-sm"></div>
                <div className="w-1/3 h-4 bg-stone-200 rounded-sm"></div>
              </div>
            ))}
          </div>
        )}

        {/* 商品列表 */}
        {!loading && !error && products.length > 0 && (
          <div className="grid  grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.handle}`}
                className="group flex flex-col cursor-pointer"
              >
                {/* 圖片容器 */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-stone-100 rounded-sm mb-5 shadow-sm group-hover:shadow-lg transition-shadow duration-500 border border-transparent group-hover:border-[#D4AF37]/30">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-xs">
                      No Image
                    </div>
                  )}

                  {/* 懸停時出現的黑色漸層與按鈕 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <span className="text-white text-xs font-bold tracking-widest border-b border-white/50 pb-1 w-fit">
                      探索細節
                    </span>
                  </div>
                </div>

                {/* 資訊容器 */}
                <div className="flex flex-col items-center text-center px-2">
                  <h3 className="text-sm font-bold tracking-wider text-stone-800 mb-2 group-hover:text-[#b62f26] transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-xs font-mono text-stone-500 tracking-widest">
                    {formatPrice(product)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 底部查看所有按鈕 */}
        {!loading && !error && (
          <div className="flex justify-center mt-16">
            <Link
              href="/store"
              className="bg-transparent border border-stone-300 text-stone-700 px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#b62f26] hover:border-[#b62f26] hover:text-white transition-all duration-300 rounded-sm"
            >
              瀏覽完整系列
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
