"use client"

import { useState } from "react"

interface ConverterValues {
  gram: string
  qian: string
  liang: string
  oz: string
}

export default function GoldWeightConverterPage() {
  const [values, setValues] = useState<ConverterValues>({
    gram: "",
    qian: "",
    liang: "",
    oz: "",
  })

  // 核心即時雙向連動換算邏輯
  const handleConvert = (val: string, unit: keyof ConverterValues) => {
    // 如果輸入為空，清空所有欄位
    if (val === "") {
      setValues({ gram: "", qian: "", liang: "", oz: "" })
      return
    }

    // 允許使用者輸入小數點（如 "0." 或 "5."），避免因 parseFloat 導致無法輸入小數點
    const nextValues = { ...values, [unit]: val }

    const num = parseFloat(val)
    if (!isNaN(num)) {
      let baseGram = 0

      // 1. 先統一換算回標準單位：公克 (g)
      if (unit === "gram") baseGram = num
      if (unit === "qian") baseGram = num * 3.75
      if (unit === "liang") baseGram = num * 37.5
      if (unit === "oz") baseGram = num * 31.1034768

      // 2. 再由公克精準推算其他三個單位（保留小數點後四位，並剔除多餘的 0）
      if (unit !== "gram") {
        nextValues.gram = String(parseFloat(baseGram.toFixed(4)))
      }
      if (unit !== "qian") {
        nextValues.qian = String(parseFloat((baseGram / 3.75).toFixed(4)))
      }
      if (unit !== "liang") {
        nextValues.liang = String(parseFloat((baseGram / 37.5).toFixed(4)))
      }
      if (unit !== "oz") {
        nextValues.oz = String(parseFloat((baseGram / 31.1034768).toFixed(4)))
      }
    }

    setValues(nextValues)
  }

  // 快捷鍵填入功能
  const setPreset = (amount: string, unit: keyof ConverterValues) => {
    handleConvert(amount, unit)
  }

  // 一鍵清空
  const handleClear = () => {
    setValues({ gram: "", qian: "", liang: "", oz: "" })
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-8 py-12 font-sans bg-stone-50/30 min-h-screen">
      {/* 標題區 */}
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-wide mb-3">
          貴金屬重量線上即時換算器
        </h1>
        <p className="text-sm text-stone-800">
          專為銀樓黃金與國際珠寶交易設計，輸入任意欄位即可即時雙向精準換算。
        </p>
      </div>

      {/* 主換算卡片區 */}
      <div className="max-w-2xl mx-auto bg-white border border-stone-200 shadow-sm overflow-hidden rounded-xl">
        {/* 工具列 */}
        <div className="flex justify-between items-center px-6 py-4 bg-stone-50 border-b border-stone-100">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            LIVE Real-time Converter
          </span>
          <button
            onClick={handleClear}
            className="text-xs font-bold text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1 bg-stone-200/60 px-3 py-1.5 rounded-md"
          >
            ✕ 清空欄位
          </button>
        </div>

        {/* 輸入欄位網格 */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. 台錢 */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-bold text-stone-800 font-serif">
                  台錢 (銀樓標準)
                </label>
                <span className="text-xs text-stone-400">錢</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={values.qian}
                  onChange={(e) => handleConvert(e.target.value, "qian")}
                  placeholder="0.00"
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-lg px-4 py-3 text-lg font-semibold text-stone-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                />
              </div>
              <div className="flex gap-1.5 mt-1">
                {["1", "5", "10"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setPreset(v, "qian")}
                    className="text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200/70 text-stone-600 rounded font-medium transition-all"
                  >
                    {v} 錢
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 公克 */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-bold text-stone-800 font-serif">
                  公克 (國際公制)
                </label>
                <span className="text-xs text-stone-400">g</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={values.gram}
                  onChange={(e) => handleConvert(e.target.value, "gram")}
                  placeholder="0.00"
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-lg px-4 py-3 text-lg font-semibold text-stone-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                />
              </div>
              <div className="flex gap-1.5 mt-1">
                {["10", "37.5", "100"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setPreset(v, "gram")}
                    className="text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200/70 text-stone-600 rounded font-medium transition-all"
                  >
                    {v} g
                  </button>
                ))}
              </div>
            </div>

            {/* 3. 台兩 */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-bold text-stone-800 font-serif">
                  台兩
                </label>
                <span className="text-xs text-stone-400">兩</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={values.liang}
                  onChange={(e) => handleConvert(e.target.value, "liang")}
                  placeholder="0.00"
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-lg px-4 py-3 text-lg font-semibold text-stone-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                />
              </div>
              <div className="flex gap-1.5 mt-1">
                {["1", "5", "10"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setPreset(v, "liang")}
                    className="text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200/70 text-stone-600 rounded font-medium transition-all"
                  >
                    {v} 兩
                  </button>
                ))}
              </div>
            </div>

            {/* 4. 金衡盎司 */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-sm font-bold text-stone-800 font-serif">
                  金衡盎司 (貴金屬專用)
                </label>
                <span className="text-xs text-stone-400">oz</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={values.oz}
                  onChange={(e) => handleConvert(e.target.value, "oz")}
                  placeholder="0.00"
                  className="w-full bg-stone-50/50 border border-stone-200 rounded-lg px-4 py-3 text-lg font-semibold text-stone-900 focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
                />
              </div>
              <div className="flex gap-1.5 mt-1">
                {["1", "5", "10"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setPreset(v, "oz")}
                    className="text-[11px] px-2 py-1 bg-stone-100 hover:bg-stone-200/70 text-stone-600 rounded font-medium transition-all"
                  >
                    {v} oz
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 換算知識說明區 */}
        <div className="bg-stone-50/80 p-6 border-t border-stone-100 text-xs text-stone-500 space-y-3">
          <h4 className="font-bold text-stone-700 text-sm font-serif flex items-center gap-1">
            <span className="text-[#D4AF37]">✦</span> 貴金屬換算小知識
          </h4>
          <ul className="list-disc pl-4 space-y-1.5 leading-relaxed">
            <li>
              <strong className="text-stone-700">台灣傳統衡制：</strong>
              採十進位制，
              <span className="font-semibold text-stone-700">1 兩 = 10 錢</span>
              ，1 錢 = 10 分，1 分 = 10 釐。
            </li>
            <li>
              <strong className="text-stone-700">公制與台制轉換：</strong>
              銀樓標準法規規定，
              <span className="font-semibold text-stone-700">
                1 錢精確等於 3.75 公克
              </span>
              。因此 1 兩即為 37.5 公克。
            </li>
            <li>
              <strong className="text-stone-700">
                金衡盎司 (Troy Ounce) 的差別：
              </strong>
              國際貴金屬市場（如黃金、白金、鈀金走勢）交易皆採用「金衡盎司（oz）」，
              <span className="font-semibold text-stone-600">
                1 金衡盎司精確等於 31.1034768 公克
              </span>
              （約等於台灣銀樓衡制的{" "}
              <span className="text-stone-700 font-semibold">8.2943 錢</span>
              ）。這與一般廚房烘焙、民生用品使用的常衡盎司（Avoirdupois
              Ounce，約 28.35 公克）完全不同，計算金價時切勿混淆。
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
