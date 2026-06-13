import { SITE_URL } from "@lib/util/site-url"
import {
  buildStorePriceOffers,
  deriveMetalDisplayPrices,
  getPriceValidUntil,
} from "@lib/metals/derive-prices"
import type { MetalsData } from "@lib/metals/types"
import { PRIMARY_SITE_LINKS, siteNavAbsoluteUrl } from "./site-navigation"

const SCHEMA_CONTEXT = "https://schema.org"
const ORG_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`
const STORE_ID = `${SITE_URL}/#store`
const WEBPAGE_ID = `${SITE_URL}/#webpage`
const METAL_OFFER_CATALOG_ID = `${SITE_URL}/#metal-offer-catalog`

const organizationSchema = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "唐宋珠寶",
  alternateName: ["Tangsong Jewelry", "唐宋珠寶銀樓"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo/logo.png`,
  },
  image: `${SITE_URL}/images/0002.jpg`,
  description:
    "台北萬華龍山寺對面專業珠寶銀樓，提供高價黃金回收、黃金收購、K金回收、白金回收、鉑金回收與今日金價查詢。",
  telephone: "+886-2-23069928",
  email: "a0223069928@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "西園路一段166-1號",
    addressLocality: "萬華區",
    addressRegion: "臺北市",
    postalCode: "108",
    addressCountry: "TW",
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=100057131423286",
    "https://lin.ee/QiLRhma",
  ],
}

const websiteSchema = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: "唐宋珠寶 Tangsong",
  alternateName: "Tangsong Jewelry",
  description:
    "唐宋珠寶官方網站：台北萬華高價黃金回收、今日金價、K金白金鉑金收購、珠寶鑑定與專欄文章。",
  inLanguage: "zh-TW",
  publisher: { "@id": ORG_ID },
}

const storeSchema = {
  "@type": "JewelryStore",
  "@id": STORE_ID,
  name: "唐宋珠寶",
  alternateName: "Tangsong Jewelry",
  description:
    "台北萬華區龍山寺對面專業珠寶銀樓，提供高價黃金回收、黃金收購、K金回收、白金回收、鉑金回收，以及今日金價與黃金回收價格查詢。",
  image: `${SITE_URL}/images/0002.jpg`,
  url: SITE_URL,
  telephone: "02-2306-9928",
  email: "a0223069928@gmail.com",
  priceRange: "$$$",
  parentOrganization: { "@id": ORG_ID },
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
}

const homeWebPageSchema = {
  "@type": "WebPage",
  "@id": WEBPAGE_ID,
  url: SITE_URL,
  name: "唐宋珠寶 | 台北萬華高價黃金回收、今日金價",
  description:
    "唐宋珠寶官方首頁：即時金價、黃金回收收購、K金白金鉑金回收、珠寶鑑定與專欄知識。",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": STORE_ID },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/0002.jpg`,
  },
  inLanguage: "zh-TW",
  significantLink: PRIMARY_SITE_LINKS.map((link) => siteNavAbsoluteUrl(link.path)),
}

function buildSiteNavigationSchemas() {
  return PRIMARY_SITE_LINKS.map((link) => ({
    "@type": "SiteNavigationElement",
    "@id": `${siteNavAbsoluteUrl(link.path)}#navigation`,
    name: link.name,
    description: link.description,
    url: siteNavAbsoluteUrl(link.path),
    isPartOf: { "@id": WEBSITE_ID },
  }))
}

export const homeFaqSchema = {
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
        text: "通常不需要。可現場估價，但若回收數量較多，建議提前聯繫安排。",
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
        text: "常見可回收項目包括：金戒指、金項鍊、金手鐲、K金飾品、白金飾品、黃金條塊、金幣、舊金飾、壞掉珠寶，以及部分精品名錶與鑽石珠寶，皆可由專業銀樓進行估價與回收。詳情請看收購項目。",
      },
    },
  ],
}

function buildMetalOfferCatalogSchema(metals: MetalsData) {
  const prices = deriveMetalDisplayPrices(metals)
  if (!prices) return null

  const offers = buildStorePriceOffers(prices)
  if (offers.length === 0) return null

  const priceValidUntil = getPriceValidUntil(prices.updateTime)
  const updatedLabel = new Date(prices.updateTime).toLocaleString("zh-TW")

  return {
    "@type": "OfferCatalog",
    "@id": METAL_OFFER_CATALOG_ID,
    name: "唐宋珠寶今日金價與回收價格",
    description: `唐宋珠寶實體門市牌告價，資料更新時間：${updatedLabel}。價格單位為新台幣/台錢，實際交易依現場報價為準。`,
    url: SITE_URL,
    itemListElement: offers.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Offer",
        name: item.name,
        itemOffered: {
          "@type": "Service",
          name: item.name,
          provider: { "@id": STORE_ID },
          areaServed: {
            "@type": "City",
            name: "台北市",
          },
        },
        price: String(item.price),
        priceCurrency: "TWD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(item.price),
          priceCurrency: "TWD",
          unitText: item.unitText,
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: 1,
            unitText: item.unitText,
          },
        },
        priceValidUntil,
        availability: "https://schema.org/InStock",
        url: SITE_URL,
        seller: { "@id": STORE_ID },
      },
    })),
  }
}

function buildStoreSchemaWithMetals(metals: MetalsData | null | undefined) {
  const metalCatalog = metals ? buildMetalOfferCatalogSchema(metals) : null
  if (!metalCatalog) return storeSchema

  return {
    ...storeSchema,
    hasOfferCatalog: { "@id": METAL_OFFER_CATALOG_ID },
  }
}

function buildHomeWebPageSchema(metals: MetalsData | null | undefined) {
  const updateTime =
    metals?.fetch_timestamp ?? metals?.updated_at ?? undefined

  return {
    ...homeWebPageSchema,
    ...(updateTime && { dateModified: updateTime }),
  }
}

export function buildHomeCoreSchemaGraph(metals?: MetalsData | null) {
  const metalCatalog = metals ? buildMetalOfferCatalogSchema(metals) : null

  const graph: Record<string, unknown>[] = [
    organizationSchema,
    websiteSchema,
    buildStoreSchemaWithMetals(metals),
    buildHomeWebPageSchema(metals),
    ...buildSiteNavigationSchemas(),
    homeFaqSchema,
  ]

  if (metalCatalog) {
    graph.push(metalCatalog)
  }

  return {
    "@context": SCHEMA_CONTEXT,
    "@graph": graph,
  }
}
