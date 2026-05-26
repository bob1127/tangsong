import { Metadata } from "next"
import Image from "next/image"

import { SITE_URL, canonicalUrl } from "@lib/util/site-url"

// ==========================
// ISR：60 秒重新驗證
// ==========================
export const revalidate = 60

// ==========================
// 收購類別資料
// ==========================
const purchaseCategories = [
  {
    title: "黃金條塊收購",
    description:
      "高價回收集體金塊、五兩金條、國際條塊。參考即時牌價，透明化秤重，免扣耗損，給您最誠信的價格。",
    image: "/images/收購/黃金條塊.png",
    keywords: ["黃金條塊回收", "金條收購", "黃金條塊高價"],
  },
  {
    title: "精品珠寶鑽飾",
    description:
      "收購各類鑽石珠寶、GIA鑽石、紅藍寶石、名牌首飾。專業儀器精準鑑定，挖掘您珍藏珠寶的最高轉手價值。",
    image: "/images/收購/珠寶項鍊.png",
    keywords: ["鑽石回收", "GIA鑽石收購", "珠寶回收"],
  },
  {
    title: "18K / 14K 金飾",
    description:
      "專業收購各類K金飾品、斷裂項鍊、單隻耳環、名牌K金錶帶。無論成色，皆可精準測試含金量，即時估價。",
    image: "/images/收購/高價收購K金飾品.png",
    keywords: ["K金回收", "18K金收購", "14K金回收"],
  },
  {
    title: "鉑金 / 白金條塊",
    description:
      "收購國際標準鉑金 (Pt950 / Pt900)、鉑金條塊、白金工業品。依據國際市場即時匯率調整，保證高價回流。",
    image: "/images/收購/鉑金條塊.png",
    keywords: ["鉑金回收", "白金收購", "Pt950回收"],
  },
  {
    title: "名錶 / K金錶帶收購",
    description:
      "高價收購各品牌K金腕錶、勞力士等頂級名錶，以及各式 K金錶帶。結合專業鐘錶與貴金屬雙重鑑定能力，精準量化品牌工藝與真金價值，提供您最優渥的收購行情。",
    image: "/images/收購/金錶、錶帶.png",
    keywords: ["名錶回收", "勞力士收購", "K金錶帶回收"],
  },
  {
    title: "頂級翡翠玉石",
    description:
      "收購天然 A 貨翡翠、古玉、老鳳凰件、各式珍稀玉石。資深鑑定專家坐鎮，尊重藝術價值與歷史意義。",
    image: "/images/收購/翡翠玉.png",
    keywords: ["翡翠回收", "玉石收購", "A貨翡翠鑑定"],
  },
]

// ==========================
// 1. SEO Metadata
// ==========================
export const metadata: Metadata = {
  title:
    "高價收購項目 | 黃金、K金、鉑金、鑽石、名錶、翡翠 | 唐宋珠寶 台北萬華",
  description:
    "唐宋珠寶高價收購項目包含：黃金條塊、18K/14K金飾、鉑金條塊、GIA鑽石珠寶、勞力士名錶、頂級翡翠玉石。台北萬華實體銀樓，透明秤重、資深鑑定、即時現金交易，誠信有保障。",
  keywords: [
    "黃金條塊收購",
    "K金回收",
    "18K金收購",
    "鉑金回收",
    "白金收購",
    "鑽石回收",
    "GIA鑽石收購",
    "名錶回收",
    "勞力士收購",
    "翡翠回收",
    "玉石收購",
    "貴金屬收購",
    "高價收購",
    "台北黃金收購",
    "台北萬華收購",
    "唐宋珠寶收購",
    "珠寶回收",
  ],
  openGraph: {
    title:
      "高價收購項目 | 黃金、K金、鉑金、鑽石、名錶、翡翠 | 唐宋珠寶 台北萬華",
    description:
      "台北萬華唐宋珠寶高價收購黃金條塊、K金、鉑金、GIA鑽石、名錶、翡翠玉石。透明秤重、即時現金，專業鑑定無黑箱。",
    url: `${SITE_URL}/purchase-categories`,
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/0002.jpg`,
        width: 1200,
        height: 630,
        alt: "唐宋珠寶高價收購項目 - 黃金K金鉑金鑽石名錶翡翠",
      },
    ],
  },
  alternates: {
    canonical: canonicalUrl("/purchase-categories"),
  },
}

// ==========================
// 2. 結構化資料
// ==========================

// A. 麵包屑
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "首頁", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "高價收購項目",
      item: `${SITE_URL}/purchase-categories`,
    },
  ],
}

// B. CollectionPage
const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/purchase-categories#page`,
  name: "唐宋珠寶高價收購項目",
  description:
    "台北萬華唐宋珠寶高價收購黃金條塊、18K/14K金飾、鉑金條塊、GIA鑽石珠寶、名錶、翡翠玉石，透明秤重、資深鑑定、即時現金交易。",
  url: `${SITE_URL}/purchase-categories`,
  image: `${SITE_URL}/images/0002.jpg`,
  provider: { "@id": `${SITE_URL}/#store` },
}

// C. 六項收購服務的 ItemList
const serviceListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "唐宋珠寶收購服務清單",
  url: `${SITE_URL}/purchase-categories`,
  numberOfItems: purchaseCategories.length,
  itemListElement: purchaseCategories.map((cat, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: cat.title,
      description: cat.description,
      url: `${SITE_URL}/purchase-categories`,
      provider: {
        "@type": "JewelryStore",
        name: "唐宋珠寶",
        url: SITE_URL,
      },
      areaServed: {
        "@type": "City",
        name: "台北市",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "TWD",
        description: "免費到店鑑定估價",
        availability: "https://schema.org/InStock",
      },
    },
  })),
}

// D. FAQPage（收購常見問題，強化長尾搜尋）
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "唐宋珠寶收購哪些物品？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "唐宋珠寶高價收購黃金條塊、9999純金、18K/14K金飾、鉑金（Pt950/Pt900）條塊、GIA鑽石珠寶、紅藍寶石、勞力士等品牌名錶、K金錶帶，以及天然A貨翡翠玉石。",
      },
    },
    {
      "@type": "Question",
      name: "收購時需要帶什麼嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "需攜帶本人身份證件（依法規規定）及欲出售的物品。如有購買證明、保證書或GIA證書，可帶來參考，有助於更精準估價。",
      },
    },
    {
      "@type": "Question",
      name: "沒有保單的K金或鉑金可以收購嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以。唐宋珠寶使用精密XRF光譜儀與熔融檢測，即使沒有保單或證書，也能科學鑑定成色，給您公平的收購價格。",
      },
    },
    {
      "@type": "Question",
      name: "名錶收購如何估價？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "名錶收購會依品牌、型號、錶款狀況（外觀、機芯）及市場行情綜合估價。若為K金材質錶帶，還會額外計算貴金屬含量價值，提供雙重估價保障。",
      },
    },
    {
      "@type": "Question",
      name: "收購過程需要多久時間？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般物品約30分鐘可完成鑑定與交易。若需進行熔融檢測，可能需要額外1小時左右，建議可提前電話預約，確保專人接待。",
      },
    },
  ],
}

const combinedSchemas = [
  breadcrumbSchema,
  collectionPageSchema,
  serviceListSchema,
  faqSchema,
]

// ==========================
// 3. Page Component (Server)
// ==========================
export default function PurchaseCategoryPage() {
  return (
    <div className="bg-white min-h-screen font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchemas) }}
      />

      {/* 1. Hero Section */}
      <section className="relative py-20">
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

      {/* 2. Category Grid */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {purchaseCategories.map((item, index) => (
              <div
                key={index}
                className="group flex flex-col bg-white border border-stone-100 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 w-full overflow-hidden bg-stone-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors" />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <h2 className="text-2xl font-serif font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#D4AF37] shrink-0" />
                    {item.title}
                  </h2>
                  <p className="text-stone-500 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                  <div className="mt-auto">
                    <a
                      href="/purchase-process"
                      className="text-[#D4AF37] text-sm font-bold border-b border-transparent hover:border-[#D4AF37] transition-all"
                    >
                      了解詳細收購流程 →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Value Props */}
      <section className="py-20 bg-stone-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-4">
              <div className="text-[#D4AF37] text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold font-serif">透明化秤重</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                現場電子磅秤精準測試，數據完全公開，絕不灌水、不收鑑定費。
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-[#D4AF37] text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold font-serif">資深專業鑑定</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                多年珠寶鑑定經驗，結合專業檢測儀器，確保您的珍藏獲得最高價值認證。
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-[#D4AF37] text-4xl mb-4">💵</div>
              <h3 className="text-xl font-bold font-serif">即時現金交易</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                估價確認後立即支付現金，安全隱密且快速，滿足您即時的財務需求。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="py-24 text-center">
        <div className="max-w-[1400px] mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">
            想要估價您的收藏嗎？
          </h2>
          <p className="text-stone-500 mb-10">
            您可以透過 LINE 先傳照片，我們為您提供初步線上評估，或是直接親洽門市。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://lin.ee/QiLRhma" target="_blank" rel="noopener noreferrer">
              <button className="bg-[#1A0506] text-white px-10 py-4 rounded-md font-bold hover:bg-[#D4AF37] transition-colors">
                立即諮詢估價
              </button>
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=%E5%8F%B0%E5%8C%97%E5%B8%82%E8%90%AC%E8%8F%AF%E5%8D%80%E8%A5%BF%E5%9C%92%E8%B7%AF%E4%B8%80%E6%AE%B5166-1%E8%99%9F"
              target="_blank"
              rel="noopener noreferrer"
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
