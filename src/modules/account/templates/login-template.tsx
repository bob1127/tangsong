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
    <div className="w-full flex justify-center px-8 py-12  ">
      <div className="w-full max-w-md bg-[#FFFDFC] p-8 border border-[#E8E2D9] mx-auto shadow-sm">
        {/* 原本的 Medusa Email 登入/註冊區塊 */}
        {currentView === "sign-in" ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  )
}

export default LoginTemplate
