"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { setLoginState } from "./actions"

function GoogleCallbackHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [status, setStatus] = useState("正在同步您的 Google 帳號...")
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

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
      console.error("❌ [Callback 除錯] JWT 解析失敗:", e)
      return null
    }
  }

  useEffect(() => {
    const verifyLogin = async () => {
      const code = searchParams.get("code")
      const state = searchParams.get("state")
      const error = searchParams.get("error")

      console.log("🟢 [Callback 除錯] 1. 啟動驗證流程，網址參數:", {
        code: code ? "已取得" : "無",
        state,
        error,
      })

      if (error) {
        setStatus("🔴 Google 授權失敗")
        setDebugInfo(`Google 傳回錯誤: ${error}`)
        return
      }

      if (!code) {
        setStatus("🔴 驗證參數遺失，請重新登入。")
        setDebugInfo("網址列中沒有發現 code 參數，無法跟後端換取通行證。")
        return
      }

      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        const targetUrl = `${backendUrl}/auth/customer/google/callback?code=${code}&state=${state}`

        console.log("🟢 [Callback 除錯] 2. 準備打向後端的 API:", targetUrl)

        const res = await fetch(targetUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        })

        const text = await res.text()
        console.log("🟢 [Callback 除錯] 3. 後端回應 HTTP 狀態碼:", res.status)

        // 🚨 如果發生錯誤 (例如 401 Unauthorized)，直接攔截並顯示詳細死因
        if (!res.ok) {
          setStatus(`🔴 後端拒絕了驗證 (狀態碼: ${res.status})`)
          setDebugInfo(
            text || "後端沒有回傳任何錯誤訊息，請檢查後端 Terminal 終端機。"
          )
          console.error("❌ [Callback 除錯] 後端拒絕內容:", text)
          return
        }

        const data = JSON.parse(text)

        if (data.token) {
          console.log("🟢 [Callback 除錯] 4. 成功取得 Token，準備解析...")
          const decoded = parseJwt(data.token) || {}
          const userMeta = decoded.user_metadata || {}

          // 精準抓取 Google 隱藏資料
          const email = userMeta.email || decoded.email
          const fullName = userMeta.name || ""
          const firstName =
            userMeta.given_name || decoded.first_name || "Google"
          const lastName = userMeta.family_name || decoded.last_name || "會員"
          const avatar = userMeta.picture || ""

          console.log("🟢 [Callback 除錯] 5. 解析用戶資料:", {
            email,
            fullName,
          })

          if (!email) {
            setStatus("🔴 無法取得 Google 信箱，請聯絡客服。")
            setDebugInfo("JWT Token 內沒有包含 email 欄位。")
            return
          }

          const headers = {
            Authorization: `Bearer ${data.token}`,
            "x-publishable-api-key": pubKey,
            "Content-Type": "application/json",
          }

          console.log(
            "🟢 [Callback 除錯] 6. 檢查是否為老客戶 (GET /store/customers/me)"
          )
          const meRes = await fetch(`${backendUrl}/store/customers/me`, {
            headers,
          })

          if (meRes.ok) {
            console.log(
              "✅ [Callback 除錯] 7. 老客戶登入成功！準備寫入 Cookie 並跳轉..."
            )
            await setLoginState(data.token)
            window.location.href = "/account"
          } else {
            console.log(
              "🟢 [Callback 除錯] 7. 查無此人，準備新建客戶檔案 (POST /store/customers)"
            )
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
              console.log(
                "✅ [Callback 除錯] 8. 新客戶建檔成功！準備寫入 Cookie 並跳轉..."
              )
              await setLoginState(data.token)
              window.location.href = "/account"
            } else {
              const createError = await createRes.text()
              setStatus("🔴 會員建檔失敗，請重新嘗試。")
              setDebugInfo(`創建客戶 API 回傳錯誤: ${createError}`)
              console.error("❌ [Callback 除錯] 建檔失敗:", createError)
            }
          }
        } else {
          setStatus("🔴 驗證失敗，後端未回傳 Token。")
          setDebugInfo(
            "請檢查後端的 Callback 邏輯是否正常回傳了 { token: '...' }"
          )
        }
      } catch (error: any) {
        setStatus("🔴 連線異常，請稍後再試。")
        setDebugInfo(error.message || error.toString())
        console.error("❌ [Callback 除錯] 發生嚴重例外錯誤:", error)
      }
    }

    verifyLogin()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center font-sans p-4">
      <div className="text-center max-w-2xl w-full">
        {/* 如果沒有發生錯誤，就顯示原本優雅的 Loading 動畫 */}
        {!debugInfo && (
          <div className="w-10 h-10 border-4 border-stone-200 border-t-[#5A1216] rounded-full animate-spin mx-auto mb-4"></div>
        )}

        <p
          className={`font-medium tracking-widest text-sm mb-6 ${
            debugInfo ? "text-red-600 text-lg font-bold" : "text-stone-600"
          }`}
        >
          {status}
        </p>

        {/* 🚨 除錯模式：顯示詳細錯誤訊息 */}
        {debugInfo && (
          <div className="bg-white border-2 border-red-200 p-6 rounded-lg shadow-sm text-left">
            <h2 className="text-red-700 font-bold mb-3 flex items-center gap-2">
              ⚠️ 攔截到錯誤 (Debug Mode)
            </h2>
            <pre className="text-xs text-red-600 overflow-x-auto whitespace-pre-wrap bg-red-50 p-4 rounded border border-red-100">
              {debugInfo}
            </pre>
            <div className="mt-4 text-sm text-stone-600">
              <p>
                👉{" "}
                <strong>
                  請按下鍵盤 F12 打開 Console (主控台) 查看完整執行步驟。
                </strong>
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => router.push("/account")}
                className="px-6 py-2 bg-[#5A1216] text-white rounded text-sm hover:bg-[#b62f26] transition-colors"
              >
                返回登入頁
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 👇👇👇 這個就是 Next.js 報錯說找不到的那個畫面主體，現在乖乖待在 page.tsx 裡了！
export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div className="w-screen h-screen bg-stone-50"></div>}>
      <GoogleCallbackHandler />
    </Suspense>
  )
}
