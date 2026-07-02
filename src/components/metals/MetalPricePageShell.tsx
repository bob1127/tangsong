import Link from "next/link"
import type { MetalPricePageConfig } from "@lib/seo/metal-price-pages"

type MetalPricePageShellProps = {
  page: MetalPricePageConfig
  updateTime?: string
  children: React.ReactNode
}

export default function MetalPricePageShell({
  page,
  updateTime,
  children,
}: MetalPricePageShellProps) {
  return (
    <div className="w-full bg-[#FDFBF7] min-h-screen">
      <div className="w-full border-b border-[#D4AF37]/20 bg-white/80">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 md:py-12">
          <nav className="text-xs tracking-widest text-stone-400 mb-6">
            <Link href="/" className="hover:text-[#5A1216]">
              首頁
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#5A1216]">{page.name}</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-serif text-[#3A0A0E] font-bold tracking-widest">
            {page.h1}
          </h1>
          <p className="text-[#3A0A0E]/70 font-bold text-sm tracking-wider mt-3">
            {page.subtitle}
          </p>
          {updateTime && (
            <p className="text-stone-500 text-sm mt-2">
              資料更新時間：
              {new Date(updateTime).toLocaleString("zh-TW")}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 md:py-12 font-mono">
        {children}
      </div>
    </div>
  )
}
