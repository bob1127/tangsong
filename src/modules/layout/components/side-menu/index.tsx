"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ShoppingCart, User, XMark } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const SideMenuItems = {
  關於我們: "/about",
  收購流程: "/purchase-process",
  商品資訊: "/store",
  聯絡我們: "/contact",
  收購項目: "/purchase-categories",
  "Q&A": "/faq",
  重量換算器: "/tools",
} as const

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  customer?: HttpTypes.StoreCustomer | null
  displayName?: string
  avatarUrl?: string
  cartItemCount?: number
}

function MenuAvatar({
  avatarUrl,
  displayName,
}: {
  avatarUrl?: string
  displayName: string
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="size-11 shrink-0 rounded-full border-2 border-[#D4AF37]/60 object-cover"
      />
    )
  }

  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37]">
      <span className="text-sm font-semibold tracking-wide">
        {displayName.slice(0, 1).toUpperCase()}
      </span>
    </div>
  )
}

const SideMenu = ({
  regions: _regions,
  locales: _locales,
  currentLocale: _currentLocale,
  customer = null,
  displayName = "會員中心",
  avatarUrl,
  cartItemCount = 0,
}: SideMenuProps) => {
  const isLoggedIn = Boolean(customer)

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center text-[#5A1216] tracking-widest font-medium transition-colors duration-200 focus:outline-none hover:text-[#D4AF37]"
                >
                  MENU
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/0 pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-2xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-2xl"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-[51] inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-2xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-[#1A0506]/90 rounded-rounded p-6"
                  >
                    <div className="flex justify-end mb-2" id="xmark">
                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        className="text-white/70 hover:text-white transition-colors"
                        aria-label="關閉選單"
                      >
                        <XMark />
                      </button>
                    </div>

                    <div className="flex flex-col gap-3 mb-8 pb-6 border-b border-white/10">
                      <LocalizedClientLink
                        href="/account"
                        onClick={close}
                        data-testid="mobile-menu-account-link"
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-[#D4AF37]/40 hover:bg-white/10"
                      >
                        {isLoggedIn ? (
                          <>
                            <MenuAvatar
                              avatarUrl={avatarUrl}
                              displayName={displayName}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-base font-medium text-white">
                                {displayName}
                              </p>
                              <p className="text-xs text-[#D4AF37]/90 tracking-wide">
                                會員中心
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#D4AF37]">
                              <User className="size-5" aria-hidden />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-base font-medium text-white">
                                登入 / 會員中心
                              </p>
                              <p className="text-xs text-white/50">
                                查看訂單與個人資料
                              </p>
                            </div>
                          </>
                        )}
                      </LocalizedClientLink>

                      <LocalizedClientLink
                        href="/cart"
                        onClick={close}
                        data-testid="mobile-menu-cart-link"
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-[#D4AF37]/40 hover:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#D4AF37]">
                            <ShoppingCart className="size-5" aria-hidden />
                          </div>
                          <div>
                            <p className="text-base font-medium text-white">
                              購物車
                            </p>
                            <p className="text-xs text-white/50">
                              {cartItemCount > 0
                                ? `${cartItemCount} 件商品`
                                : "目前沒有商品"}
                            </p>
                          </div>
                        </div>
                        {cartItemCount > 0 ? (
                          <span className="flex min-w-[1.5rem] h-6 items-center justify-center rounded-full bg-[#D4AF37] px-2 text-xs font-semibold text-[#1A0506]">
                            {cartItemCount > 99 ? "99+" : cartItemCount}
                          </span>
                        ) : null}
                      </LocalizedClientLink>
                    </div>

                    <ul className="flex flex-1 flex-col gap-5 items-start justify-start overflow-y-auto">
                      {Object.entries(SideMenuItems).map(([name, href]) => (
                        <li key={name}>
                          <LocalizedClientLink
                            href={href}
                            className="text-xl font-serif leading-8 text-white/90 hover:text-[#D4AF37] transition-colors"
                            onClick={close}
                            data-testid={`${name}-link`}
                          >
                            {name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 pt-4 border-t border-white/10">
                      <Text className="txt-compact-small text-white/40">
                        © {new Date().getFullYear()} 唐宋珠寶. All rights
                        reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
