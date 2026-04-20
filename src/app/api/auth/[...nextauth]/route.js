"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = exports.GET = void 0;
const next_auth_1 = __importDefault(require("next-auth"));
const google_1 = __importDefault(require("next-auth/providers/google"));
const handler = (0, next_auth_1.default)({
    providers: [
        (0, google_1.default)({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        // 當客人用 Google 登入成功時，會觸發這裡
        async signIn({ user, account, profile }) {
            console.log("🎉 Google 登入成功！客人的 Email 是:", user.email);
            // 未來我們要在這裡寫一段 fetch 呼叫 Medusa 後端的 API
            // 告訴 Medusa：「幫這個 email 註冊/登入，並給我 session！」
            return true; // 先回傳 true 讓 NextAuth 知道登入授權沒問題
        },
    }
});
exports.GET = handler;
exports.POST = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwREFBZ0M7QUFDaEMsd0VBQXVEO0FBRXZELE1BQU0sT0FBTyxHQUFHLElBQUEsbUJBQVEsRUFBQztJQUN2QixTQUFTLEVBQUU7UUFDVCxJQUFBLGdCQUFjLEVBQUM7WUFDYixRQUFRLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBMEI7WUFDaEQsWUFBWSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQThCO1NBQ3pELENBQUM7S0FDSDtJQUNELE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWU7SUFDbkMsU0FBUyxFQUFFO1FBQ1QsMEJBQTBCO1FBQzFCLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtZQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUV0RCxzQ0FBc0M7WUFDdEMsMkNBQTJDO1lBRTNDLE9BQU8sSUFBSSxDQUFBLENBQUMsZ0NBQWdDO1FBQzlDLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQTtBQUdrQixzQkFBRztBQUFhLHVCQUFJIn0=