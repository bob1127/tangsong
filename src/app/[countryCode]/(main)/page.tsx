import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { absolutePublicUrl, canonicalUrl } from "@lib/util/site-url"

// ISR：首頁每 60 秒重新生成一次，後台新增商品 60 秒內前端可見
export const revalidate = 60

// ==========================
// 1. 首頁 SEO 設定 (強化版 Metadata)
// ==========================
export const metadata: Metadata = {
  title:
    "唐宋珠寶 Tangsong | 台北萬華區高價黃金回收收購、今日金價、K金白金鉑金回收",
  description:
    "位於台北萬華龍山寺對面，專營高價黃金回收、黃金收購、K金回收、K金收購、白金回收、鉑金回收。提供即時今日金價、黃金回收價格查詢、舊金翻新、客製化珠寶及免費鑑定服務。台北萬華區黃金回收首選，誠信經營，安心放心。",
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
    "台北黃金收購",
    "台北萬華區黃金收購",
    "貴金屬回收",
    "黃金買賣",
    "珠寶鑑定",
    "唐宋珠寶",
    "萬華銀樓",
    "台北珠寶",
  ],
  openGraph: {
    title:
      "唐宋珠寶 Tangsong | 台北萬華高價黃金回收、今日金價、K金白金鉑金收購",
    description:
      "台北萬華龍山寺對面，專營高價黃金回收、黃金收購、K金回收、白金回收、鉑金回收。提供即時今日金價與黃金回收價格，免費專業鑑定，誠信買賣。",
    url: "https://www.tangsong.com.tw",
    siteName: "唐宋珠寶",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://www.tangsong.com.tw/images/0002.jpg",
        width: 1200,
        height: 630,
        alt: "唐宋珠寶 - 台北萬華高價黃金回收收購與珠寶鑑賞",
      },
    ],
  },
  alternates: {
    canonical: canonicalUrl("/"),
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
  description:
    "台北萬華區龍山寺對面專業珠寶銀樓，提供高價黃金回收、黃金收購、K金回收、K金收購、白金回收、鉑金回收，以及今日金價與黃金回收價格查詢，是台北黃金回收、台北萬華區黃金收購的首選。",
  image: "https://www.tangsong.com.tw/logo.png",
  "@id": "https://www.tangsong.com.tw/#store",
  url: "https://www.tangsong.com.tw",
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

// C. 常見問答 (FAQPage) - 與頁面 GoldFAQ 元件完整對齊，共 20 題
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "黃金回收怎麼計價？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "黃金回收價格主要依照「當日國際金價」、「黃金純度」以及「重量」計算。不同純度的黃金，例如9999純金、22K、18K，回收價格也會不同，實際價格會依當日行情透明報價。",
      },
    },
    {
      "@type": "Question",
      name: "K金可以回收嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以。18K金、14K金、白K金、玫瑰金等皆可回收，回收時會依照含金量與重量進行專業檢測與估價。",
      },
    },
    {
      "@type": "Question",
      name: "黃金回收需要證件嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "需要。依照政府法規，黃金回收需出示身分證件，以保障交易安全與合法性。",
      },
    },
    {
      "@type": "Question",
      name: "今日金價如何查詢？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可透過國際黃金行情、市場牌價或銀樓公告查詢今日金價。實際回收價格仍會依照黃金純度與重量計算。",
      },
    },
    {
      "@type": "Question",
      name: "黃金回收會扣耗損嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "部分黃金回收會依商品狀況、純度與加工方式評估是否有耗損，但專業銀樓通常會透明說明計價方式與秤重過程。",
      },
    },
    {
      "@type": "Question",
      name: "舊金飾可以回收嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以。舊金飾、斷裂項鍊、單耳耳環、變形戒指等皆可回收，不影響黃金本身價值。",
      },
    },
    {
      "@type": "Question",
      name: "黃金回收是看品牌嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般黃金回收主要依照黃金重量與純度計算，品牌並非主要影響因素，但部分精品品牌珠寶可能另有收藏價值。",
      },
    },
    {
      "@type": "Question",
      name: "白金與鉑金有差別嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "有。台灣常見「白金」多為白K金，而「鉑金」則是 Platinum，材質與價值不同，回收價格也不同。",
      },
    },
    {
      "@type": "Question",
      name: "鑽石可以回收嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以。鑽石回收價格會依照大小、顏色、淨度、車工等條件評估，若有GIA證書通常更有利估價。",
      },
    },
    {
      "@type": "Question",
      name: "黃金回收價格每天都一樣嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "不一定。黃金價格會隨國際金價波動，因此每日回收價格皆可能不同。",
      },
    },
    {
      "@type": "Question",
      name: "黃金一錢等於幾克？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "台灣黃金計算常用「錢」為單位，1錢約等於3.75公克。",
      },
    },
    {
      "@type": "Question",
      name: "K金與純金有什麼不同？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "純金含金量較高，質地較軟；K金則加入其他金屬提升硬度，因此常用於珠寶設計與日常配戴。",
      },
    },
    {
      "@type": "Question",
      name: "沒有保單的黃金可以回收嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以。即使沒有購買保單或保證書，多數黃金仍可透過專業儀器檢測後進行回收估價。",
      },
    },
    {
      "@type": "Question",
      name: "黃金回收多久可以拿到現金？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般現場完成檢測與確認價格後，即可快速完成交易並取得現金。",
      },
    },
    {
      "@type": "Question",
      name: "黃金回收需要預約嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "通常不需要。大部分銀樓皆可現場估價，但若回收數量較多，建議提前聯繫安排。",
      },
    },
    {
      "@type": "Question",
      name: "名錶也可以回收嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以。勞力士、OMEGA、Cartier 等精品名錶皆有回收市場，實際價格會依品牌、型號與狀況評估。",
      },
    },
    {
      "@type": "Question",
      name: "黃金回收會不會被偷斤減兩？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "建議選擇具有透明秤重、公開金價與專業檢測設備的合法銀樓，能有效保障交易安心與公平。",
      },
    },
    {
      "@type": "Question",
      name: "K金回收價格怎麼算？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "K金回收會依照K數含金量計算，例如18K約含75%黃金，因此回收價格通常低於純金。",
      },
    },
    {
      "@type": "Question",
      name: "黃金變黑還能回收嗎？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "可以。黃金氧化、變色或外觀老舊通常不影響黃金本身價值，仍可正常回收。",
      },
    },
    {
      "@type": "Question",
      name: "哪些東西可以做黃金回收？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "常見可回收項目包括：金戒指、金項鍊、金手鐲、K金飾品、白金飾品、黃金條塊、金幣、舊金飾、壞掉珠寶，以及部分精品名錶與鑽石珠寶，皆可由專業銀樓進行估價與回收。",
      },
    },
  ],
}

// D. productListSchema 改為在 Home() 內動態生成，見下方函式

function buildProductListSchema(
  products: HttpTypes.StoreProduct[],
  countryCode: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "唐宋珠寶精選商品",
    url: absolutePublicUrl("/store", countryCode),
    itemListElement: products.map((product, index) => {
      const cheapestVariant = (product.variants as any[])
        ?.filter((v) => !!v.calculated_price?.calculated_amount)
        .sort(
          (a, b) =>
            a.calculated_price.calculated_amount -
            b.calculated_price.calculated_amount
        )[0]

      const price = cheapestVariant?.calculated_price?.calculated_amount
      const currency =
        cheapestVariant?.calculated_price?.currency_code?.toUpperCase() ??
        "TWD"

      const item: Record<string, unknown> = {
        "@type": "Product",
        name: product.title,
        url: absolutePublicUrl(`/products/${product.handle}`, countryCode),
        ...(product.description && { description: product.description }),
        ...(product.thumbnail && { image: product.thumbnail }),
      }

      if (price != null) {
        item.offers = {
          "@type": "Offer",
          priceCurrency: currency,
          price: price,
          availability: "https://schema.org/InStock",
          url: absolutePublicUrl(`/products/${product.handle}`, countryCode),
        }
      }

      return {
        "@type": "ListItem",
        position: index + 1,
        item,
      }
    }),
  }
}

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

  // 動態抓取前 24 項商品（含價格），用於生成 Product 結構化資料
  const {
    response: { products },
  } = await listProducts({
    pageParam: 1,
    queryParams: {
      limit: 24,
      fields:
        "*variants.calculated_price,+variants.inventory_quantity,*variants.images",
    },
    regionId: region.id,
  })

  const productListSchema = buildProductListSchema(products, countryCode)

  const combinedSchemas = [
    storeSchema,
    websiteSchema,
    faqSchema,
    productListSchema,
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchemas) }}
      />
      <Hero />
    </>
  )
}
