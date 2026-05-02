"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const LocalizedClientLink = ({
  children,
  href,
  className,
  onClick,
  passHref,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  const { countryCode } = useParams()

  // 🚀 關鍵修改 3：判斷如果當前語系是 "tw"，就將 prefix 設為空白 (不加上 /tw)
  const prefix = countryCode === "tw" ? "" : `/${countryCode}`

  return (
    <Link
      href={`${prefix}${href}`}
      className={className}
      onClick={onClick}
      passHref={passHref}
      {...props}
    >
      {children}
    </Link>
  )
}

export default LocalizedClientLink
