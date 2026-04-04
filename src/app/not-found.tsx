import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">Oops !</h1>
      <p className="text-md text-ui-fg-base text-center">
        頁面似乎壞掉了，工程師極力搶修中<br></br>有問題請直接連繫我們
      </p>
      <Link className="flex gap-x-1 items-center group" href="/">
        <Text className="text-ui-fg-interactive">回到首頁</Text>
        <ArrowUpRightMini
          className="group-hover:rotate-45 ease-in-out duration-150"
          color="var(--fg-interactive)"
        />
      </Link>
    </div>
  )
}
