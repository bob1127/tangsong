"use client"

import { useEffect, useState } from "react"

interface MetalsData {
  updated_at?: string
  fetch_timestamp?: string
  exchange_rate_usd_twd: number
  gold_price_qian?: number
  platinum_price_qian?: number
  silver_price_qian?: number
  base_gold_twd_qian?: number
  base_platinum_twd_qian?: number
  base_silver_twd_qian?: number
}

export default function DetailedPriceTable() {
  const [data, setData] = useState<MetalsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || ""
        if (!backendUrl) throw new Error("尚未設定後端 API 網址")

        const res = await fetch(`${backendUrl}/store/metals`, {
          headers: {
            "x-publishable-api-key": process.env
              .NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY as string,
          },
        })

        if (!res.ok) throw new Error("API 請求失敗")

        const contentType = res.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("回傳的格式不是 JSON，請確認 API 路徑是否正確")
        }

        const json = await res.json()
        if (json.success) {
          // 🌟 關鍵修復：處理後端傳回陣列的情況
          // 如果是陣列，取第 0 筆 (最新)；如果不是，就直接用原本的物件
          const latestData = Array.isArray(json.data) ? json.data[0] : json.data
          setData(latestData)
        }
      } catch (error) {
        console.error("無法取得金價:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPrice()
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-[1400px] mx-auto mt-12 px-4 lg:px-8 mb-20">
        <div className="w-full h-64 bg-[#5A1216]/50 animate-pulse rounded-xl mt-8 border border-[#D4AF37]/20"></div>
      </div>
    )
  }

  if (!data) return null

  const rawGold = data.base_gold_twd_qian ?? data.gold_price_qian ?? 0
  const rawPt = data.base_platinum_twd_qian ?? data.platinum_price_qian ?? 0
  const rawAg = data.base_silver_twd_qian ?? data.silver_price_qian ?? 0
  const rate = data.exchange_rate_usd_twd ?? 32.0
  const updateTime =
    data.fetch_timestamp ?? data.updated_at ?? new Date().toISOString()

  const storeGoldSell = rawGold + 800
  const storeGoldBuy = rawGold - 200

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-12 px-4 lg:px-8 mb-20 font-mono">
      <div className="flex items-end justify-between mb-4 border-b border-[#D4AF37]/40 pb-3">
        <div>
          <h2 className="text-2xl md:text-4xl font-serif text-[#5A1216] tracking-widest    ">
            國際貴金屬與門市即時行情
          </h2>
          <p className="text-[#5A1216]/50 font-bold text-sm tracking-wider mt-2">
            資料更新時間：{new Date(updateTime).toLocaleString("zh-TW")}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#E8DCC4]/70 bg-[#5A1216]/50 border border-[#D4AF37]/20 px-3 py-1 rounded">
            美元匯率基準:{" "}
            <span className="text-[#FDF5E6]">{rate.toFixed(2)}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 space-y-6">
          <div className="bg-[#5A1216] border border-[#D4AF37]/30 rounded-lg overflow-hidden ">
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

          <div className="bg-[#5A1216] border border-[#D4AF37]/30 rounded-lg overflow-hidden ">
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
          <div className="bg-gradient-to-br from-[#73171C] to-[#4A0E12] border border-[#D4AF37]/50 rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-[#D4AF37]/10 px-4 py-3 text-sm font-bold text-[#D4AF37] border-b border-[#D4AF37]/30">
              唐宋珠寶 實體門市牌告價 (新台幣 / 台錢)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead className="bg-[#3A0A0E] text-[#D4AF37]/70 text-xs">
                  <tr>
                    <th className="py-3 px-4 font-normal">商品項目</th>
                    <th className="py-3 px-4 font-normal">單位</th>
                    <th className="py-3 px-4 font-normal">賣出價 (NT$)</th>
                    <th className="py-3 px-4 font-normal">回收價 (NT$)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                    <td className="py-5 px-4 text-[#D4AF37] font-bold text-base tracking-widest">
                      黃金飾金
                    </td>
                    <td className="py-5 px-4 text-[#E8DCC4]/70">台錢</td>
                    <td className="py-5 px-4 text-2xl font-bold text-[#FDF5E6]">
                      {storeGoldSell.toLocaleString()}
                    </td>
                    <td className="py-5 px-4 text-xl font-bold text-[#E8DCC4]/60">
                      {storeGoldBuy.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#D4AF37]/10 transition-colors">
                    <td className="py-5 px-4 text-[#E4E4E4] font-bold text-base tracking-widest">
                      白金 Pt950
                    </td>
                    <td className="py-5 px-4 text-[#E8DCC4]/70">台錢</td>
                    <td className="py-5 px-4 text-xl font-bold text-[#FDF5E6]">
                      {(rawPt + 1500).toLocaleString()}
                    </td>
                    <td className="py-5 px-4 text-lg font-bold text-[#E8DCC4]/60">
                      {(rawPt - 500).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#5A1216] border border-[#D4AF37]/30 rounded-lg overflow-hidden ">
            <div className="bg-[#3A0A0E] px-4 py-2 text-sm font-bold text-[#D4AF37] border-b border-[#D4AF37]/20">
              國際現貨金價即時行情 (新台幣 / 台錢)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead className="bg-[#3A0A0E] text-[#D4AF37]/70 text-xs">
                  <tr>
                    <th className="py-3 px-4 font-normal">商品名稱</th>
                    <th className="py-3 px-4 font-normal">目前行情</th>
                    <th className="py-3 px-4 font-normal">漲跌 (+/-)</th>
                    <th className="py-3 px-4 font-normal">本日最高 (佔位)</th>
                    <th className="py-3 px-4 font-normal">本日最低 (佔位)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                    <td className="py-3 px-4 text-[#D4AF37] font-medium tracking-wider">
                      黃金 XAU
                    </td>
                    <td className="py-3 px-4 text-[#FDF5E6] font-bold text-base">
                      {rawGold.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#FF6B6B] font-medium">
                      +125.50 ▲
                    </td>
                    <td className="py-3 px-4 text-[#E8DCC4]/60">
                      {(rawGold + 200).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#E8DCC4]/60">
                      {(rawGold - 150).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="border-b border-[#D4AF37]/10 hover:bg-[#D4AF37]/10 transition-colors">
                    <td className="py-3 px-4 text-[#E4E4E4] font-medium tracking-wider">
                      白金 XPT
                    </td>
                    <td className="py-3 px-4 text-[#FDF5E6] font-bold text-base">
                      {rawPt.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#4ADE80] font-medium">
                      -45.20 ▼
                    </td>
                    <td className="py-3 px-4 text-[#E8DCC4]/60">
                      {(rawPt + 80).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#E8DCC4]/60">
                      {(rawPt - 60).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="hover:bg-[#D4AF37]/10 transition-colors">
                    <td className="py-3 px-4 text-[#D1D5DB] font-medium tracking-wider">
                      白銀 XAG
                    </td>
                    <td className="py-3 px-4 text-[#FDF5E6] font-bold text-base">
                      {rawAg.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#FF6B6B] font-medium">
                      +2.30 ▲
                    </td>
                    <td className="py-3 px-4 text-[#E8DCC4]/60">
                      {(rawAg + 15).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#E8DCC4]/60">
                      {(rawAg - 10).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
