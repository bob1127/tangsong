import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"
// 💡 引入我們剛剛做好的彈窗元件 (請依你的實際路徑調整)
import TradeNoticePopup from "../../../components/TradeNoticePopup"

// ==========================
// 1. 首頁 SEO 設定 (強化版 Metadata)
// ==========================
export const metadata: Metadata = {
  // ... 保留你原本寫好的 metadata ...
}

// ==========================
// 2. 首頁結構化資料 (寫死為純字串，避免 React 崩潰)
// ==========================
const schemaJson = `
// ... 保留你原本寫好的 schemaJson ...
`

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />

      {/* 主視覺元件 */}
      <Hero />

      {/* 🚀 加入交易須知彈窗：會固定在畫面左下角，且關閉後不再出現 */}
      <TradeNoticePopup />
    </>
  )
}
