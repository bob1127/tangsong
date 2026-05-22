import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { retrieveCustomer } from "@lib/data/customer"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import Image from "next/image"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Nav() {
  const [regions, locales, currentLocale, customer] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    retrieveCustomer().catch(() => null),
  ])

  // 🚀 從 metadata 提取 LINE 傳過來的大頭貼
  const avatarUrl = customer?.metadata?.avatar_url as string | undefined

  // 🚀 格式化名稱顯示：有登入就秀名字，沒登入就秀「會員中心」
  let displayName = "會員中心"
  if (customer) {
    displayName =
      customer.first_name || customer.last_name || customer.email.split("@")[0]
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <div className="topNav w-full py-2 bg-[#3A0A0E] flex justify-center items-center border-b border-[#D4AF37]/30">
        <span className="text-xs tracking-[0.2em] text-[#D4AF37]">
          今日國際金價已更新，歡迎線上預約門市鑑賞
        </span>
      </div>

      <header className="relative h-16 mx-auto border-b duration-200 bg-[#FDFBF7] border-[#D4AF37]/20  shadow-sm">
        <nav className="  txt-xsmall-plus max-w-[1920px]  mx-auto flex items-center justify-between w-full h-full text-small-regular">
          {/* 左側：選單按鈕 */}
          <div className="flex-1 basis-0 h-full w-[33%] justify-center flex items-center text-[#5A1216]">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>

          {/* 中央：Logo */}
          <div className="flex items-center h-full justify-center w-[33%]">
            <Image
              src="/images/logo/logo.png"
              alt="logo"
              width={500}
              height={500}
              className="max-w-[50px]"
            />
            <LocalizedClientLink
              href="/"
              className="text-xl md:text-2xl font-serif text-[#5A1216] font-bold tracking-[0.15em] whitespace-nowrap"
            >
              唐宋珠寶
            </LocalizedClientLink>
          </div>

          {/* 右側：所有連結項目 */}
          {/* 🚀 REMOVED: flex-1 basis-0 */}
          {/* 🚀 ADDED: ml-auto to push the entire container to the right margin */}
          <div className="flex items-center w-[33%] gap-x-4 pr-5 xl:gap-x-6 h-full justify-end ml-auto">
            {/* 會員登入 / 頭貼 */}
            <div className="hidden small:flex items-center h-full">
              <LocalizedClientLink
                className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                href="/account"
              >
                {/* 如果有登入，判斷要秀大頭貼還是預設人像圖標 */}
                {customer ? (
                  avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className="w-6 h-6 rounded-full border border-[#D4AF37]/50 object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  )
                ) : null}
                <span>{displayName}</span>
              </LocalizedClientLink>
            </div>

            {/* 其他選單連結 */}
            <div className="hidden large:flex items-center h-full">
              <LocalizedClientLink
                className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors whitespace-nowrap"
                href="/about"
              >
                關於我們
              </LocalizedClientLink>
            </div>
            <div className="hidden large:flex items-center h-full">
              <LocalizedClientLink
                className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors whitespace-nowrap"
                href="/purchase-process"
              >
                收購流程
              </LocalizedClientLink>
            </div>
            <div className="hidden large:flex items-center h-full">
              <LocalizedClientLink
                className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors whitespace-nowrap"
                href="/store"
              >
                商品資訊
              </LocalizedClientLink>
            </div>
            <div className="hidden large:flex items-center h-full">
              <LocalizedClientLink
                className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors whitespace-nowrap"
                href="/contact"
              >
                聯絡我們
              </LocalizedClientLink>
            </div>
            <div className="hidden large:flex items-center h-full">
              <LocalizedClientLink
                className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors whitespace-nowrap"
                href="/purchase-categories"
              >
                收購項目
              </LocalizedClientLink>
            </div>
            <div className="hidden large:flex items-center h-full">
              <LocalizedClientLink
                className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors whitespace-nowrap"
                href="/tools"
              >
                重量換算器
              </LocalizedClientLink>
            </div>

            <Suspense
              fallback={
                <LocalizedClientLink
                  className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors flex gap-2 whitespace-nowrap"
                  href="/cart"
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
