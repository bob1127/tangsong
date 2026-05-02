"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
// 🚀 直接共用剛剛寫好的 Server Action，不用重寫！
import { setLoginState } from "../google/actions"

function LineCallbackHandler() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("正在同步您的 LINE 帳號...")

  // 解析 JWT Token
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join("")
      )
      return JSON.parse(jsonPayload)
    } catch (e) {
      return null
    }
  }

  useEffect(() => {
    const verifyLogin = async () => {
      const code = searchParams.get("code")
      const state = searchParams.get("state")

      if (!code) {
        setStatus("驗證參數遺失，請重新登入。")
        return
      }

      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

        // 🚀 注意這裡呼叫的是後端 LINE 的 callback API
        const targetUrl = `${backendUrl}/auth/customer/line/callback?code=${code}&state=${state}`

        const res = await fetch(targetUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        })
        const text = await res.text()

        if (res.ok) {
          const data = JSON.parse(text)
          if (data.token) {
            const decoded = parseJwt(data.token) || {}

            // 🚀 LINE 的 Payload 結構解析
            const userMeta = decoded.user_metadata || {}
            const lineId = decoded.sub || userMeta.sub // LINE 給的唯一 ID
            const fullName = userMeta.name || decoded.name || "LINE 會員"
            const avatar = userMeta.picture || decoded.picture || ""

            // ⚠️ 防呆：LINE 用戶不一定會授權 Email，沒授權就用 LINE ID 組合一個假信箱
            const email =
              userMeta.email ||
              decoded.email ||
              `line_${lineId}@tangsong.com.tw`

            const headers = {
              Authorization: `Bearer ${data.token}`,
              "x-publishable-api-key": pubKey,
              "Content-Type": "application/json",
            }

            // 檢查是否為老客戶
            const meRes = await fetch(`${backendUrl}/store/customers/me`, {
              headers,
            })

            if (meRes.ok) {
              // 👑 老客戶登入
              await setLoginState(data.token)
              window.location.href = "/account"
            } else {
              // 🆕 新客戶註冊：背景建檔
              setStatus("正在為您建立專屬會員檔案...")
              const createRes = await fetch(`${backendUrl}/store/customers`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                  email,
                  first_name: fullName, // LINE 通常只給全名，我們直接塞在 first_name
                  last_name: "", // last_name 留空
                  metadata: {
                    avatar_url: avatar,
                    full_name: fullName,
                    provider: "line",
                  },
                }),
              })

              if (createRes.ok) {
                await setLoginState(data.token)
                window.location.href = "/account"
              } else {
                setStatus("會員建檔失敗，請重新嘗試。")
              }
            }
          }
        } else {
          setStatus("驗證失敗，請重試。")
        }
      } catch (error: any) {
        setStatus("連線異常，請稍後再試。")
      }
    }
    verifyLogin()
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
    <Suspense fallback={<div className="w-screen h-screen bg-stone-50"></div>}>
      <LineCallbackHandler />
    </Suspense>
  )
}
