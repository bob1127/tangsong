import { Metadata } from "next"
import PurchaseProcessClient from "./PurchaseProcessClient"

const BASE_URL = "https://www.tangsong.com.tw"

// ==========================
// ISR：60 秒重新驗證
// ==========================
export const revalidate = 60

// ==========================
// 1. SEO Metadata
// ==========================
export const metadata: Metadata = {
  title:
    "黃金回收收購流程 | 五步驟透明估價、熔融檢測、當場現金 | 唐宋珠寶 台北萬華",
  description:
    "唐宋珠寶提供最透明的黃金回收收購流程：現場初步檢視→專業儀器鑑定→精確秤重報價→熔融成色檢測→當場現金交易。拒絕黑箱扣耗損，科學數據說話，台北萬華區高價黃金收購首選。",
  keywords: [
    "黃金回收流程",
    "黃金收購流程",
    "黃金回收怎麼估價",
    "熔融檢測",
    "黃金鑑定",
    "黃金秤重",
    "黃金回收透明",
    "高價黃金收購",
    "K金回收流程",
    "鉑金回收流程",
    "台北黃金回收",
    "萬華黃金回收",
    "唐宋珠寶",
    "黃金現金交易",
    "貴金屬回收流程",
  ],
  openGraph: {
    title:
      "黃金回收收購流程 | 五步驟透明估價、熔融檢測、當場現金 | 唐宋珠寶",
    description:
      "台北萬華唐宋珠寶，五步驟透明收購流程：初步檢視、儀器鑑定、秤重報價、熔融檢測、現金交易。拒絕扣耗損，科學數據，安心放心。",
    url: `${BASE_URL}/purchase-process`,
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://www.tangsong.com.tw/images/精準成色檢測.jpg",
        width: 1200,
        height: 630,
        alt: "唐宋珠寶黃金熔融檢測與透明收購流程",
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/tw/purchase-process`,
  },
}

// ==========================
// 2. 結構化資料
// ==========================

// A. 麵包屑導航
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "首頁",
      item: BASE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "黃金回收收購流程",
      item: `${BASE_URL}/purchase-process`,
    },
  ],
}

// B. HowTo：五步驟收購流程（最能觸發 Google 富摘要的 Schema）
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "唐宋珠寶黃金回收收購流程",
  description:
    "台北萬華唐宋珠寶透明黃金回收五步驟，從現場初步檢視到當場現金交易，全程公開透明，拒絕黑箱扣耗損。",
  image: "https://www.tangsong.com.tw/images/精準成色檢測.jpg",
  totalTime: "PT30M",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "TWD",
    value: "0",
  },
  supply: [
    {
      "@type": "HowToSupply",
      name: "待回收的黃金、K金、白金或鉑金飾品",
    },
    {
      "@type": "HowToSupply",
      name: "本人身份證件",
    },
  ],
  tool: [
    {
      "@type": "HowToTool",
      name: "精密光譜儀器（XRF 成色分析）",
    },
    {
      "@type": "HowToTool",
      name: "經濟部標準檢驗局合格電子磅秤",
    },
    {
      "@type": "HowToTool",
      name: "熔融檢測設備",
    },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "現場初步檢視",
      text: "進店後專人為您的商品進行分類與基本檢查，確認物件的完整度與大方向分類。",
      image: "https://www.tangsong.com.tw/images/現場初步檢視.jpg",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "專業儀器鑑定",
      text: "使用精密光譜或比重儀器檢測基本成色，不損傷珠寶原貌，為您提供最科學的初步估價。",
      image: "https://www.tangsong.com.tw/images/專業儀器鑑定.jpg",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "精確秤重與報價",
      text: "在您面前使用經濟部標準檢驗局合格電子磅秤精確秤重，並依當日公開行情詳細說明估價方式，價格公開透明。",
      image: "https://www.tangsong.com.tw/images/秤重確認價格.jpg",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "精準成色檢測（熔融檢測）",
      text: "針對成分複雜或老舊金飾進行熔融檢測，將雜質燒除提煉出最純粹的貴金屬，取得百分之百精準的純度數據。",
      image: "https://www.tangsong.com.tw/images/精準成色檢測.jpg",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "當場現金交易",
      text: "確認最終成色與金重後，核對身份簽署法定收購簿冊，當場以現金或即時轉帳完成交易。",
    },
  ],
}

// C. Service：黃金回收服務
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${BASE_URL}/purchase-process#service`,
  name: "高價黃金回收收購服務",
  alternateName: "黃金收購、K金回收、鉑金回收",
  description:
    "唐宋珠寶提供高價黃金回收、黃金收購、K金回收、鉑金回收等貴金屬回收服務，採用熔融檢測確保最精準成色，透明秤重，當場現金交易，是台北萬華區黃金回收的最佳選擇。",
  provider: {
    "@type": "JewelryStore",
    name: "唐宋珠寶",
    url: BASE_URL,
    telephone: "02-2306-9928",
    address: {
      "@type": "PostalAddress",
      streetAddress: "青山里西園路一段166-1號",
      addressLocality: "萬華區",
      addressRegion: "臺北市",
      postalCode: "108",
      addressCountry: "TW",
    },
  },
  serviceType: "黃金回收估價",
  areaServed: {
    "@type": "City",
    name: "台北市",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TWD",
    description: "免費現場鑑定估價，無任何手續費",
    availability: "https://schema.org/InStock",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "可回收貴金屬項目",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "9999純金回收" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "18K金回收" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "14K金回收" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "白K金回收" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "鉑金Pt950回收" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "黃金條塊回收" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "舊金飾回收" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "鑽石珠寶回收" } },
    ],
  },
}

const combinedSchemas = [breadcrumbSchema, howToSchema, serviceSchema]

// ==========================
// 3. Page Component (Server)
// ==========================
export default function PurchaseProcessPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchemas) }}
      />
      <PurchaseProcessClient />
    </>
  )
}
