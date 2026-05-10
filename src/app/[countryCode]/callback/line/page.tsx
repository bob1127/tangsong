"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
// 🚀 直接共用剛剛寫好的 Server Action，用來把 Token 存進 Cookie
import { setLoginState } from "../google/actions"

function LineCallbackHandler() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("正在驗證 LINE 授權...")

  useEffect(() => {
    // 為了避免 React StrictMode 執行兩次，可以使用一個 flag (非必須但推薦)
    let isMounted = true

    const verifyLogin = async () => {
      const code = searchParams.get("code")

      if (!code) {
        if (isMounted) setStatus("授權失敗或您取消了登入。")
        return
      }

      try {
        if (isMounted) setStatus("正在為您同步會員資料...")

        // 🚀 關鍵改變：這裡直接打給我們「自己寫的 Next.js API」，把 code 交給它處理
        const res = await fetch("/api/auth/line", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        })

        const data = await res.json()

        if (res.ok && data.token) {
          if (isMounted) setStatus("登入成功！正在進入會員中心...")
          // 拿到 API 幫我們千辛萬苦生出來的 Medusa Token，存入 Cookie
          await setLoginState(data.token)
          // 大功告成，導回會員首頁！
          window.location.href = "/account"
        } else {
          if (isMounted)
            setStatus(`登入失敗：${data.error || "未知錯誤，請聯繫客服"}`)
        }
      } catch (error: any) {
        if (isMounted) setStatus("網路連線異常，請稍後再試。")
      }
    }

    verifyLogin()

    return () => {
      isMounted = false
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center font-sans">
      <div className="text-center">
        {/* LINE 綠色風格的載入圈圈 */}
        <div className="w-10 h-10 border-4 border-stone-200 border-t-[#06C755] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-600 font-medium tracking-widest text-sm">
          {status}
        </p>
      </div>
    </div>
  )
}

export default function LineCallbackPage() {
  return (
    // Suspense 的 fallback 也加上一樣的 UI，避免畫面閃爍
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-stone-200 border-t-[#06C755] rounded-full animate-spin mx-auto"></div>
        </div>
      }
    >
      <LineCallbackHandler />
    </Suspense>
  )
}
