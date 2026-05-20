import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"

// ==========================
// 1. 首頁 SEO 設定 (強化版 Metadata)
// ==========================
export const metadata: Metadata = {
  title:
    "唐宋珠寶 Tangsong | 專業黃金買賣、即時金價與珠寶鑑賞 | 台北萬華區黃金珠寶銀樓",
  description:
    "位於台北萬華龍山寺對面，專營買賣黃金、K金、白金、珠寶鑽石。提供貴金屬分析、舊金翻新、客製化修改及免費鑑定服務。誠信經營，為您提供最安心的珠寶體驗。",
  openGraph: {
    title: "唐宋珠寶 Tangsong | 專業黃金買賣、即時金價與珠寶鑑賞",
    description:
      "位於台北萬華龍山寺對面，專營買賣黃金、K金、白金、珠寶鑽石。提供貴金屬分析、舊金翻新、客製化修改及免費鑑定服務。",
    url: "https://www.tangsong.com.tw",
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://www.tangsong.com.tw/images/0002.jpg", // 請確保這是絕對路徑
        width: 1200,
        height: 630,
        alt: "唐宋珠寶 - 專業黃金買賣與珠寶鑑賞",
      },
    ],
  },
}

// ==========================
// 2. 結構化資料 (分門別類定義)
// ==========================

// A. 商家實體店面資訊 (LocalBusiness / JewelryStore)
const storeSchema = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "唐宋珠寶",
  alternateName: "Tangsong Jewelry",
  image: "https://www.tangsong.com.tw/logo.png",
  "@id": "https://www.tangsong.com.tw/#store",
  url: "https://www.tangsong.com.tw",
  telephone: "02-2306-9928",
  email: "a0223069928@gmail.com",
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "西園路一段166-1號",
    addressLocality: "萬華區",
    addressRegion: "台北市",
    postalCode: "108",
    addressCountry: "TW",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.0358, // 建議替換為精確座標
    longitude: 121.4988,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "11:00",
      closes: "21:00",
    },
  ],
}

// B. 官方網站架構 (WebSite) - 幫助 Google 建立 Sitelinks
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.tangsong.com.tw/#website",
  url: "https://www.tangsong.com.tw",
  name: "唐宋珠寶 Tangsong",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.tangsong.com.tw/store?q={search_term_string}", // 如果你有搜尋功能，這能讓 Google 搜尋結果出現站內搜尋框
    "query-input": "required name=search_term_string",
  },
}

// C. 常見問答 (FAQPage) - 讓搜尋結果佔據更大版面
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "請問有提供黃金回收或舊金換新服務嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "有的，唐宋珠寶提供高價黃金、K金、白金、鈀金等貴金屬回收服務，並提供免費專業儀器鑑定。您也可以選擇舊金換新方案，挑選最新款式的珠寶首飾。",
      },
    },
    {
      "@type": "Question",
      name: "門市預約鑑賞需要提前多久預約？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "為提供您專屬且完善的服務品質，建議您提前 1 至 3 天透過官網表單或 LINE 官方帳號進行預約，我們將安排專屬顧問為您服務。",
      },
    },
    {
      "@type": "Question",
      name: "有提供客製化珠寶訂製嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "有的，我們提供專業的客製化珠寶設計與舊台翻新修改服務。您可以帶上您的想法或舊飾品與我們討論，打造獨一無二的專屬首飾。",
      },
    },
  ],
}

// D. 首頁主打商品/服務清單 (ItemList) - 首頁專用產品結構
const productListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service", // 服務類
        name: "高價黃金回收與免費鑑定",
        url: "https://www.tangsong.com.tw/services/gold-recycling",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Product", // 產品類
        name: "9999純黃金婚嫁套組",
        url: "https://www.tangsong.com.tw/store", // 可導向你的主要商店頁
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "客製化珠寶設計與舊台翻新",
        url: "https://www.tangsong.com.tw/services/custom-jewelry",
      },
    },
  ],
}

// 組合所有結構化資料成一個陣列 (Google 推薦作法)
const combinedSchemas = [
  storeSchema,
  websiteSchema,
  faqSchema,
  productListSchema,
]

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center bg-black text-white text-xl text-center p-10">
        <h1 className="text-red-500 font-bold mb-4">🚨 找不到地區設定！</h1>
        <p>
          前端傳送的國碼是：
          <span className="text-yellow-400 font-mono">{countryCode}</span>
        </p>
        <p className="mt-4 text-sm text-gray-400">
          請去 Medusa 後台 ➔ 設定 ➔ 地區 (Regions) <br />{" "}
          編輯你的台灣地區，並確認有把「台灣 (Taiwan)」加入到國家列表中！
        </p>
      </div>
    )
  }

  return (
    <>
      {/* 🚀 將所有分類好的結構化資料陣列，安全地轉換為 JSON 注入 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchemas) }}
      />

      <Hero />
    </>
  )
}
