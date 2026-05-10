"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const crypto_1 = __importDefault(require("crypto"));
async function POST(req) {
    try {
        // 取得前端傳來的 code
        const body = await req.json();
        const { code } = body;
        if (!code) {
            return server_1.NextResponse.json({ error: '缺少授權碼' }, { status: 400 });
        }
        // 動態取得目前的網址
        const url = new URL(req.url);
        const redirectUri = `${url.protocol}//${url.host}/tw/callback/line`;
        console.log('====== 🟢 開始執行 LINE 登入流程 ======');
        // 【動作一】跟 LINE 交換 Token
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            client_id: process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || process.env.LINE_CHANNEL_ID || '',
            client_secret: process.env.LINE_CHANNEL_SECRET || '',
        });
        const lineRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams.toString(),
        });
        const tokenData = await lineRes.json();
        if (!tokenData.id_token) {
            console.error('🔴 [LINE API 錯誤]', tokenData);
            throw new Error('無法取得 LINE id_token');
        }
        // 【動作二】解析 JWT 拿出 Email 和 姓名
        const payloadBase64 = tokenData.id_token.split('.')[1];
        const decodedPayload = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const userInfo = JSON.parse(decodedPayload);
        console.log('1. 成功取得 LINE 使用者:', userInfo.email || `line_${userInfo.sub}@tangsong.com.tw`);
        // 萬一客人沒綁 Email，給他一個假的綁定用
        const userEmail = userInfo.email || `line_${userInfo.sub}@tangsong.com.tw`;
        const userName = userInfo.name || 'LINE 使用者';
        // 【動作三】產生這支帳號專屬的密碼
        const generatedPassword = crypto_1.default
            .createHmac('sha256', process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'kesh_secret')
            .update(`LINE_${userInfo.sub}`)
            .digest('hex')
            .substring(0, 16) + "Aa1!";
        const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
        const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
        let medusaToken = '';
        console.log(`2. 嘗試登入 Medusa...`);
        // 1. 嘗試登入
        const loginRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': API_KEY },
            body: JSON.stringify({ email: userEmail, password: generatedPassword })
        });
        if (loginRes.ok) {
            console.log('🟢 登入成功！(舊會員)');
            const loginData = await loginRes.json();
            medusaToken = loginData.token;
        }
        else {
            console.log('🟡 找不到此用戶，啟動註冊流程...');
            // 步驟 A: 註冊 Auth Identity
            const authRegisterRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': API_KEY },
                body: JSON.stringify({ email: userEmail, password: generatedPassword })
            });
            if (!authRegisterRes.ok)
                throw new Error('Medusa Auth 註冊失敗');
            const authData = await authRegisterRes.json();
            // 步驟 B: 建立 Customer 實體
            const customerRes = await fetch(`${BACKEND_URL}/store/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-publishable-api-key': API_KEY,
                    'Authorization': `Bearer ${authData.token}`
                },
                body: JSON.stringify({
                    email: userEmail,
                    first_name: userName, // 👑 存入 LINE 的名稱
                    last_name: ' ',
                    // 👑 關鍵：把大頭貼存進 metadata 裡面！
                    metadata: {
                        avatar_url: userInfo.picture || "",
                        provider: "line"
                    }
                })
            });
            if (!customerRes.ok)
                throw new Error('Medusa Customer 建立失敗');
            // 步驟 C: 重新登入取得最終 Token
            const finalLoginRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': API_KEY },
                body: JSON.stringify({ email: userEmail, password: generatedPassword })
            });
            if (!finalLoginRes.ok)
                throw new Error('Medusa 最終登入失敗');
            const finalLoginData = await finalLoginRes.json();
            medusaToken = finalLoginData.token;
        }
        console.log('====== 🟢 LINE 登入流程完美結束 ======');
        return server_1.NextResponse.json({ token: medusaToken });
    }
    catch (error) {
        console.error('🔴 錯誤:', error);
        return server_1.NextResponse.json({ error: error.message || '處理失敗' }, { status: 500 });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUdBLG9CQWdJQztBQW5JRCx3Q0FBMkM7QUFDM0Msb0RBQTRCO0FBRXJCLEtBQUssVUFBVSxJQUFJLENBQUMsR0FBWTtJQUNyQyxJQUFJLENBQUM7UUFDSCxlQUFlO1FBQ2YsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUIsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztRQUV0QixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDVixPQUFPLHFCQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUVELFlBQVk7UUFDWixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsTUFBTSxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxLQUFLLEdBQUcsQ0FBQyxJQUFJLG1CQUFtQixDQUFDO1FBRXBFLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUUvQyx1QkFBdUI7UUFDdkIsTUFBTSxXQUFXLEdBQUcsSUFBSSxlQUFlLENBQUM7WUFDdEMsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxJQUFJLEVBQUUsSUFBSTtZQUNWLFlBQVksRUFBRSxXQUFXO1lBQ3pCLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLDJCQUEyQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxJQUFJLEVBQUU7WUFDdkYsYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLElBQUksRUFBRTtTQUNyRCxDQUFDLENBQUM7UUFFSCxNQUFNLE9BQU8sR0FBRyxNQUFNLEtB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