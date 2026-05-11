import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// 🚀 核心防呆機制：如果環境變數沒設定金鑰，就塞入假金鑰，確保 npm run build 絕對不會報錯！
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key")

export async function POST(request: Request) {
  try {
    // 1. 取得前端傳過來的 FormData
    const formData = await request.formData()
    const name = formData.get('full_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string
    
    // 2. 處理客人的上傳圖片
    const files = formData.getAll('photos') as File[]
    const attachments = await Promise.all(
      files
        .filter(file => file.size > 0) // 確保檔案不是空的
        .map(async (file) => {
          const arrayBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          return {
            filename: file.name,
            content: buffer,
          }
        })
    )

    // 3. 檢查是否有真實金鑰再發信
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ 尚未設定 RESEND_API_KEY，略過實際寄信動作。")
      console.log(`收到來自 ${name} (${email}) 的表單：${subject}`)
      return NextResponse.json({ success: true, message: "測試環境：表單已模擬送出" })
    }

    // 4. 呼叫 Resend 發送 Email 給老闆
    const { data, error } = await resend.emails.send({
      from: '唐宋珠寶官網表單 <onboarding@resend.dev>', // 測試階段請用 onboarding@resend.dev
      to: ['tangsongzhubao@gmail.com'],
      subject: `【官網新詢問】${subject} - 來自 ${name}`,
      html: `
        <h2>收到新的官網聯絡表單</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>姓名：</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>電話：</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>信箱：</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>諮詢項目：</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${subject}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>內容：</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${message.replace(/\n/g, '<br/>')}</td>
          </tr>
        </table>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">*若客人有上傳照片，將會以附件形式夾帶於此信件中。</p>
      `,
      attachments: attachments, // 把照片塞進附件裡
    })

    if (error) {
      console.error("Resend 寄信錯誤:", error)
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API 處理失敗:", error)
    return NextResponse.json({ error: '內部伺服器錯誤' }, { status: 500 })
  }
}