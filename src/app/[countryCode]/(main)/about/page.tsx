import { Metadata } from "next"
import HeroSlider from "../../../../components/Slider"
import Feature from "../../../../components/CollectionShowcase"

// ==========================
// 1. 頁面 SEO 設定 (強化版 Metadata)
// ==========================
export const metadata: Metadata = {
  title: "高價黃金收購流程與專業鑑定 | 關於唐宋珠寶",
  description:
    "唐宋珠寶深耕台北萬華十餘年，引進專業級非破壞式檢測設備。提供透明、安心的黃金收購、K金回收與免費估價服務。全程五大步驟，價格公開有保障。",
  openGraph: {
    title: "高價黃金收購流程與專業鑑定 | 關於唐宋珠寶",
    description:
      "唐宋珠寶深耕在地十餘年，引進專業級非破壞式檢測設備，提供黃金收購、公開透明的交易流程。",
    url: "https://www.tangsong.com.tw/about", // 視你的實際路徑調整
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://www.tangsong.com.tw/images/18e59f52-18b7-413b-a783-ff21e3c51ad3.png", // 你的指定圖片
        width: 1200,
        height: 630,
        alt: "唐宋珠寶 - 專業黃金收購與鑑定流程",
      },
    ],
  },
}

// ==========================
// 2. 結構化資料 (商家資訊 + 收購流程 HowTo)
// ==========================
const storeSchema = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: "唐宋珠寶",
  image:
    "https://www.tangsong.com.tw/images/18e59f52-18b7-413b-a783-ff21e3c51ad3.png",
  "@id": "https://www.tangsong.com.tw/#store",
  url: "https://www.tangsong.com.tw",
  telephone: "02-2306-9928",
  address: {
    "@type": "PostalAddress",
    streetAddress: "西園路一段166-1號",
    addressLocality: "萬華區",
    addressRegion: "台北市",
    postalCode: "108",
    addressCountry: "TW",
  },
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "唐宋珠寶黃金收購流程",
  description: "公開透明的黃金、K金收購與鑑定流程，保障您的權益。",
  image:
    "https://www.tangsong.com.tw/images/18e59f52-18b7-413b-a783-ff21e3c51ad3.png",
  totalTime: "PT30M", // 預估處理時間 30 分鐘
  step: [
    {
      "@type": "HowToStep",
      name: "現場初步檢視",
      text: "進店後先為您的商品進行分類與基本檢查。",
      url: "https://www.tangsong.com.tw/about#step1",
    },
    {
      "@type": "HowToStep",
      name: "專業儀器鑑定",
      text: "使用精密儀器檢測成色，為您提供初步估價。",
      url: "https://www.tangsong.com.tw/about#step2",
    },
    {
      "@type": "HowToStep",
      name: "秤重確認價格",
      text: "詳細說明估價方式，您覺得合理再進行下一步。",
      url: "https://www.tangsong.com.tw/about#step3",
    },
    {
      "@type": "HowToStep",
      name: "精準成色檢測",
      text: "若需進一步確認，會進行熔融檢測，取得更準確成色 (必要時)。",
      url: "https://www.tangsong.com.tw/about#step4",
    },
    {
      "@type": "HowToStep",
      name: "完成交易",
      text: "確認最終成色與價格後，當場以現金或匯款完成交易。",
      url: "https://www.tangsong.com.tw/about#step5",
    },
  ],
}

const combinedSchemas = [storeSchema, howToSchema]

// 💡 收購流程的資料陣列 (用於畫面渲染)
const PROCESS_STEPS = [
  {
    step: "01",
    title: "現場初步檢視",
    description: "進店後先為您的商品進行分類與基本檢查。",
    image:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop",
  },
  {
    step: "02",
    title: "專業儀器鑑定",
    description: "使用精密儀器檢測成色，為您提供初步估價。",
    image: "/images/Photoroom_20260422_115847.jpg.webp",
  },
  {
    step: "03",
    title: "秤重確認價格",
    description: "詳細說明估價方式，您覺得合理再進行下一步。",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop",
  },
  {
    step: "04",
    title: "精準成色檢測",
    description: "若需進一步確認，會進行熔融檢測，取得更準確成色 (必要時)。",
    image: "https://www.kaitori-hachiya.com/upload/1753924997-268719_2.jpg",
  },
  {
    step: "05",
    title: "完成交易",
    description: "確認最終成色與價格後，當場以現金或匯款完成交易。",
    image:
      "https://images.pexels.com/photos/33175648/pexels-photo-33175648.jpeg",
  },
]

export default function ContactPage() {
  return (
    <div className="w-full bg-[#FDF5E6]/30 font-sans overflow-hidden">
      {/* 🚀 注入結構化資料 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchemas) }}
      />

      {/* 頂部輪播 */}
      <HeroSlider />
      <Feature />
    </div>
  )
}
