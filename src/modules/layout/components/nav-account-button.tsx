"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  NavCartIcon,
  NavIconBadge,
  NavUserIcon,
  navIconLinkClassName,
} from "@modules/layout/components/nav-icons"

type NavAccountButtonProps = {
  href?: string
  label: string
  avatarUrl?: string
  displayName?: string
  isLoggedIn?: boolean
}

export function NavAccountButton({
  href = "/account",
  label,
  avatarUrl,
  displayName,
  isLoggedIn = false,
}: NavAccountButtonProps) {
  if (isLoggedIn && displayName) {
    return (
      <LocalizedClientLink
        href={href}
        className={`${navIconLinkClassName} large:w-auto large:max-w-[9rem] large:gap-2 large:px-2`}
        aria-label={label}
        title={label}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="block size-5 shrink-0 rounded-full border border-[#D4AF37]/50 object-cover large:size-6"
          />
        ) : (
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[10px] font-semibold text-[#5A1216] large:size-6 large:text-xs">
            {displayName.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="hidden large:block truncate text-xs font-medium tracking-wide">
          {displayName}
        </span>
      </LocalizedClientLink>
    )
  }

  return (
    <LocalizedClientLink
      href={href}
      className={navIconLinkClassName}
      aria-label={label}
      title={label}
    >
      <NavUserIcon />
    </LocalizedClientLink>
  )
}

export function NavCartLinkButton({
  href = "/cart",
  label,
  count = 0,
  testId,
}: {
  href?: string
  label: string
  count?: number
  testId?: string
}) {
  return (
    <LocalizedClientLink
      href={href}
      className={navIconLinkClassName}
      aria-label={label}
      title={label}
      data-testid={testId}
    >
      <NavCartIcon />
      <NavIconBadge count={count} />
    </LocalizedClientLink>
  )
}
