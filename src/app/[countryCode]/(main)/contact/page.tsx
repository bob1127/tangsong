import { Metadata } from "next"
import ContactForm from "./ContactForm"

import { SITE_URL, canonicalUrl } from "@lib/util/site-url"

// ==========================
// ISR：60 秒重新驗證
// ==========================
export const revalidate = 60

// ==========================
// 1. SEO Metadata
// ==========================
export const metadata: Metadata = {
  title:
    "聯絡我們 | 預約黃金鑑定、黃金回收諮詢、門市預約 | 唐宋珠寶 台北萬華",
  description:
    "歡迎聯絡台北萬華唐宋珠寶！提供黃金回收估價、K金收購諮詢、鉑金回收詢價、珠寶鑑定預約、客製化設計等服務。可透過線上表單、電話 02-2306-9928 或 LINE 官方帳號聯絡，專業顧問即時為您服務。",
  keywords: [
    "唐宋珠寶聯絡",
    "黃金回收預約",
    "黃金鑑定預約",
    "黃金回收諮詢",
    "K金收購諮詢",
    "鉑金回收詢價",
    "珠寶鑑定預約",
    "台北萬華銀樓電話",
    "唐宋珠寶電話",
    "唐宋珠寶門市",
    "唐宋珠寶LINE",
    "珠寶諮詢",
    "黃金買賣諮詢",
  ],
  openGraph: {
    title: "聯絡我們 | 預約黃金鑑定、回收諮詢 | 唐宋珠寶 台北萬華",
    description:
      "台北萬華唐宋珠寶，提供黃金回收估價、K金收購、鉑金回收、珠寶鑑定預約服務。電話 02-2306-9928，或填寫線上表單，專業顧問即時回覆。",
    url: `${SITE_URL}/contact`,
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/0002.jpg`,
        width: 1200,
        height: 630,
        alt: "聯絡唐宋珠寶 - 台北萬華黃金回收諮詢與門市預約",
      },
    ],
  },
  alternates: {
    canonical: canonicalUrl("/contact"),
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
      name: "聯絡我們",
      item: `${SITE_URL}/contact`,
    },
  ],
}

// B. ContactPage
const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact#page`,
  name: "聯絡唐宋珠寶 | 黃金回收諮詢與門市預約",
  description:
    "填寫線上諮詢表單或透過電話、LINE 聯絡唐宋珠寶專業顧問，提供黃金回收估價、K金收購、鉑金回收、珠寶鑑定預約等服務。",
  url: `${SITE_URL}/contact`,
  image: `${SITE_URL}/images/0002.jpg`,
  mainEntity: { "@id": `${SITE_URL}/#store` },
}

// C. LocalBusiness（完整商家聯絡資訊，強化在地搜尋）
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "@id": `${SITE_URL}/#store`,
  name: "唐宋珠寶",
  alternateName: "Tangsong Jewelry",
  description:
    "台北萬華龍山寺對面專業珠寶銀樓，提供高價黃金回收、黃金收購、K金回收、鉑金回收、鑽石鑑定及客製化珠寶服務。",
  url: SITE_URL,
  telephone: "02-2306-9928",
  email: "a0223069928@gmail.com",
  image: `${SITE_URL}/logo.png`,
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
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+886-2-2306-9928",
      contactType: "customer service",
      contactOption: "TollFree",
      availableLanguage: ["Chinese", "Taiwanese"],
      areaServed: "TW",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "11:00",
        closes: "21:00",
      },
    },
    {
      "@type": "ContactPoint",
      url: "https://line.me/R/ti/p/@nfr7726z",
      contactType: "customer service",
      availableLanguage: ["Chinese", "Taiwanese"],
      areaServed: "TW",
    },
  ],
  sameAs: [
    "https://line.me/R/ti/p/@nfr7726z",
  ],
}

const combinedSchemas = [breadcrumbSchema, contactPageSchema, localBusinessSchema]

// ==========================
// 3. Page Component
// ==========================
export default async function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchemas) }}
      />
      <ContactForm />
    </>
  )
}
