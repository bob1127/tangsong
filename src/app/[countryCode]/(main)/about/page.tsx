import { Metadata } from "next"
import HeroSlider from "../../../../components/Slider"
import Feature from "../../../../components/CollectionShowcase"

const BASE_URL = "https://www.tangsong.com.tw"
const OG_IMAGE = `${BASE_URL}/images/18e59f52-18b7-413b-a783-ff21e3c51ad3.png`

// ==========================
// ISR：60 秒重新驗證
// ==========================
export const revalidate = 60

// ==========================
// 1. SEO Metadata
// ==========================
export const metadata: Metadata = {
  title:
    "關於唐宋珠寶 | 台北萬華在地銀樓、專業黃金鑑定與高價收購 | Tangsong Jewelry",
  description:
    "唐宋珠寶深耕台北萬華龍山寺商圈十餘年，引進專業級非破壞式 XRF 光譜儀與熔融檢測設備。提供黃金回收、K金收購、鉑金回收、鑽石鑑定等服務，全程公開透明，誠信買賣，是台北萬華區高價黃金收購的首選銀樓。",
  keywords: [
    "唐宋珠寶",
    "唐宋珠寶介紹",
    "台北萬華銀樓",
    "萬華珠寶店",
    "龍山寺珠寶",
    "黃金鑑定",
    "黃金收購",
    "高價黃金回收",
    "K金回收",
    "鉑金回收",
    "鑽石鑑定",
    "貴金屬鑑定",
    "XRF光譜儀鑑定",
    "熔融檢測",
    "台北黃金回收",
    "台北萬華黃金",
    "Tangsong Jewelry",
  ],
  openGraph: {
    title:
      "關於唐宋珠寶 | 台北萬華在地銀樓、專業黃金鑑定與高價收購",
    description:
      "深耕台北萬華龍山寺商圈十餘年，引進 XRF 光譜儀與熔融檢測，提供黃金回收、K金收購、鉑金回收。公開透明、誠信買賣，台北萬華黃金收購首選。",
    url: `${BASE_URL}/about`,
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "唐宋珠寶 - 台北萬華專業黃金收購與鑑定",
      },
    ],
  },
  alternates: {
    canonical: `${BASE_URL}/tw/about`,
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
    { "@type": "ListItem", position: 1, name: "首頁", item: BASE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "關於唐宋珠寶",
      item: `${BASE_URL}/about`,
    },
  ],
}

// B. AboutPage
const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${BASE_URL}/about#page`,
  name: "關於唐宋珠寶 | 台北萬華在地銀樓",
  description:
    "唐宋珠寶深耕台北萬華龍山寺商圈十餘年，提供黃金回收、K金收購、鉑金回收、鑽石鑑定等服務，引進 XRF 光譜儀與熔融檢測設備，全程公開透明。",
  url: `${BASE_URL}/about`,
  image: OG_IMAGE,
  mainEntity: { "@id": `${BASE_URL}/#store` },
}

// C. JewelryStore（完整商家資訊）
const storeSchema = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "@id": `${BASE_URL}/#store`,
  name: "唐宋珠寶",
  alternateName: "Tangsong Jewelry",
  description:
    "台北萬華龍山寺對面專業珠寶銀樓，深耕在地十餘年，提供高價黃金回收、黃金收購、K金回收、K金收購、白金回收、鉑金回收。引進 XRF 光譜儀非破壞式鑑定及熔融檢測，全程透明，誠信買賣。",
  image: OG_IMAGE,
  logo: `${BASE_URL}/logo.png`,
  url: BASE_URL,
  telephone: "02-2306-9928",
  email: "a0223069928@gmail.com",
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "青山里西園路一段166-1號",
    addressLocality: "萬華區",
    addressRegion: "臺北市",
    postalCode: "108",
    addressCountry: "TW",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.0358,
    longitude: 121.4988,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "11:00",
      closes: "21:00",
    },
  ],
  sameAs: [
    "https://line.me/R/ti/p/@nfr7726z",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "唐宋珠寶服務項目",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "高價黃金回收" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "K金收購" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "鉑金回收" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "鑽石鑑定與回收" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "客製化珠寶訂製" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "舊金翻新修改" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "免費貴金屬鑑定估價" } },
    ],
  },
}

// D. HowTo（黃金收購五步驟，與 purchase-process 頁呼應）
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "唐宋珠寶黃金收購流程",
  description:
    "唐宋珠寶公開透明的黃金、K金、鉑金收購流程，全程在您視線內進行，拒絕黑箱扣耗損。",
  image: OG_IMAGE,
  totalTime: "PT30M",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "TWD",
    value: "0",
  },
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "現場初步檢視",
      text: "進店後專人為您的商品進行分類與基本檢查，確認物件完整度與大方向分類。",
      url: `${BASE_URL}/about#step1`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "專業儀器鑑定",
      text: "使用精密 XRF 光譜或比重儀器檢測基本成色，不損傷珠寶原貌，提供最科學的初步估價。",
      url: `${BASE_URL}/about#step2`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "秤重確認價格",
      text: "在您面前以經濟部標準檢驗局合格電子磅秤精確秤重，並依當日公開行情詳細說明估價，您滿意後再進行下一步。",
      url: `${BASE_URL}/about#step3`,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "精準成色檢測（熔融檢測）",
      text: "針對成分複雜或老舊金飾進行熔融檢測，將雜質燒除提煉純金，取得百分之百精準的純度數據，拒絕憑感覺扣耗損。",
      url: `${BASE_URL}/about#step4`,
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "完成現金交易",
      text: "確認最終成色與金重後，核對身份簽署法定收購簿冊，當場以現金或即時轉帳完成交易。",
      url: `${BASE_URL}/about#step5`,
    },
  ],
}

const combinedSchemas = [breadcrumbSchema, aboutPageSchema, storeSchema, howToSchema]

// ==========================
// 3. Page Component
// ==========================
export default function AboutPage() {
  return (
    <div className="w-full bg-[#FDF5E6]/30 font-sans overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchemas) }}
      />
      <HeroSlider />
      <Feature />
    </div>
  )
}
