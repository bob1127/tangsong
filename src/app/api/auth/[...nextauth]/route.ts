import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // 當客人用 Google 登入成功時，會觸發這裡
    async signIn({ user, account, profile }) {
      console.log("🎉 Google 登入成功！客人的 Email 是:", user.email)
      
      // 未來我們要在這裡寫一段 fetch 呼叫 Medusa 後端的 API
      // 告訴 Medusa：「幫這個 email 註冊/登入，並給我 session！」
      
      return true // 先回傳 true 讓 NextAuth 知道登入授權沒問題
    },
  }
})

// Next.js App Router 規定的寫法
export { handler as GET, handler as POST }