"use client"

import { useState } from "react"
import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import { Button } from "@medusajs/ui"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  // 💡 未來的 NextAuth 觸發函式 (目前先放著)
  const handleSocialLogin = (provider: string) => {
    // signIn(provider, { callbackUrl: '/account' })
    console.log(`觸發 ${provider} 登入`)
  }

  return (
    <div className="w-full flex justify-center px-8 py-12 bg-[#FAF8F5]">
      <div className="w-full max-w-md bg-[#FFFDFC] p-8 border border-[#E8E2D9] shadow-sm">
        {/* 原本的 Medusa Email 登入/註冊區塊 */}
        {currentView === "sign-in" ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}

        {/* 💡 第三方快速登入區塊 */}
        <div className="mt-8 pt-6 border-t border-[#E8E2D9]">
          <div className="relative flex justify-center text-sm mb-6">
            <span className="px-2 bg-[#FFFDFC] text-[#7A6B5D] font-serif tracking-widest absolute -top-3">
              或使用社群帳號快速登入
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="secondary"
              className="w-full bg-white border border-[#E8E2D9] hover:bg-stone-50 text-[#4A3B32] font-serif tracking-wider h-11"
              onClick={() => handleSocialLogin("google")}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              使用 Google 繼續
            </Button>

            <Button
              variant="secondary"
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white border-none font-serif tracking-wider h-11"
              onClick={() => handleSocialLogin("facebook")}
            >
              <img
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                alt="Facebook"
                className="w-5 h-5 mr-2 brightness-0 invert"
              />
              使用 Facebook 繼續
            </Button>

            <Button
              variant="secondary"
              className="w-full bg-[#06C755] hover:bg-[#05b04c] text-white border-none font-serif tracking-wider h-11"
              onClick={() => handleSocialLogin("line")}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg"
                alt="LINE"
                className="w-5 h-5 mr-2"
              />
              使用 LINE 繼續
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
