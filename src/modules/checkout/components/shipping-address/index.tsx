import { HttpTypes } from "@medusajs/types"
import Input from "@modules/common/components/input"
import React, { useEffect, useState } from "react"

const BillingAddress = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    "billing_address.first_name": cart?.billing_address?.first_name || "",
    "billing_address.last_name": cart?.billing_address?.last_name || "",
    "billing_address.address_1": cart?.billing_address?.address_1 || "",
    "billing_address.company": cart?.billing_address?.company || "",
    "billing_address.postal_code": cart?.billing_address?.postal_code || "",
    "billing_address.city": cart?.billing_address?.city || "",
    "billing_address.country_code": cart?.billing_address?.country_code || "tw", // 預設為台灣
    "billing_address.province": cart?.billing_address?.province || "",
    "billing_address.phone": cart?.billing_address?.phone || "",
  })

  useEffect(() => {
    if (cart && cart.billing_address) {
      setFormData({
        "billing_address.first_name": cart.billing_address.first_name || "",
        "billing_address.last_name": cart.billing_address.last_name || "",
        "billing_address.address_1": cart.billing_address.address_1 || "",
        "billing_address.company": cart.billing_address.company || "",
        "billing_address.postal_code": cart.billing_address.postal_code || "",
        "billing_address.city": cart.billing_address.city || "",
        "billing_address.country_code":
          cart.billing_address.country_code || "tw",
        "billing_address.province": cart.billing_address.province || "",
        "billing_address.phone": cart.billing_address.phone || "",
      })
    }
  }, [cart?.billing_address])

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
      {/* 隱藏的國家欄位，確保通過後端驗證 */}
      <input
        type="hidden"
        name="billing_address.country_code"
        value={formData["billing_address.country_code"]}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* 姓名與電話 */}
        <Input
          label="姓氏"
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData["billing_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="billing-last-name-input"
        />
        <Input
          label="名字"
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData["billing_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="billing-first-name-input"
        />
        <Input
          label="聯絡電話"
          name="billing_address.phone"
          autoComplete="tel"
          value={formData["billing_address.phone"]}
          onChange={handleChange}
          required
          data-testid="billing-phone-input"
        />

        {/* 台灣地址結構 */}
        <Input
          label="縣市"
          name="billing_address.province"
          autoComplete="address-level1"
          value={formData["billing_address.province"]}
          onChange={handleChange}
          required
          data-testid="billing-province-input"
        />
        <Input
          label="鄉鎮市區"
          name="billing_address.city"
          autoComplete="address-level2"
          value={formData["billing_address.city"]}
          onChange={handleChange}
          required
          data-testid="billing-city-input"
        />
        <Input
          label="郵遞區號"
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={formData["billing_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="billing-postal-code-input"
        />

        {/* 公司名稱 */}
        <Input
          label="公司/機構名稱 (選填)"
          name="billing_address.company"
          value={formData["billing_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="billing-company-input"
        />
      </div>

      {/* 詳細地址佔滿整排 */}
      <div className="mt-4">
        <Input
          label="詳細地址 (路名/巷弄/號/樓)"
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData["billing_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="billing-address-input"
        />
      </div>
    </>
  )
}

export default BillingAddress
