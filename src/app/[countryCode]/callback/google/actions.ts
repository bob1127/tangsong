"use server"

import { cookies } from "next/headers"
import { revalidatePath, revalidateTag } from "next/cache" // 🚀 引入 revalidateTag

export async function setLoginState(token: string) {
  const cookieStore = await cookies()
  
  // 1. 寫入伺服器級別的 Cookie
  cookieStore.set("_medusa_jwt", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 天
    httpOnly: true,
    sameSite: "lax",
  })

  // 2. 強制清除全站快取與 Medusa 專屬的顧客快取
  revalidatePath("/", "layout")
  revalidateTag("customer") // 🚀 關鍵：徹底粉碎舊的未登入快取！
  
  return true
}