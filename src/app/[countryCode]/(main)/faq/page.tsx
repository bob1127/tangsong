import { Metadata } from "next"
import GoldFAQ from "../../../../components/GoldFAQ"
import { buildGoldFaqSchema } from "@lib/data/gold-faqs"
import { SITE_URL, canonicalUrl } from "@lib/util/site-url"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Q&A 常見問題 | 黃金回收、K金收購、鉑金回收 FAQ | 唐宋珠寶",
  description:
    "唐宋珠寶黃金回收常見問題：計價方式、K金回收、證件需求、今日金價、耗損計算、舊金飾回收、鑽石名錶收購等，一次解答您的疑問。",
  keywords: [
    "黃金回收常見問題",
    "黃金回收 FAQ",
    "K金回收問題",
    "黃金回收計價",
    "今日金價查詢",
    "舊金飾回收",
    "鑽石回收",
    "名錶回收",
    "唐宋珠寶 Q&A",
    "台北黃金回收",
  ],
  openGraph: {
    title: "Q&A 常見問題 | 黃金回收 FAQ | 唐宋珠寶",
    description:
      "黃金回收、K金收購、鉑金回收常見問題完整解答，透明報價、專業檢測，台北萬華唐宋珠寶。",
    url: `${SITE_URL}/faq`,
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/0001.jpg`,
        width: 1200,
        height: 630,
        alt: "唐宋珠寶黃金回收常見問題 Q&A",
      },
    ],
  },
  alternates: {
    canonical: canonicalUrl("/faq"),
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "首頁", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Q&A 常見問題",
      item: `${SITE_URL}/faq`,
    },
  ],
}

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/faq#page`,
  name: "Q&A 常見問題 | 唐宋珠寶",
  description:
    "唐宋珠寶黃金回收、K金收購、鉑金回收等常見問題與解答。",
  url: `${SITE_URL}/faq`,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  inLanguage: "zh-TW",
}

export default function FaqPage() {
  const faqSchema = buildGoldFaqSchema(`${SITE_URL}/faq`)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full bg-[#FDFBF7] border-b border-[#D4AF37]/20">
        <div className="max-w-3xl mx-auto px-4 py-14 md:py-16 text-center">
          <p className="text-xs tracking-[0.35em] text-[#b8973a] uppercase mb-4">
            Q&amp;A
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-light text-[#5A1216] tracking-wide">
            常見問題
          </h1>
          <p className="mt-4 text-stone-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            關於黃金回收、K金收購、鉑金回收與珠寶鑑定的常見疑問，為您一次整理解答。
          </p>
        </div>
      </div>

      <GoldFAQ showAllByDefault hideHeader />
    </>
  )
}
