"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"
import { publicPath } from "@lib/util/site-url"

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
  const resolvedCountry =
    typeof countryCode === "string" ? countryCode : undefined

  return (
    <Link
      href={publicPath(href, resolvedCountry)}
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
