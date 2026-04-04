import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "唐宋珠寶 | 國際貴金屬與門市即時行情",
  description: "提供最新國際黃金、白金、白銀即時報價與門市牌告價。",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  // 🚨 偵錯模式：如果找不到地區，顯示這段文字而不是白畫面
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

  // 如果成功找到地區，就正常顯示你的金價面板
  return (
    <>
      <Hero />
    </>
  )
}
