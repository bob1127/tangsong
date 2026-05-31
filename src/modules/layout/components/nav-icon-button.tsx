"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  NavIconFrame,
  navIconLinkClassName,
} from "@modules/layout/components/nav-icons"
import type { ReactNode } from "react"

type NavIconButtonProps = {
  href: string
  label: string
  children: ReactNode
  badge?: number
  testId?: string
}

export function NavIconButton({
  href,
  label,
  children,
  badge,
  testId,
}: NavIconButtonProps) {
  return (
    <LocalizedClientLink
      href={href}
      className={navIconLinkClassName}
      aria-label={label}
      title={label}
      data-testid={testId}
    >
      <NavIconFrame badge={badge}>{children}</NavIconFrame>
    </LocalizedClientLink>
  )
}
