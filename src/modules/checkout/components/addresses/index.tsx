"use client"

import { setAddresses } from "@lib/data/cart"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

function buildDisplayName(cart: HttpTypes.StoreCart): string {
  return [cart.shipping_address?.first_name, cart.shipping_address?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim()
}

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  const hasContactInfo =
    cart?.shipping_address?.phone &&
    buildDisplayName(cart).length > 0

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
        >
          資訊
          {!isOpen && hasContactInfo && <CheckCircleSolid />}
        </Heading>
        {!isOpen && hasContactInfo && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-address-button"
            >
              編輯
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress customer={customer} cart={cart} />

            <SubmitButton className="mt-6" data-testid="submit-address-button">
              繼續前往配送設定
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div>
          {cart && hasContactInfo ? (
            <div
              className="flex flex-col gap-2 text-sm text-ui-fg-subtle"
              data-testid="shipping-contact-summary"
            >
              <p>
                <span className="text-ui-fg-base font-medium">姓名：</span>
                {buildDisplayName(cart)}
              </p>
              <p>
                <span className="text-ui-fg-base font-medium">電話：</span>
                {cart.shipping_address?.phone}
              </p>
              {cart.email && (
                <p>
                  <span className="text-ui-fg-base font-medium">信箱：</span>
                  {cart.email}
                </p>
              )}
            </div>
          ) : null}
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  )
}

export default Addresses
