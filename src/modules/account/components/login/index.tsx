"use client"

import React, { useState } from "react"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

  // 🚀 完整除錯版：Google 登入處理
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setErrorMsg("")
    console.log("🟢 [Google Login] 開始請求授權網址...")

    try {
      // 1. 向 Medusa 後端請求 Google 授權網址
      const response = await fetch(`${backendUrl}/auth/customer/google`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      console.log("🟢 [Google Login] API 回應狀態:", response.status)

      if (!response.ok) {
        throw new Error(`後端回應錯誤 (狀態碼: ${response.status})`)
      }

      // 2. 解析後端回傳的 JSON (這就是你截圖畫面上的那個 { location: "..." })
      const data = await response.json()
      console.log("🟢 [Google Login] 取得授權資料:", data)

      // 3. 確認有拿到 location 網址，執行畫面跳轉
      if (data.location) {
        console.log("🟢 [Google Login] 準備跳轉至 Google 授權頁面...")
        window.location.href = data.location
      } else {
        throw new Error("後端沒有回傳有效的跳轉網址 (location 遺失)")
      }
    } catch (error: any) {
      // 🚨 捕捉所有錯誤並顯示
      console.error("🔴 [Google Login] 發生錯誤:", error)
      setErrorMsg(error.message || "無法連接至登入伺服器，請稍後再試。")
      setIsLoading(false)
    }
  }

  // LINE 登入比照辦理 (預留)
  const handleLineLogin = async () => {
    // 尚未實作 LINE 模組前，先給提示
    alert("LINE 登入模組尚未在後端啟用！")
  }

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center font-sans animate-in fade-in duration-500"
      data-testid="login-page"
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-stone-900 tracking-wide mb-2">
          會員登入 / 註冊
        </h1>
        <p className="text-sm text-stone-500">
          選擇以下社群帳號，一鍵快速完成登入與註冊，立即查看您的專屬資訊。
        </p>
      </div>

      {/* 🚨 錯誤訊息提示區塊 */}
      {errorMsg && (
        <div className="w-full bg-red-50 text-red-600 border border-red-200 p-3 rounded-md text-sm mb-4 text-center">
          {errorMsg}
        </div>
      )}

      <div className="w-full flex flex-col gap-4">
        {/* LINE 登入按鈕 */}
        <button
          onClick={handleLineLogin}
          type="button"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#06C755] hover:bg-[#05b34c] text-white py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all font-bold tracking-widest text-[14px] disabled:opacity-50"
        >
          {/* ... LINE SVG 保持不變 ... */}
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.996 8.892 9.479 9.619.37.079.873.242.998.555.114.286.074.733.036 1.037l-.146.883c-.046.282-.224 1.096.958.599 1.182-.497 6.38-3.766 8.653-6.398 2.607-3.003 4.022-6.002 4.022-6.295zm-14.444 3.32h-2.909c-.27 0-.489-.22-.489-.489v-4.992c0-.27.22-.489.489-.489.27 0 .489.22.489.489v4.503h2.42c.27 0 .489.22.489.489 0 .27-.22.489-.489.489zm2.49 0h-.977c-.27 0-.489-.22-.489-.489v-4.992c0-.27.22-.489.489-.489h.977c.27 0 .489.22.489.489v4.992c0 .27-.22.489-.489.489zm4.24-3.181l-1.849 2.946c-.056.09-.153.141-.252.141-.013 0-.026 0-.04-.002-.111-.018-.2-.089-.24-.19l-.004-.01v-2.885c0-.27-.22-.489-.489-.489-.27 0-.489.22-.489.489v4.992c0 .12.043.235.118.322.073.084.179.138.293.149.014.001.028.002.042.002.099 0 .195-.043.255-.125l2.063-3.23v3.018c0 .27.22.489.489.489.27 0 .489-.22.489-.489v-4.992c0-.123-.046-.239-.124-.326-.078-.086-.188-.139-.304-.149-.015-.001-.03-.002-.045-.002-.093 0-.184.037-.245.105z" />
          </svg>
          使用 LINE 登入
        </button>

        {/* Google 登入按鈕 */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 py-3.5 rounded-lg shadow-sm hover:shadow transition-all font-bold tracking-widest text-[14px] disabled:opacity-50"
        >
          {isLoading ? (
            <span className="animate-pulse text-stone-400">連接中...</span>
          ) : (
            <>
              {/* ... Google SVG 保持不變 ... */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              使用 Google 登入
            </>
          )}
        </button>
      </div>

      <div className="mt-8 text-center text-xs text-stone-400">
        登入即代表您同意本站的{" "}
        <a href="/terms" className="underline hover:text-stone-700">
          服務條款
        </a>{" "}
        與{" "}
        <a href="/privacy" className="underline hover:text-stone-700">
          隱私權政策
        </a>
      </div>
    </div>
  )
}

export default Login
