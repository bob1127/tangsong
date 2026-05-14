"use server"

import { cookies } from "next/headers"
import { revalidatePath, revalidateTag } from "next/cache"

/**
 * 🚀 唐宋珠寶 - 登入狀態寫入與環境同步工具
 * 此 Action 解決了：
 * 1. 本地開發時 Cookie 被瀏覽器吃掉的問題 (Secure 屬性)
 * 2. 登入後畫面沒更新的問題 (Revalidate)
 * 3. 確保前後端環境一致，避免跨網域 401 錯誤
 */
export async function setLoginState(token: string) {
  try {
    console.log("-------------------------------------------")
    console.log("🔵 [Action] 啟動 setLoginState")
    
    const cookieStore = await cookies()

    // 💡 自動判斷環境
    const isProduction = process.env.NODE_ENV === "production"
    
    // 從環境變數檢查目前的後端目標
    const backendTarget = process.env.MEDUSA_BACKEND_URL || "未設定"
    
    console.log("📊 [環境檢查]")
    console.log(` - 運行模式: ${isProduction ? "正式站 (Production)" : "本地端 (Development)"}`)
    console.log(` - 後端連線目標: ${backendTarget}`)

    // 1. 寫入伺服器級別的 Cookie
    // 注意：這裡的 name 必須跟 middleware 或 account 頁面檢查的 key 完全一致
    cookieStore.set({
      name: "_medusa_jwt",
      value: token,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 天
      httpOnly: true, // 防範 XSS 攻擊
      // ⚠️ 關鍵修正：本地端 http://localhost 必須為 false
      secure: isProduction, 
      sameSite: "lax", // 允許從 Google 導回時攜帶 Cookie
    })

    console.log("✅ [Action] _medusa_jwt 已寫入伺服器端 Cookie")

    // 2. 強制清除全站與顧客快取 (這是解決「登入後還是顯示登入鈕」的關鍵)
    revalidatePath("/", "layout")
    revalidateTag("customer") 
    
    console.log("✅ [Action] 已執行快取重整 (revalidateTag: customer)")

    // 3. 除錯檢查
    const savedCookie = cookieStore.get("_medusa_jwt")
    if (savedCookie) {
      console.log("✅ [Action] 驗證成功：Cookie 已成功儲存於 Server Side")
    } else {
      console.warn("⚠️ [Action] 警告：Cookie 寫入後無法即時讀回，請確認 Domain 設定")
    }

    console.log("-------------------------------------------")
    return true
  } catch (error) {
    console.error("❌ [Action] 嚴重錯誤:", error)
    return false 
  }
}