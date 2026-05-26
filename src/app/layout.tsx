import { getBaseURL } from "@lib/util/env"
import { Gtm } from "../components/analytics/gtm"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" data-mode="light">
      <body>
        <Gtm />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
