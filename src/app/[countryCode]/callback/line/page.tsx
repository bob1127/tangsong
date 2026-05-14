"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
// 🚀 直接共用剛剛寫好的 Server Action，用來把 Token 存進 Cookie
import { setLoginState } from "../google/actions"

function LineCallbackHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [status, setStatus] = useState("正在驗證 LINE 授權...")
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const verifyLogin = async () => {
      const code = searchParams.get("code")
      const error = searchParams.get("error")
      const state = searchParams.get("state") // 通常 LINE 會回傳 state 以防 CSRF 攻擊

      console.log("🟢 [LINE 除錯] 1. 啟動驗證流程，參數:", {
        code: code ? "已取得" : "無",
        error,
        state,
      })

      if (error) {
        if (isMounted) {
          setStatus("🔴 LINE 授權失敗或取消")
          setDebugInfo(`LINE 回傳錯誤代碼: ${error}`)
        }
        return
      }

      if (!code) {
        if (isMounted) {
          setStatus("🔴 授權失敗或您取消了登入。")
          setDebugInfo("網址列中沒有發現 code 參數。")
        }
        return
      }

      try {
        if (isMounted)
          setStatus("🟢 2. 正在為您同步會員資料 (發送至 /api/auth/line)...")

        console.log(
          "🟢 [LINE 除錯] 2. 準備 POST /api/auth/line，夾帶 code:",
          code.substring(0, 10) + "..."
        )

        // 🚀 關鍵改變：這裡直接打給我們「自己寫的 Next.js API」，把 code 交給它處理
        const res = await fetch("/api/auth/line", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        })

        const data = await res.json()
        console.log("🟢 [LINE 除錯] 3. 收到 API 回應狀態碼:", res.status)

        if (!res.ok) {
          // API 回傳非 200 狀態碼
          if (isMounted) {
            setStatus(`🔴 API 驗證失敗 (狀態碼: ${res.status})`)
            setDebugInfo(data.error || JSON.stringify(data, null, 2))
            console.error("❌ [LINE 除錯] API 錯誤內容:", data)
          }
          return
        }

        if (data.token) {
          console.log(
            "✅ [LINE 除錯] 4. 成功取得 Medusa Token！準備寫入 Cookie 並跳轉..."
          )
          if (isMounted) setStatus("✅ 登入成功！正在進入會員中心...")

          // 拿到 API 幫我們千辛萬苦生出來的 Medusa Token，存入 Cookie
          await setLoginState(data.token)
          // 大功告成，導回會員首頁！
          window.location.href = "/account"
        } else {
          // API 回傳 200，但沒有 token 欄位
          if (isMounted) {
            setStatus("🔴 登入失敗：未取得通行證")
            setDebugInfo(JSON.stringify(data, null, 2))
            console.error("❌ [LINE 除錯] 缺少 Token:", data)
          }
        }
      } catch (error: any) {
        if (isMounted) {
          setStatus("🔴 網路連線異常，或 API 執行崩潰。")
          setDebugInfo(error.message || error.toString())
          console.error("❌ [LINE 除錯] 嚴重例外錯誤:", error)
        }
      }
    }

    verifyLogin()

    return () => {
      isMounted = false
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center font-sans p-4">
      <div className="text-center max-w-2xl w-full">
        {/* 如果沒有發生錯誤，就顯示 LINE 綠色風格的載入圈圈 */}
        {!debugInfo && (
          <div className="w-10 h-10 border-4 border-stone-200 border-t-[#06C755] rounded-full animate-spin mx-auto mb-4"></div>
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
              ⚠️ 攔截到錯誤 (LINE Debug Mode)
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
              <p className="mt-1">
                👉 如果發生錯誤，請檢查你的前端專案中{" "}
                <code>/api/auth/line/route.ts</code> 這支 API 是否正常運作。
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => router.push("/account/login")}
                className="px-6 py-2 bg-[#06C755] text-white rounded text-sm hover:bg-[#05b34c] transition-colors"
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
