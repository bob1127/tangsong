import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { retrieveCustomer } from "@lib/data/customer"
import { retrieveCart } from "@lib/data/cart"
import { getLatestMetals } from "@lib/data/metals"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { NavAccountButton } from "@modules/layout/components/nav-account-button"
import { NavCartIcon, navIconLinkClassName } from "@modules/layout/components/nav-icons"
import SideMenu from "@modules/layout/components/side-menu"
import TopNavPriceTicker from "@modules/layout/components/top-nav-price-ticker"
import Image from "next/image"

export const dynamic = "force-dynamic"
export const revalidate = 0

function CartIconFallback() {
  return (
    <LocalizedClientLink
      className={navIconLinkClassName}
      href="/cart"
      aria-label="購物車"
      title="購物車"
    >
      <NavCartIcon />
    </LocalizedClientLink>
  )
}

const NAV_LINKS = [
  { href: "/about", label: "關於我們" },
  { href: "/purchase-process", label: "收購流程" },
  { href: "/store", label: "商品資訊" },
  { href: "/contact", label: "聯絡我們" },
  { href: "/purchase-categories", label: "收購項目" },
  { href: "/faq", label: "Q&A" },
  { href: "/tools", label: "重量換算器" },
] as const

function getCustomerDisplayName(
  customer: Awaited<ReturnType<typeof retrieveCustomer>> | null
): string {
  if (!customer) return "會員中心"

  const fullName = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ")
    .trim()

  return fullName || customer.email.split("@")[0] || "會員中心"
}

export default async function Nav() {
  const [regions, locales, currentLocale, customer, metalsData, cart] =
    await Promise.all([
      listRegions().then((regions: StoreRegion[]) => regions),
      listLocales(),
      getLocale(),
      retrieveCustomer().catch(() => null),
      getLatestMetals(),
      retrieveCart().catch(() => null),
    ])

  const avatarUrl = customer?.metadata?.avatar_url as string | undefined
  const accountLabel = getCustomerDisplayName(customer)
  const cartItemCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <TopNavPriceTicker initialData={metalsData} />

      <header className="relative h-16 mx-auto border-b duration-200 bg-[#FDFBF7] border-[#D4AF37]/20 shadow-sm">
        <nav className="txt-xsmall-plus max-w-[1920px] mx-auto flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full w-[33%] justify-center flex items-center text-[#5A1216]">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
              customer={customer}
              displayName={accountLabel}
              avatarUrl={avatarUrl}
              cartItemCount={cartItemCount}
            />
          </div>

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

          <div className="flex items-center flex-1 basis-0 w-[33%] min-w-0 gap-x-3 xl:gap-x-5 pr-4 h-full justify-end">
            <div className="hidden large:flex items-center h-full gap-x-4 xl:gap-x-6 min-w-0 overflow-hidden">
              {NAV_LINKS.map((link) => (
                <LocalizedClientLink
                  key={link.href}
                  className="text-[#5A1216] hover:text-[#D4AF37] tracking-widest font-medium transition-colors whitespace-nowrap shrink-0"
                  href={link.href}
                >
                  {link.label}
                </LocalizedClientLink>
              ))}
            </div>

            <div className="flex items-center gap-0.5 shrink-0 ml-auto large:ml-0">
              <NavAccountButton
                label={accountLabel}
                displayName={accountLabel}
                avatarUrl={avatarUrl}
                isLoggedIn={Boolean(customer)}
              />

              <Suspense fallback={<CartIconFallback />}>
                <CartButton />
              </Suspense>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
