"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { setLoginState } from "./actions"

function GoogleCallbackHandler() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("正在同步您的 Google 帳號...")

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
        const targetUrl = `${backendUrl}/auth/customer/google/callback?code=${code}&state=${state}`

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
            const userMeta = decoded.user_metadata || {}

            // 精準抓取 Google 隱藏資料
            const email = userMeta.email || decoded.email
            const fullName = userMeta.name || ""
            const firstName =
              userMeta.given_name || decoded.first_name || "Google"
            const lastName = userMeta.family_name || decoded.last_name || "會員"
            const avatar = userMeta.picture || ""

            if (!email) {
              setStatus("無法取得 Google 信箱，請聯絡客服。")
              return
            }

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
              // 👑 老客戶登入：寫入 Server Cookie 並自動跳轉
              await setLoginState(data.token)
              window.location.href = "/account"
            } else {
              // 🆕 新客戶註冊：背景建檔後自動跳轉
              setStatus("正在為您建立專屬會員檔案...")
              const createRes = await fetch(`${backendUrl}/store/customers`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                  email,
                  first_name: firstName,
                  last_name: lastName,
                  metadata: { avatar_url: avatar, full_name: fullName },
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
        <div className="w-10 h-10 border-4 border-stone-200 border-t-[#5A1216] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-600 font-medium tracking-widest text-sm">
          {status}
        </p>
      </div>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="w-screen h-screen bg-stone-50"></div>}>
      <GoogleCallbackHandler />
    </Suspense>
  )
}
