import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      {/* 👑 頂部公告欄：深燕脂紅背景 + 雅緻金文字 */}
      <div className="topNav w-full py-2 bg-[#3A0A0E] flex justify-center items-center border-b border-[#D4AF37]/30 transition-all duration-300">
        <span className="text-xs tracking-[0.2em] text-[#D4AF37]">
          今日國際金價已更新，歡迎線上預約門市鑑賞
        </span>
      </div>

      {/* 👑 主導覽列：米白宣紙背景 */}
      <header className="relative h-16 mx-auto border-b duration-200 bg-[#FDFBF7] border-[#D4AF37]/20 shadow-sm">
        <nav className="content-container txt-xsmall-plus flex items-center justify-between w-full h-full text-small-regular">
          {/* 左側：漢堡選單 (SideMenu) */}
          <div className="flex-1 basis-0 h-full flex items-center text-[#5A1216]">
            <div className="h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
          </div>

          {/* 中間：品牌 LOGO / 名稱 */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="text-xl md:text-2xl font-serif text-[#5A1216] hover:text-[#D4AF37] font-bold tracking-[0.15em] transition-colors"
              data-testid="nav-store-link"
            >
              唐宋珠寶
            </LocalizedClientLink>
          </div>

          {/* 右側：會員中心與購物車 */}
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors"
                href="/account"
                data-testid="nav-account-link"
              >
                會員中心
              </LocalizedClientLink>
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors"
                href="/store"
                data-testid="nav-account-link"
              >
                商品資訊
              </LocalizedClientLink>
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors"
                href="/contact"
                data-testid="nav-account-link"
              >
                聯絡我們
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  購物車 (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
