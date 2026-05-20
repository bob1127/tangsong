"use client"

import Image from "next/image"
import { ComponentPropsWithoutRef } from "react"

// 收購類別資料配置
const purchaseCategories = [
  {
    title: "黃金條塊收購",
    description:
      "高價回收集體金塊、五兩金條、國際條塊。參考即時牌價，透明化秤重，免扣耗損，給您最誠信的價格。",
    image: "/images/收購/黃金條塊.png",
  },
  {
    title: "精品珠寶鑽飾",
    description:
      "收購各類鑽石珠寶、GIA鑽石、紅藍寶石、名牌首飾。專業儀器精準鑑定，挖掘您珍藏珠寶的最高轉手價值。",
    image: "/images/收購/珠寶項鍊.png",
  },
  {
    title: "18K / 14K 金飾",
    description:
      "專業收購各類K金飾品、斷裂項鍊、單隻耳環、名牌K金錶帶。無論成色，皆可精準測試含金量，即時估價。",
    image: "/images/收購/高價收購K金飾品.png",
  },
  {
    title: "鉑金 / 白金條塊",
    description:
      "收購國際標準鉑金 (Pt950 / Pt900)、鉑金條塊、白金工業品。依據國際市場即時匯率調整，保證高價回流。",
    image: "/images/收購/鉑金條塊.png",
  },
  {
    title: "名錶 / K金錶帶收購",
    description:
      "高價收購各品牌K金腕錶、勞力士等頂級名錶，以及各式 K金錶帶。結合專業鐘錶與貴金屬雙重鑑定能力，精準量化品牌工藝與真金價值，提供您最優渥的收購行情。",
    image: "/images/收購/金錶、錶帶.png",
  },

  {
    title: "頂級翡翠玉石",
    description:
      "收購天然 A 貨翡翠、古玉、老鳳凰件、各式珍稀玉石。資深鑑定專家坐鎮，尊重藝術價值與歷史意義。",
    image: "/images/收購/翡翠玉.png",
  },
]

export default function PurchaseCategoryPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      {/* 1. Hero Section 標題區 */}
      <section className="relative py-20 ">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-wider mb-6">
            專業高價收購項目
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto leading-relaxed">
            唐宋珠寶秉持誠信原則，提供透明化的鑑定流程。我們專注於各類貴金屬、珍稀寶石的專業收購，
            確保您的每件珍藏都能獲得應有的價值認可。
          </p>
        </div>
      </section>

      {/* 2. Category Grid 類別網格 */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {purchaseCategories.map((item, index) => (
              <div
                key={index}
                className="group flex flex-col bg-white border border-stone-100 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* 圖片容器 */}
                <div className="relative h-64 w-full overflow-hidden bg-stone-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors"></div>
                </div>

                {/* 內容區域 */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#D4AF37]"></span>
                    {item.title}
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <div className="mt-auto">
                    <button className="text-[#D4AF37] text-sm font-bold border-b border-transparent hover:border-[#D4AF37] transition-all">
                      了解詳細收購流程 →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Value Props 收購優勢 */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="text-[#D4AF37] text-4xl mb-4">⚖️</div>
              <h4 className="text-xl font-bold font-serif">透明化秤重</h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                現場電子磅秤精準測試，數據完全公開，絕不灌水、不收鑑定費。
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-[#D4AF37] text-4xl mb-4">💎</div>
              <h4 className="text-xl font-bold font-serif">資深專業鑑定</h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                多年珠寶鑑定經驗，結合專業檢測儀器，確保您的珍藏獲得最高價值認證。
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-[#D4AF37] text-4xl mb-4">💵</div>
              <h4 className="text-xl font-bold font-serif">即時現金交易</h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                估價確認後立即支付現金，安全隱密且快速，滿足您即時的財務需求。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA 區塊 */}
      <section className="py-24 text-center">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">
            想要估價您的收藏嗎？
          </h2>
          <p className="text-stone-500 mb-10">
            您可以透過 LINE
            先傳照片，我們為您提供初步線上評估，或是直接親洽門市。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://lin.ee/QiLRhma" target="_blank">
              {" "}
              <button className="bg-[#1A0506] text-white px-10 py-4 rounded-md font-bold hover:bg-[#D4AF37] transition-colors">
                立即諮詢估價
              </button>
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=%E5%8F%B0%E5%8C%97%E5%B8%82%E8%90%AC%E8%8F%AF%E5%8D%80%E8%A5%BF%E5%9C%92%E8%B7%AF%E4%B8%80%E6%AE%B5166-1%E8%99%9F"
              target="_blank"
            >
              <button className="border border-stone-300 text-stone-900 px-10 py-4 rounded-md font-bold hover:bg-stone-50 transition-colors">
                瀏覽門市地址
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
