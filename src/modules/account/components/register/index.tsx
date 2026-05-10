"use client"

import { useActionState, useState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  // 一般表單註冊的 State
  const [message, formAction] = useActionState(signup, null)

  // 社群快速註冊/登入的 State
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

  // ==========================================
  // 1. Google 註冊/登入處理
  // ==========================================
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setErrorMsg("")
    console.log("🟢 [Google Auth] 開始請求授權網址...")

    try {
      const response = await fetch(`${backendUrl}/auth/customer/google`, {
        method: "GET",
        headers: { Accept: "application/json" },
      })

      if (!response.ok) {
        throw new Error(`後端回應錯誤 (狀態碼: ${response.status})`)
      }

      const data = await response.json()
      if (data.location) {
        window.location.href = data.location
      } else {
        throw new Error("後端沒有回傳有效的跳轉網址")
      }
    } catch (error: any) {
      console.error("🔴 [Google Auth] 發生錯誤:", error)
      setErrorMsg(error.message || "無法連接至伺服器，請稍後再試。")
      setIsLoading(false)
    }
  }

  // ==========================================
  // 2. LINE 註冊/登入處理
  // ==========================================
  const handleLineLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/tw/callback/line`
    )
    const state = Math.random().toString(36).substring(7)
    const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid%20email`

    window.location.href = lineAuthUrl
  }

  return (
    <div
      className="max-w-sm flex flex-col items-center w-full"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6 font-bold tracking-wide">
        成為唐宋珠寶會員
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        建立您的唐宋珠寶會員檔案，享受更完善的專屬購物體驗。
      </p>

      {/* 🚨 社群登入的錯誤訊息提示區塊 */}
      {errorMsg && (
        <div className="w-full bg-red-50 text-red-600 border border-red-200 p-3 rounded-md text-sm mb-4 text-center">
          {errorMsg}
        </div>
      )}

      {/* 📝 一般註冊表單 */}
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="名字"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="姓氏"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="電子郵件"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="電話"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="密碼"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>

        <ErrorMessage error={message} data-testid="register-error" />

        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          建立帳戶即表示您同意唐宋珠寶的{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline hover:text-ui-fg-interactive transition-colors"
          >
            隱私權政策
          </LocalizedClientLink>{" "}
          與{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline hover:text-ui-fg-interactive transition-colors"
          >
            服務條款
          </LocalizedClientLink>
          。
        </span>

        {/* 送出按鈕 (加上唐宋品牌紅) */}
        <SubmitButton
          className="w-full mt-6 bg-[#5A1216] hover:bg-[#3A0A0E] text-white"
          data-testid="register-button"
        >
          立即註冊
        </SubmitButton>
      </form>

      {/* ➖ 分隔線 ➖ */}
      <div className="relative w-full my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          {/* 若背景非白色，請將 bg-white 改為對應背景色 */}
          <span className="px-3 bg-white text-stone-400 text-xs tracking-wider">
            或使用社群帳號快速註冊
          </span>
        </div>
      </div>

      {/* 📱 社群快速註冊/登入按鈕區塊 */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={handleLineLogin}
          type="button"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#06C755] hover:bg-[#05b34c] text-white py-3 rounded-lg shadow-sm hover:shadow-md transition-all font-bold tracking-widest text-[14px] disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.996 8.892 9.479 9.619.37.079.873.242.998.555.114.286.074.733.036 1.037l-.146.883c-.046.282-.224 1.096.958.599 1.182-.497 6.38-3.766 8.653-6.398 2.607-3.003 4.022-6.002 4.022-6.295zm-14.444 3.32h-2.909c-.27 0-.489-.22-.489-.489v-4.992c0-.27.22-.489.489-.489.27 0 .489.22.489.489v4.503h2.42c.27 0 .489.22.489.489 0 .27-.22.489-.489.489zm2.49 0h-.977c-.27 0-.489-.22-.489-.489v-4.992c0-.27.22-.489.489-.489h.977c.27 0 .489.22.489.489v4.992c0 .27-.22.489-.489.489zm4.24-3.181l-1.849 2.946c-.056.09-.153.141-.252.141-.013 0-.026 0-.04-.002-.111-.018-.2-.089-.24-.19l-.004-.01v-2.885c0-.27-.22-.489-.489-.489-.27 0-.489.22-.489.489v4.992c0 .12.043.235.118.322.073.084.179.138.293.149.014.001.028.002.042.002.099 0 .195-.043.255-.125l2.063-3.23v3.018c0 .27.22.489.489.489.27 0 .489-.22.489-.489v-4.992c0-.123-.046-.239-.124-.326-.078-.086-.188-.139-.304-.149-.015-.001-.03-.002-.045-.002-.093 0-.184.037-.245.105z" />
          </svg>
          使用 LINE 註冊
        </button>

        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 py-3 rounded-lg shadow-sm hover:shadow transition-all font-bold tracking-widest text-[14px] disabled:opacity-50"
        >
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
          使用 Google 註冊
        </button>
      </div>

      {/* 🚀 切回登入畫面 */}
      <span className="text-center text-ui-fg-base text-small-regular mt-8">
        已經是會員？{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="font-bold text-[#5A1216] hover:text-[#3A0A0E] underline underline-offset-4 transition-colors"
        >
          立即登入
        </button>
      </span>
    </div>
  )
}

export default Register
