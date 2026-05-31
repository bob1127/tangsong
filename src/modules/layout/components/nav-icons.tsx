"use client"

import { ShoppingCart, User } from "@medusajs/icons"
import type { ReactNode } from "react"

export const NAV_ICON_CLASS = "size-5 shrink-0"

export function NavUserIcon() {
  return <User className={NAV_ICON_CLASS} aria-hidden />
}

export function NavCartIcon() {
  return <ShoppingCart className={NAV_ICON_CLASS} aria-hidden />
}

export const navIconLinkClassName =
  "relative inline-flex size-9 shrink-0 items-center justify-center rounded-sm text-[#5A1216] hover:text-[#D4AF37] transition-colors leading-none"

export function NavIconBadge({ count }: { count: number }) {
  if (count <= 0) return null

  return (
    <span className="pointer-events-none absolute -top-1 -right-1 flex min-w-[1rem] h-4 items-center justify-center rounded-full bg-[#5A1216] px-1 text-[10px] font-semibold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  )
}

type NavIconFrameProps = {
  children: ReactNode
  badge?: number
}

export function NavIconFrame({ children, badge }: NavIconFrameProps) {
  return (
    <>
      {children}
      {badge != null ? <NavIconBadge count={badge} /> : null}
    </>
  )
}
