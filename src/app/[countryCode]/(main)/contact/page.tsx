import { Metadata } from "next"

export const metadata: Metadata = {
  title: "聯絡唐宋珠寶 | 台北龍山寺對面老字號",
  description:
    "唐宋珠寶銀樓位於萬華龍山寺對面，提供黃金收購、珠寶翻新與專業諮詢。歡迎預約諮詢。",
}

export default function ContactPage() {
  // 用戶提供的圖片路徑
  const contactImage = "/images/contact/contact.jpg"
  // 用戶提供的 LINE QR Code 圖片路徑 (需確保此圖片存在於 public/images/contact/ 中)
  const lineQRCodeImage = "/images/contact/line-qr.png"

  return (
    <div className=" marker:">
      {/* 👑 主佈局格線：左形象圖 + 右表單 */}
      <div className="  mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr]  ">
        {/* 右欄：互動表單區塊 */}
        <div className="flex flex-col p-5 lg:p-16 mxa-w-[1400px] sm:w-[90%] w-full lg:w-[80%] mx-auto ">
          <div className="flex flex-col items-center text-center mb-10">
            <h3 className="text-3xl font-serif text-[#5A1216] tracking-[0.2em] mb-4 font-bold">
              與我們聯繫 / 預約諮詢
            </h3>
            <p className="text-sm text-[#5A1216]/60 tracking-widest leading-relaxed">
              填寫下方表單，不論是珠寶翻修、舊金換新、或是高價回收估價，我們將儘快與您聯繫。
            </p>
          </div>

          <form className="flex flex-col w-full gap-y-6">
            <div className="flex flex-col w-full gap-y-4">
              {/* 1. 姓名 */}
              <div className="space-y-1">
                <label className="text-sm tracking-widest text-[#5A1216]/70">
                  姓名
                </label>
                <input
                  name="full_name"
                  type="text"
                  required
                  className="w-full border-b border-gray-300 py-3 text-lg tracking-widest focus:border-[#D4AF37] outline-none transition-colors"
                />
              </div>

              {/* 2. 電子郵件 */}
              <div className="space-y-1">
                <label className="text-sm tracking-widest text-[#5A1216]/70">
                  電子郵件
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full border-b border-gray-300 py-3 text-lg tracking-widest focus:border-[#D4AF37] outline-none transition-colors"
                />
              </div>

              {/* 3. 電話 */}
              <div className="space-y-1">
                <label className="text-sm tracking-widest text-[#5A1216]/70">
                  電話
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="w-full border-b border-gray-300 py-3 text-lg tracking-widest focus:border-[#D4AF37] outline-none transition-colors"
                />
              </div>

              {/* 4. 諮詢項目下拉選單 */}
              <div className="space-y-1">
                <label className="text-sm tracking-widest text-[#5A1216]/70">
                  諮詢項目
                </label>
                <select
                  name="subject"
                  required
                  defaultValue=""
                  className="w-full border-b border-gray-300 py-3 text-lg tracking-widest text-[#5A1216] focus:border-[#D4AF37] outline-none transition-colors bg-transparent appearance-none"
                >
                  <option value="" disabled>
                    請選擇諮詢類別
                  </option>
                  <option value="黃金買賣/回收">黃金買賣 / 回收估價</option>
                  <option value="珠寶翻新/修改">珠寶翻新 / 修改服務</option>
                  <option value="舊金換新">舊金換新 (每錢換新)</option>
                  <option value="珠寶鑑定/諮詢">珠寶鑑定 / 諮詢</option>
                  <option value="預約鑑賞">門市預約鑑賞</option>
                  <option value="其他">其他</option>
                </select>
                {/* 下拉箭頭裝飾 */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* 5. 訊息內容 */}
              <div className="space-y-1">
                <label className="text-sm tracking-widest text-[#5A1216]/70">
                  訊息內容
                </label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full border border-gray-300 p-4 text-base tracking-widest focus:border-[#D4AF37] outline-none transition-colors rounded"
                />
              </div>

              {/* 6. 產品照片上傳功能 */}
              <div className="space-y-2 mt-2">
                <label className="text-sm tracking-widest text-[#5A1216]/70 font-medium">
                  產品照片 (可多選，方便快速估價)
                </label>
                <div className="relative group">
                  <label
                    htmlFor="product-photos"
                    className="flex flex-col items-center justify-center h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white group-hover:border-[#D4AF37] group-hover:bg-[#FDFBF7] transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-[#5A1216]/60 group-hover:text-[#D4AF37]">
                      <svg
                        className="w-10 h-10 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <p className="text-sm">點擊或拖拽上傳照片</p>
                      <p className="text-xs mt-1">PNG, JPG (可上傳多張)</p>
                    </div>
                  </label>
                  <input
                    id="product-photos"
                    name="photos"
                    type="file"
                    multiple
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-10 py-6 bg-[#5A1216] text-white font-bold text-base tracking-[0.3em] hover:bg-[#82111F] transition-all rounded shadow-lg"
            >
              確認發送 / 預約
            </button>
          </form>

          <div className="border-t border-[#D4AF37]/20 mt-12 pt-8 text-center text-sm text-[#5A1216]/60 tracking-widest">
            為您提供最誠信的鑑價與翻修工藝。
          </div>
        </div>
        {/* 左欄：巨大的形象圖區塊 */}
        <div className="relative group overflow-hidden">
          <img
            src={contactImage}
            alt="唐宋珠寶形象圖"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  )
}
