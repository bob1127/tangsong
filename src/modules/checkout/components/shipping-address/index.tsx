import { HttpTypes } from "@medusajs/types"
import Input from "@modules/common/components/input"
import React, { useEffect, useMemo, useState } from "react"

function buildFullName(
  firstName?: string | null,
  lastName?: string | null
): string {
  return [firstName, lastName].filter(Boolean).join(" ").trim()
}

const ShippingAddress = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const defaultAddress = useMemo(() => {
    if (!customer?.addresses?.length) return null
    return (
      customer.addresses.find((a) => a.is_default_shipping) ||
      customer.addresses[0]
    )
  }, [customer])

  const buildInitialData = () => ({
    "shipping_address.first_name":
      buildFullName(
        cart?.shipping_address?.first_name,
        cart?.shipping_address?.last_name
      ) ||
      buildFullName(defaultAddress?.first_name, defaultAddress?.last_name) ||
      "",
    "shipping_address.phone":
      cart?.shipping_address?.phone ||
      defaultAddress?.phone ||
      customer?.phone ||
      "",
    email: cart?.email || customer?.email || "",
  })

  const [formData, setFormData] = useState(buildInitialData)

  useEffect(() => {
    setFormData(buildInitialData())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.shipping_address, cart?.email, defaultAddress, customer?.phone, customer?.email])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <input type="hidden" name="shipping_address.country_code" value="tw" />

      <div className="flex flex-col gap-4">
        <Input
          label="姓名"
          name="shipping_address.first_name"
          autoComplete="name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-name-input"
        />
        <Input
          label="電話"
          name="shipping_address.phone"
          type="tel"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          required
          data-testid="shipping-phone-input"
        />
        <Input
          label="信箱"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          data-testid="shipping-email-input"
        />
      </div>
    </>
  )
}

export default ShippingAddress
