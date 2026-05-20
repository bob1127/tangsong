// 檔案路徑：src/app/[countryCode]/(main)/contact/ContactForm.tsx
"use client"

import { useState } from "react"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string>("")
  const [isAgreed, setIsAgreed] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("")
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    if (selectedFiles.length + files.length > 5) {
      setFileError("⚠️ 最多只能上傳 5 張照片喔！")
      return
    }

    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setFileError(`⚠️ 照片「${file.name}」超過 5MB，請壓縮後再上傳！`)
        return false
      }
      return true
    })

    setSelectedFiles((prev) => [...prev, ...validFiles])
    e.target.value = ""
  }

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    )
    setFileError("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isAgreed) return

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setFileError("")

    try {
      const formData = new FormData(e.currentTarget)
      selectedFiles.forEach((file) => {
        formData.append("photos", file)
      })

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("發送失敗")

      setSubmitStatus("success")
      ;(e.target as HTMLFormElement).reset()
      setSelectedFiles([])
      setIsAgreed(false)
    } catch (error) {
      console.error(error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 下面這整塊完全是你原本排版好的 UI，一字不差

  return (
    <div className="w-full bg-white font-sans text-[#5A1216] py-16 md:py-24">
      <div className="max-w-[900px] mx-auto px-6">
        {/* ========================================== */}
        {/* 1. 頂部標題區 (完全參照圖片的置中排版) */}
        {/* ========================================== */}
        <div className="flex flex-col items-center text-center mb-12">
          {/* 小裝飾 Icon */}
          <svg
            className="w-6 h-6 text-[#D4AF37] mb-6"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
          </svg>

          <h2 className="text-2xl md:text-3xl font-bold tracking-[0.3em] mb-6 flex items-center gap-4">
            <span className="text-xl md:text-2xl font-light">\</span>
            CONTACT
            <span className="text-xl md:text-2xl font-light">/</span>
          </h2>

          <p className="text-sm tracking-widest text-[#5A1216]/70">
            預約諮詢請透過電話，或填寫下方表單。
          </p>
        </div>

        {/* ========================================== */}
        {/* 2. 電話聯絡區塊 (上下線分隔排版) */}
        {/* ========================================== */}
        <div className="border-y border-[#5A1216]/20 py-8 md:py-10 mb-16 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
          <h3 className="font-bold tracking-widest text-lg">電話預約諮詢</h3>
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 md:w-8 md:h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="text-3xl md:text-4xl font-bold font-mono tracking-wider">
              02-2306-9928 <br></br>0926-216-354
            </span>
          </div>
          <p className="text-xs tracking-widest text-[#5A1216]/60 leading-relaxed text-center md:text-left">
            受理時間：星期一～六 11:00 - 21:00
            <br />
            (除過年及星期日公休)
          </p>
        </div>

        {/* ========================================== */}
        {/* 3. 表單區域 (左側標題 + 右側無邊框底色框) */}
        {/* ========================================== */}
        <h3 className="text-xl font-bold tracking-[0.2em] text-center mb-10">
          線上諮詢表單
        </h3>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-6 md:gap-y-8 max-w-[800px] mx-auto"
        >
          {/* 姓名 */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <div className="w-full md:w-[200px] flex justify-between items-center shrink-0 md:pr-4">
              <label className="text-[15px] font-bold tracking-widest">
                姓名
              </label>
              <span className="bg-[#D4AF37] text-white text-[10px] px-2 py-1 rounded-sm font-bold tracking-widest">
                必須
              </span>
            </div>
            <input
              name="full_name"
              type="text"
              required
              placeholder="(例) 王小明"
              className="w-full bg-[#FDF5E6]/60 p-4 text-[15px] tracking-widest focus:bg-[#FDF5E6] outline-none transition-colors rounded-md border border-transparent focus:border-[#D4AF37]/30"
            />
          </div>

          {/* 電話 */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <div className="w-full md:w-[200px] flex justify-between items-center shrink-0 md:pr-4">
              <label className="text-[15px] font-bold tracking-widest">
                電話號碼
              </label>
              <span className="bg-[#D4AF37] text-white text-[10px] px-2 py-1 rounded-sm font-bold tracking-widest">
                必須
              </span>
            </div>
            <input
              name="phone"
              type="tel"
              required
              placeholder="(例) 0912345678"
              className="w-full bg-[#FDF5E6]/60 p-4 text-[15px] tracking-widest focus:bg-[#FDF5E6] outline-none transition-colors rounded-md border border-transparent focus:border-[#D4AF37]/30"
            />
          </div>

          {/* 電子郵件 */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <div className="w-full md:w-[200px] flex justify-between items-center shrink-0 md:pr-4">
              <label className="text-[15px] font-bold tracking-widest">
                電子郵件
              </label>
              <span className="bg-[#D4AF37] text-white text-[10px] px-2 py-1 rounded-sm font-bold tracking-widest">
                必須
              </span>
            </div>
            <input
              name="email"
              type="email"
              required
              placeholder="(例) mail@example.com.tw"
              className="w-full bg-[#FDF5E6]/60 p-4 text-[15px] tracking-widest focus:bg-[#FDF5E6] outline-none transition-colors rounded-md border border-transparent focus:border-[#D4AF37]/30"
            />
          </div>

          {/* 諮詢項目 */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <div className="w-full md:w-[200px] flex justify-between items-center shrink-0 md:pr-4">
              <label className="text-[15px] font-bold tracking-widest">
                諮詢項目
              </label>
              <span className="bg-[#D4AF37] text-white text-[10px] px-2 py-1 rounded-sm font-bold tracking-widest">
                必須
              </span>
            </div>
            <div className="w-full relative">
              <select
                name="subject"
                required
                defaultValue=""
                className="w-full bg-[#FDF5E6]/60 p-4 text-[15px] tracking-widest focus:bg-[#FDF5E6] outline-none transition-colors rounded-md appearance-none border border-transparent focus:border-[#D4AF37]/30"
              >
                <option value="" disabled className="text-gray-400">
                  請選擇諮詢類別
                </option>
                <option value="黃金買賣/回收">黃金買賣 / 回收估價</option>
                <option value="珠寶翻新/修改">珠寶翻新 / 修改服務</option>
                <option value="舊金換新">舊金換新 (每錢換新)</option>
                <option value="珠寶鑑定/諮詢">珠寶鑑定 / 諮詢</option>
                <option value="預約鑑賞">門市預約鑑賞</option>
                <option value="其他">其他</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#5A1216]/50">
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
          </div>

          {/* 訊息內容 */}
          <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
            <div className="w-full md:w-[200px] flex justify-between items-center md:items-start shrink-0 md:pr-4 md:pt-4">
              <label className="text-[15px] font-bold tracking-widest">
                內容
              </label>
              <span className="bg-[#D4AF37] text-white text-[10px] px-2 py-1 rounded-sm font-bold tracking-widest">
                必須
              </span>
            </div>
            <textarea
              name="message"
              rows={6}
              required
              className="w-full bg-[#FDF5E6]/60 p-4 text-[15px] tracking-widest focus:bg-[#FDF5E6] outline-none transition-colors rounded-md resize-none border border-transparent focus:border-[#D4AF37]/30"
            />
          </div>

          {/* 產品照片上傳 */}
          <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
            <div className="w-full md:w-[200px] flex justify-between items-center md:items-start shrink-0 md:pr-4 md:pt-4">
              <label className="text-[15px] font-bold tracking-widest">
                產品照片
              </label>
              <span className="bg-gray-300 text-white text-[10px] px-2 py-1 rounded-sm font-bold tracking-widest">
                任意
              </span>
            </div>

            <div className="w-full">
              {selectedFiles.length < 5 && (
                <div className="relative group">
                  <label
                    htmlFor="product-photos"
                    className="flex flex-col items-center justify-center h-32 border-2 border-[#5A1216]/10 border-dashed rounded-md cursor-pointer bg-[#FDF5E6]/20 hover:bg-[#FDF5E6]/60 hover:border-[#D4AF37] transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-[#5A1216]/40 group-hover:text-[#D4AF37]">
                      <span className="text-3xl mb-1 font-light">+</span>
                      <p className="text-[13px] tracking-wider font-bold">
                        點擊或拖拽上傳照片
                      </p>
                      <p className="text-[11px] mt-1 tracking-widest">
                        PNG, JPG (最多5張)
                      </p>
                    </div>
                  </label>
                  <input
                    id="product-photos"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}

              {fileError && (
                <p className="text-red-500 text-xs font-bold mt-2 tracking-wider">
                  {fileError}
                </p>
              )}

              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group shadow-sm"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`預覽 ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-[#5A1216] transition-colors"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* 4. 同意條款與送出按鈕 */}
          {/* ========================================== */}
          <div className="mt-10 border-t border-gray-100 pt-10 flex flex-col items-center">
            {/* 隱私權勾選框 */}
            <div
              className="flex items-center gap-3 mb-8 cursor-pointer group"
              onClick={() => setIsAgreed(!isAgreed)}
            >
              <div
                className={`w-5 h-5 border flex items-center justify-center rounded-sm transition-colors ${
                  isAgreed
                    ? "bg-[#5A1216] border-[#5A1216]"
                    : "border-gray-300 group-hover:border-[#5A1216]"
                }`}
              >
                {isAgreed && (
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <p className="text-[13px] tracking-widest text-[#5A1216]/80 select-none">
                我已確認
                <a
                  href="#"
                  className="underline decoration-gray-300 hover:text-[#D4AF37] hover:decoration-[#D4AF37] mx-1 transition-colors"
                >
                  隱私權政策
                </a>
                ，並同意送出資料。
              </p>
            </div>

            {/* 送出按鈕 (未勾選時為淺灰色) */}
            <button
              type="submit"
              disabled={!isAgreed || isSubmitting}
              className={`w-full max-w-[320px] py-4 font-bold text-[15px] tracking-[0.3em] transition-all rounded-md duration-300 ${
                isAgreed && !isSubmitting
                  ? "bg-[#5A1216] text-white shadow-lg hover:bg-[#b62f26] cursor-pointer"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "發送中..." : "確認發送"}
            </button>

            {/* 狀態提示 */}
            <div className="h-8 mt-4 flex items-center justify-center">
              {submitStatus === "success" && (
                <p className="text-green-600 text-sm font-bold tracking-wider animate-in fade-in">
                  ✅ 訊息已成功送出！我們會盡快與您聯繫。
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-[#5A1216] text-sm font-bold tracking-wider animate-in fade-in">
                  ❌ 送出失敗，請稍後再試或直接來電。
                </p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
