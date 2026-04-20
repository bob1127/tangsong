import { HttpTypes } from "@medusajs/types"
import Input from "@modules/common/components/input"
import Checkbox from "@modules/common/components/checkbox"
import React, { useEffect, useState, useMemo } from "react"

const ShippingAddress = ({
  cart,
  customer,
  checked,
  onChange,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  checked: boolean
  onChange: () => void
}) => {
  // 1. 找出會員的預設「收件地址」
  const defaultAddress = useMemo(() => {
    if (!customer?.addresses?.length) return null
    return (
      customer.addresses.find((a) => a.is_default_shipping) ||
      customer.addresses[0]
    )
  }, [customer])

  // 2. 初始狀態：全部換成 shipping_address 屬性
  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name":
      cart?.shipping_address?.first_name || defaultAddress?.first_name || "",
    "shipping_address.last_name":
      cart?.shipping_address?.last_name || defaultAddress?.last_name || "",
    "shipping_address.address_1":
      cart?.shipping_address?.address_1 || defaultAddress?.address_1 || "",
    "shipping_address.company":
      cart?.shipping_address?.company || defaultAddress?.company || "",
    "shipping_address.postal_code":
      cart?.shipping_address?.postal_code || defaultAddress?.postal_code || "",
    "shipping_address.city":
      cart?.shipping_address?.city || defaultAddress?.city || "",
    "shipping_address.country_code":
      cart?.shipping_address?.country_code ||
      defaultAddress?.country_code ||
      "tw",
    "shipping_address.province":
      cart?.shipping_address?.province || defaultAddress?.province || "",
    "shipping_address.phone":
      cart?.shipping_address?.phone ||
      defaultAddress?.phone ||
      customer?.phone ||
      "",
  })

  // 3. 連動更新
  useEffect(() => {
    if (cart?.shipping_address || defaultAddress) {
      setFormData({
        "shipping_address.first_name":
          cart?.shipping_address?.first_name ||
          defaultAddress?.first_name ||
          "",
        "shipping_address.last_name":
          cart?.shipping_address?.last_name || defaultAddress?.last_name || "",
        "shipping_address.address_1":
          cart?.shipping_address?.address_1 || defaultAddress?.address_1 || "",
        "shipping_address.company":
          cart?.shipping_address?.company || defaultAddress?.company || "",
        "shipping_address.postal_code":
          cart?.shipping_address?.postal_code ||
          defaultAddress?.postal_code ||
          "",
        "shipping_address.city":
          cart?.shipping_address?.city || defaultAddress?.city || "",
        "shipping_address.country_code":
          cart?.shipping_address?.country_code ||
          defaultAddress?.country_code ||
          "tw",
        "shipping_address.province":
          cart?.shipping_address?.province || defaultAddress?.province || "",
        "shipping_address.phone":
          cart?.shipping_address?.phone ||
          defaultAddress?.phone ||
          customer?.phone ||
          "",
      })
    }
  }, [cart?.shipping_address, defaultAddress, customer?.phone])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      {/* 關鍵：隱藏的國家欄位，必須是 shipping_address */}
      <input
        type="hidden"
        name="shipping_address.country_code"
        value={formData["shipping_address.country_code"]}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* 姓名與電話 */}
        <Input
          label="姓氏"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-last-name-input"
        />
        <Input
          label="名字"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label="聯絡電話"
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData["shipping_address.phone"]}
          onChange={handleChange}
          required
          data-testid="shipping-phone-input"
        />

        {/* 台灣地址結構 */}
        <Input
          label="縣市"
          name="shipping_address.province"
          autoComplete="address-level1"
          value={formData["shipping_address.province"]}
          onChange={handleChange}
          required
          data-testid="shipping-province-input"
        />
        <Input
          label="鄉鎮市區"
          name="shipping_address.city"
          autoComplete="address-level2"
          value={formData["shipping_address.city"]}
          onChange={handleChange}
          required
          data-testid="shipping-city-input"
        />
        <Input
          label="郵遞區號"
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData["shipping_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="shipping-postal-code-input"
        />

        {/* 公司名稱 */}
        <Input
          label="公司/機構名稱 (選填)"
          name="shipping_address.company"
          value={formData["shipping_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="shipping-company-input"
        />
      </div>

      {/* 詳細地址 */}
      <div className="mt-4">
        <Input
          label="詳細地址 (路名/巷弄/號/樓)"
          name="shipping_address.address_1"
          autoComplete="address-line1"
          value={formData["shipping_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="shipping-address-input"
        />
      </div>

      {/* 同帳單地址的勾選框 */}
      <div className="mt-8">
        <Checkbox
          label="帳單地址與收件地址相同"
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
          data-testid="billing-address-checkbox"
        />
      </div>
    </>
  )
}

export default ShippingAddress
