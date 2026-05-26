import { Metadata } from "next"
import { SITE_URL, canonicalUrl } from "@lib/util/site-url"

const HOME_TITLE =
  "唐宋珠寶 Tangsong | 台北萬華高價黃金回收、今日金價、K金白金鉑金收購"
const HOME_DESCRIPTION =
  "位於台北萬華龍山寺對面，專營高價黃金回收、黃金收購、K金回收、白金回收、鉑金回收。提供即時今日金價、黃金回收價格查詢、舊金翻新、客製化珠寶及免費鑑定。台北萬華區黃金回收首選。"

const OG_IMAGE = `${SITE_URL}/images/0002.jpg`

export function buildHomeMetadata(): Metadata {
  return {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    applicationName: "唐宋珠寶",
    authors: [{ name: "唐宋珠寶", url: SITE_URL }],
    creator: "唐宋珠寶",
    publisher: "唐宋珠寶",
    keywords: [
      "黃金回收",
      "高價黃金回收",
      "黃金收購",
      "黃金回收價格",
      "今日金價",
      "K金回收",
      "K金收購",
      "白金回收",
      "鉑金回收",
      "台北黃金回收",
      "台北萬華區黃金回收",
      "貴金屬回收",
      "珠寶鑑定",
      "唐宋珠寶",
      "萬華銀樓",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl("/"),
      languages: {
        "zh-TW": canonicalUrl("/"),
      },
    },
    openGraph: {
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      url: SITE_URL,
      siteName: "唐宋珠寶",
      locale: "zh_TW",
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "唐宋珠寶 - 台北萬華高價黃金回收收購與珠寶鑑賞",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      images: [OG_IMAGE],
    },
    other: {
      "geo.region": "TW-TPE",
      "geo.placename": "台北市萬華區",
    },
  }
}
