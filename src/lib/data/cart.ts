"use server"

import { sdk } from "@lib/config"
import { publicPath } from "@lib/util/site-url"
import { translateCheckoutError } from "@lib/util/checkout-error"
import medusaError, {
  extractMedusaErrorMessage,
  isNextRedirectError,
} from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"
import { getLocale } from "@lib/data/locale-actions"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(
  cartId?: string,
  fields?: string,
  options?: { fresh?: boolean }
) {
  const id = cartId || (await getCartId())
  fields ??=
    "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name"

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const fresh = options?.fresh === true

  return await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields,
      },
      headers,
      ...(fresh
        ? { cache: "no-store" as const }
        : {
            next: { ...(await getCacheOptions("carts")) },
            cache: "force-cache" as const,
          }),
    })
    .then(({ cart }: { cart: HttpTypes.StoreCart }) => cart)
    .catch(() => null)
}

const CHECKOUT_CART_FIELDS =
  "*items, *region, *items.product, *items.variant, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name, *payment_collection, *payment_collection.payment_sessions, *shipping_address, email"

async function safeRevalidateTag(tag: string) {
  if (tag) {
    revalidateTag(tag)
  }
}

export type PlaceOrderResult = { ok: true } | { ok: false; error: string }

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let cart = await retrieveCart(undefined, "id,region_id")

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    const locale = await getLocale()
    const cartResp = await sdk.store.cart.create(
      { region_id: region.id, locale: locale || undefined },
      {},
      headers
    )
    cart = cartResp.cart

    await setCartId(cart.id)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  if (cart && cart?.region_id !== region.id) {
    await sdk.store.cart.update(cart.id, { region_id: region.id }, {}, headers)
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  return cart
}

export async function updateCart(data: HttpTypes.StoreUpdateCart) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, data, {}, headers)
    .then(async ({ cart }: { cart: HttpTypes.StoreCart }) => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)

      return cart
    })
    .catch(medusaError)
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .createLineItem(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      {},
      headers
    )
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function deleteLineItem(lineId: string) {
  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.cart
    .deleteLineItem(cartId, lineId, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .addShippingMethod(cartId, { option_id: shippingMethodId }, {}, headers)
    .then(async () => {
      await safeRevalidateTag(await getCacheTag("carts"))
    })
    .catch(medusaError)
}

export async function initiatePaymentSession(
  cart: HttpTypes.StoreCart,
  data: HttpTypes.StoreInitializePaymentSession
) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.payment
    .initiatePaymentSession(cart, data, {}, headers)
    .then(async (resp) => {
      await safeRevalidateTag(await getCacheTag("carts"))
      return resp
    })
    .catch(medusaError)
}

export async function applyPromotions(codes: string[]) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.cart
    .update(cartId, { promo_codes: codes }, {}, headers)
    .then(async () => {
      const cartCacheTag = await getCacheTag("carts")
      revalidateTag(cartCacheTag)

      const fulfillmentCacheTag = await getCacheTag("fulfillment")
      revalidateTag(fulfillmentCacheTag)
    })
    .catch(medusaError)
}

export async function applyGiftCard(code: string) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, { gift_cards: [{ code }] }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function removeDiscount(code: string) {
  // const cartId = getCartId()
  // if (!cartId) return "No cartId cookie found"
  // try {
  //   await deleteDiscount(cartId, code)
  //   revalidateTag("cart")
  // } catch (error: any) {
  //   throw error
  // }
}

export async function removeGiftCard(
  codeToRemove: string,
  giftCards: any[]
  // giftCards: GiftCard[]
) {
  //   const cartId = getCartId()
  //   if (!cartId) return "No cartId cookie found"
  //   try {
  //     await updateCart(cartId, {
  //       gift_cards: [...giftCards]
  //         .filter((gc) => gc.code !== codeToRemove)
  //         .map((gc) => ({ code: gc.code })),
  //     }).then(() => {
  //       revalidateTag("cart")
  //     })
  //   } catch (error: any) {
  //     throw error
  //   }
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

// TODO: Pass a POJO instead of a form entity here
export async function setAddresses(currentState: unknown, formData: FormData) {
  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = await getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const name = String(formData.get("shipping_address.first_name") || "").trim()
    const phone = String(formData.get("shipping_address.phone") || "").trim()
    const email = String(formData.get("email") || "").trim()

    if (!name) {
      return "請填寫姓名"
    }
    if (!phone) {
      return "請填寫電話"
    }

    const pickupAddress = {
      first_name: name,
      last_name: "",
      address_1: "到店取貨",
      address_2: "",
      company: "",
      postal_code: "108",
      city: "台北市",
      country_code: "tw",
      province: "台北市",
      phone,
    }

    const data = {
      shipping_address: pickupAddress,
      billing_address: pickupAddress,
      ...(email ? { email } : {}),
    } as HttpTypes.StoreUpdateCart

    await updateCart(data)
  } catch (e: any) {
    const message = translateCheckoutError(e.message || String(e))
    if (message.includes("已完成結帳")) {
      await removeCartId()
    }
    return message
  }

  redirect(publicPath("/checkout?step=delivery"))
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string): Promise<PlaceOrderResult> {
  try {
    const id = cartId || (await getCartId())

    if (!id) {
      return {
        ok: false,
        error: translateCheckoutError(
          "No existing cart found when placing an order"
        ),
      }
    }

    const headers = {
      ...(await getAuthHeaders()),
    }

    let cart = await retrieveCart(id, CHECKOUT_CART_FIELDS, { fresh: true })

    if (!cart) {
      return {
        ok: false,
        error: translateCheckoutError(
          "No existing cart found when placing an order"
        ),
      }
    }

    if (!cart.shipping_address?.phone) {
      return { ok: false, error: "請先填寫姓名與電話。" }
    }

    if (!cart.shipping_methods?.length) {
      return { ok: false, error: "請先選擇到店取貨方式。" }
    }

    if (!cart.email) {
      const phoneDigits = cart.shipping_address.phone.replace(/\D/g, "")
      const guestEmail = phoneDigits
        ? `guest+${phoneDigits}@tangsong.com.tw`
        : `guest+${Date.now()}@tangsong.com.tw`

      await sdk.store.cart.update(id, { email: guestEmail }, {}, headers)
      cart =
        (await retrieveCart(id, CHECKOUT_CART_FIELDS, { fresh: true })) ?? cart
    }

    const hasPaymentSession =
      (cart.payment_collection?.payment_sessions?.length ?? 0) > 0

    if (!hasPaymentSession) {
      await sdk.store.payment.initiatePaymentSession(
        cart,
        { provider_id: "pp_system_default" },
        {},
        headers
      )
      cart =
        (await retrieveCart(id, CHECKOUT_CART_FIELDS, { fresh: true })) ?? cart
    }

    const cartRes = await sdk.store.cart.complete(id, {}, headers)

    if (cartRes?.type === "order") {
      const countryCode =
        cartRes.order.shipping_address?.country_code?.toLowerCase()

      await safeRevalidateTag(await getCacheTag("carts"))
      await safeRevalidateTag(await getCacheTag("orders"))
      await removeCartId()
      redirect(
        publicPath(`/order/${cartRes.order.id}/confirmed`, countryCode)
      )
    }

    return {
      ok: false,
      error: "付款授權失敗，訂單未建立。請稍候再試，或聯絡客服人員協助。",
    }
  } catch (e: unknown) {
    if (isNextRedirectError(e)) {
      throw e
    }

    const message = extractMedusaErrorMessage(e)
    if (message.includes("已完成結帳")) {
      await removeCartId()
    }

    return { ok: false, error: message }
  }
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(publicPath(currentPath, countryCode))
}

export async function listCartOptions() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }
  const next = {
    ...(await getCacheOptions("shippingOptions")),
  }

  return await sdk.client.fetch<{
    shipping_options: HttpTypes.StoreCartShippingOption[]
  }>("/store/shipping-options", {
    query: { cart_id: cartId },
    next,
    headers,
    cache: "force-cache",
  })
}
