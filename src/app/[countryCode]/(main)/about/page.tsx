import { Metadata } from "next"
import HeroSlider from "../../../../components/Slider"
import HeroCarousel from "../../../../components/HeroSlider"
import Feature from "../../../../components/CollectionShowcase"
export const metadata: Metadata = {
  title: "關於唐宋珠寶 | 台北龍山寺對面老字號",
  description:
    "唐宋珠寶深耕在地十餘年，引進專業級非破壞式檢測設備，提供黃金收購、公開透明的交易流程。",
}

// 💡 收購流程的資料陣列
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
    image: "https://www.kaitori-hachiya.com/upload/1753924997-268719_2.jpg", // 火焰/熔融意象
  },
  {
    step: "05",
    title: "完成交易",
    description: "確認最終成色與價格後，當場以現金或匯款完成交易。",
    image:
      "https://images.pexels.com/photos/33175648/pexels-photo-33175648.jpeg", // 握手/交易意象
  },
]

export default function ContactPage() {
  return (
    <div className="w-full bg-[#FDF5E6]/30 font-sans overflow-hidden">
      {/* 頂部輪播 */}
      <HeroSlider />
      <Feature />

      {/* 💡 新增區塊：收購流程 (完美復刻參考圖的卡片排列) */}
      <section className="py-20 md:py-24 px-6 md:px-12 max-w-[1400px] mx-auto border-b border-[#D4AF37]/10">
        {/* 💡 新增：為什麼需要熔融檢測 (信任感保證區塊) */}
        <div className="mt-16 bg-gradient-to-br from-[#5A1216] to-[#3A0A0E]   p-8 md:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          {/* 背景裝飾 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#FDF5E6] tracking-wide">
                為什麼需要「熔融檢測」？
              </h3>
              <p className="text-[#D4AF37] font-bold tracking-widest text-sm">
                為了讓價格更透明、公平、精準
              </p>
              <div className="space-y-4 text-[#E8DCC4] text-sm md:text-base leading-relaxed">
                <p>
                  部分 K
                  金飾品表面可能有鍍金或雜質，僅靠外部檢測，成色可能會有誤差。透過熔融後再檢測，可以確認實際含金量。
                </p>
                <p>
                  <strong className="text-white">幾 K 就是幾 K 計價</strong>
                  ，讓您清楚明白，同時也避免因表面處理造成誤判，確保對您與店家雙方都公平安心。
                </p>
              </div>

              {/* 安心保障 List */}
              <div className="pt-4 space-y-3">
                {[
                  "全程會先說明，經您同意才會進行",
                  "價格透明，不滿意可不交易",
                  "專業檢測，保障雙方權益",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 bg-[#D4AF37] rounded-full p-1 flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-[#3A0A0E]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-[#FDF5E6] font-medium tracking-wider">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 右側情境圖 */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10 aspect-video lg:aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1599643478524-fbeb553cb856?q=80&w=1200&auto=format&fit=crop"
                alt="安心保障"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
