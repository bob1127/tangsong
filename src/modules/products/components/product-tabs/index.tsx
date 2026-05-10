"use client"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  // 🌟 加上這段除錯神器！它會把後端真正傳過來的資料印在你的終端機上
  console.log("🔍 【抓錯專用 - 目前商品資料】:", {
    名稱: product.title,
    描述: product.description,
    重量: product.weight,
    長度: product.length,
    規格數量: product.variants?.length,
    第一組規格重量: product.variants?.[0]?.weight,
  })

  const tabs = [
    {
      label: "商品介紹",
      component: <ProductDescriptionTab product={product} />,
    },
    {
      label: "商品規格",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "預約鑑賞與購買",
      component: <PurchaseInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple" defaultValue={["商品介紹"]}>
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

// ==========================================
// 1. 商品介紹 Tab
// ==========================================
const ProductDescriptionTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-6">
      <p className="whitespace-pre-wrap text-stone-600 leading-relaxed">
        {product.description ? product.description : "暫無商品描述"}
      </p>
    </div>
  )
}

// ==========================================
// 2. 商品規格 Tab (加入 Variant 雙重抓取機制)
// ==========================================
const ProductInfoTab = ({ product }: ProductTabsProps) => {
  // 💡 雙重抓取：如果主商品沒填，就去抓它的第一個規格 (Variant) 的資料
  const firstVariant = product.variants?.[0]
  const weight = product.weight || firstVariant?.weight
  const length = product.length || firstVariant?.length
  const width = product.width || firstVariant?.width
  const height = product.height || firstVariant?.height
  const material = product.material || firstVariant?.material
  const originCountry = product.origin_country || firstVariant?.origin_country

  return (
    <div className="text-small-regular py-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-bold text-stone-900">材質</span>
            <p className="text-stone-600 mt-1">{material ? material : "-"}</p>
          </div>
          <div>
            <span className="font-bold text-stone-900">產地</span>
            <p className="text-stone-600 mt-1">
              {originCountry ? originCountry : "-"}
            </p>
          </div>
          <div>
            <span className="font-bold text-stone-900">商品類型</span>
            <p className="text-stone-600 mt-1">
              {product.type ? product.type.value : "-"}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-bold text-stone-900">重量</span>
            <p className="text-stone-600 mt-1">
              {weight ? `${weight} g` : "-"}
            </p>
          </div>
          <div>
            <span className="font-bold text-stone-900">
              尺寸 (長 x 寬 x 高)
            </span>
            <p className="text-stone-600 mt-1">
              {length && width && height
                ? `${length} x ${width} x ${height}`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// 3. 預約鑑賞 Tab (無寄送服務 + LINE 預約)
// ==========================================
const PurchaseInfoTab = () => {
  return (
    <div className="text-small-regular py-6">
      <div className="flex flex-col gap-y-6">
        <div>
          <span className="font-bold text-stone-900 block mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5A1216]"></span>
            門市專屬服務
          </span>
          <p className="text-stone-600 leading-relaxed">
            為保障您的權益並提供最尊榮的服務，本店金飾與珠寶目前{" "}
            <strong className="text-[#5A1216]">不提供網路直接寄送服務</strong>
            。所有商品皆採「預約制」來店鑑賞與購買。
          </p>
        </div>

        <div className="p-5 bg-stone-50 rounded-lg border border-stone-200">
          <span className="font-bold text-stone-900 block mb-2">
            如何購買與看貨？
          </span>
          <p className="text-stone-600 leading-relaxed mb-5">
            請點擊下方按鈕加入唐宋珠寶 LINE
            官方帳號，告訴我們您感興趣的商品，將有專屬顧問為您安排看貨時間。
          </p>

          {/* 📱 LINE 預約按鈕 (連結先空著 #) */}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-lg shadow-sm hover:shadow transition-all w-full md:w-auto"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.996 8.892 9.479 9.619.37.079.873.242.998.555.114.286.074.733.036 1.037l-.146.883c-.046.282-.224 1.096.958.599 1.182-.497 6.38-3.766 8.653-6.398 2.607-3.003 4.022-6.002 4.022-6.295zm-14.444 3.32h-2.909c-.27 0-.489-.22-.489-.489v-4.992c0-.27.22-.489.489-.489.27 0 .489.22.489.489v4.503h2.42c.27 0 .489.22.489.489 0 .27-.22.489-.489.489zm2.49 0h-.977c-.27 0-.489-.22-.489-.489v-4.992c0-.27.22-.489.489-.489h.977c.27 0 .489.22.489.489v4.992c0 .27-.22.489-.489.489zm4.24-3.181l-1.849 2.946c-.056.09-.153.141-.252.141-.013 0-.026 0-.04-.002-.111-.018-.2-.089-.24-.19l-.004-.01v-2.885c0-.27-.22-.489-.489-.489-.27 0-.489.22-.489.489v4.992c0 .12.043.235.118.322.073.084.179.138.293.149.014.001.028.002.042.002.099 0 .195-.043.255-.125l2.063-3.23v3.018c0 .27.22.489.489.489.27 0 .489-.22.489-.489v-4.992c0-.123-.046-.239-.124-.326-.078-.086-.188-.139-.304-.149-.015-.001-.03-.002-.045-.002-.093 0-.184.037-.245.105z" />
            </svg>
            使用 LINE 預約鑑賞
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
