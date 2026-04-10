import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "地址管理",
  description: "查看並管理您的收件地址",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">收件地址</h1>
        <p className="text-base-regular">
          查看並更新您的收件地址，您可以新增多筆不同的地址。儲存後的地址將可在結帳時快速套用。
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
