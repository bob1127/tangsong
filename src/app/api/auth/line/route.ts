import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    // 取得前端傳來的 code
    const body = await req.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json({ error: '缺少授權碼' }, { status: 400 });
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
    const generatedPassword = crypto
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
    } else {
       console.log('🟡 找不到此用戶，啟動註冊流程...');
       
       // 步驟 A: 註冊 Auth Identity
       const authRegisterRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass/register`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': API_KEY },
         body: JSON.stringify({ email: userEmail, password: generatedPassword })
       });

       if (!authRegisterRes.ok) throw new Error('Medusa Auth 註冊失敗');
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

       if (!customerRes.ok) throw new Error('Medusa Customer 建立失敗');

       // 步驟 C: 重新登入取得最終 Token
       const finalLoginRes = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-publishable-api-key': API_KEY },
          body: JSON.stringify({ email: userEmail, password: generatedPassword })
       });
       
       if (!finalLoginRes.ok) throw new Error('Medusa 最終登入失敗');
       const finalLoginData = await finalLoginRes.json();
       medusaToken = finalLoginData.token;
    }

    console.log('====== 🟢 LINE 登入流程完美結束 ======');
    return NextResponse.json({ token: medusaToken });

  } catch (error: any) {
    console.error('🔴 錯誤:', error);
    return NextResponse.json({ error: error.message || '處理失敗' }, { status: 500 });
  }
}