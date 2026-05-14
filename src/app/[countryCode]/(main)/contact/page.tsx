// 檔案路徑：src/app/[countryCode]/(main)/contact/page.tsx
import { Metadata } from "next"
// 💡 從旁邊剛建立的檔案引入表單元件
import ContactForm from "./ContactForm"

// ==========================
// 1. 聯絡我們頁面 SEO 設定
// ==========================
export const metadata: Metadata = {
  title: "聯絡我們 | 線上諮詢與門市預約 | 唐宋珠寶 Tangsong",
  description:
    "唐宋珠寶提供黃金買賣、珠寶鑑定、客製化設計等服務。歡迎透過線上表單預約諮詢，或直接撥打門市專線 02-2306-9928，由專業顧問為您服務。",
  openGraph: {
    title: "聯絡我們 | 線上諮詢與門市預約 | 唐宋珠寶 Tangsong",
    description:
      "唐宋珠寶提供黃金買賣、珠寶鑑定、客製化設計等服務。歡迎透過線上表單預約諮詢，由專業顧問為您服務。",
    url: "https://www.tangsong.com.tw/contact",
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "聯絡唐宋珠寶",
      },
    ],
  },
}

// ==========================
// 2. 結構化資料 (ContactPage 專用)
// ==========================
const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "聯絡唐宋珠寶",
  description: "填寫線上諮詢表單或透過電話聯絡我們的專業顧問。",
  url: "https://www.tangsong.com.tw/contact",
  mainEntity: {
    "@type": "Organization",
    name: "唐宋珠寶",
    url: "https://www.tangsong.com.tw",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+886-2-2306-9928",
      contactType: "customer service",
      availableLanguage: ["Chinese", "Taiwanese"],
      areaServed: "TW",
    },
  },
}

export default async function Contact() {
  return (
    <>
      {/* 🚀 注入 JSON-LD 結構化資料 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      {/* 載入剛剛建立的表單元件 */}
      <ContactForm />
    </>
  )
}
