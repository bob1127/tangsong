"use client"

import { useState, useEffect } from "react"
import { Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default function Footer() {
  const [isHoveringContact, setIsHoveringContact] = useState(false)

  const productCategories = [
    { id: "1", name: "戒指", handle: "rings" },
    { id: "2", name: "項鍊", handle: "necklaces" },
    { id: "3", name: "黃金飾品", handle: "gold" },
    { id: "4", name: "白銀/鑽石", handle: "silver-diamonds" },
    { id: "5", name: "手錶", handle: "watches" },
  ]

  const collections = [
    { id: "c0", title: "關於我們", handle: "/about" },
    { id: "c1", title: "隱私條款", handle: "/privacy" },
    { id: "c2", title: "關於收購/鑒價", handle: "/purchase-process" },
    { id: "c4", title: "專欄文章", handle: "/blog" },
    {
      id: "c3",
      title: "門市",
      handle: "https://maps.app.goo.gl/nte538v4k5nk2aCx8",
    },
  ]

  return (
    <footer className="w-full bg-[#1A1A1A] text-white flex flex-col font-serif relative overflow-hidden">
      <div
        className="relative w-full h-[500px] md:h-[600px] bg-gradient-to-b from-[#2A080A] to-[#1A1A1A] flex flex-col items-center justify-center overflow-hidden cursor-pointer group"
        onMouseEnter={() => setIsHoveringContact(true)}
        onMouseLeave={() => setIsHoveringContact(false)}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden">
          <span className="text-[20vw] font-serif tracking-tighter whitespace-nowrap">
            Contact us.
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <span className="text-[#82111F] text-sm tracking-[0.3em] mb-4 uppercase font-sans">
            Contact
          </span>
          <h2 className="text-3xl md:text-5xl tracking-[0.2em] mb-8 font-serif"></h2>
          <div className="text-sm md:text-base text-gray-400 tracking-widest leading-loose max-w-xl">
            <h3 className="text-3xl">傳承一世福，情繫唐宋</h3>
            <br />
            把最好的留給最愛的，唐宋珠寶，幫您守住傳家寶。
            <br />
            <span className="text-xs mt-2 block">
              (商品交易諮詢、高價收購估價 )
            </span>
          </div>
        </div>

        <div
          className={clx(
            "absolute hidden md:flex items-center justify-center rounded-full border border-white/20 transition-all duration-700 ease-out backdrop-blur-sm",
            isHoveringContact
              ? "w-48 h-48 bg-white/10 scale-110"
              : "w-32 h-32 bg-transparent scale-100",
            "right-[15%] top-1/2 -translate-y-1/2"
          )}
        >
          <div className="flex flex-col items-center transition-all duration-500 transform">
            <span
              className={clx(
                "text-sm tracking-widest transition-opacity duration-300",
                isHoveringContact ? "opacity-100" : "opacity-0"
              )}
            >
              Get in touch
            </span>
            <svg
              className={clx(
                "w-6 h-6 mt-2 transition-transform duration-500",
                isHoveringContact ? "translate-x-2" : "translate-x-0"
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-16 pt-24 pb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8">
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-4 group"
            >
              <div className="w-10 h-10 border border-white/40 rounded-full flex items-center justify-center group-hover:border-[#82111F] transition-colors">
                <span className="font-serif text-xl">唐</span>
              </div>
              <span className="text-2xl md:text-3xl tracking-[0.3em] font-serif group-hover:text-[#82111F] transition-colors">
                唐宋珠寶
              </span>
            </LocalizedClientLink>

            <div className="flex flex-col gap-3 text-sm text-gray-400 tracking-widest font-sans mt-8">
              <div className="text-stone-300 mb-2 leading-relaxed">
                唐宋珠寶銀樓買賣黃金、ｋ金、白金、珠寶鑽石、
                <br />
                提供貴金屬分析，損壞戒指、斷掉項鍊，所有當鋪銀樓不收，不清楚不明白的皆可儀器免費鑑定估價，絕不免強交易。
              </div>

              <a
                href="tel:0223069928"
                className="hover:text-[#82111F] transition-colors flex items-center gap-2"
              >
                Tel: （02）2306-9928
              </a>

              <a
                href="mailto:a0223069928@gmail.com"
                className="hover:text-[#82111F] transition-colors flex items-center gap-2"
              >
                Email: a0223069928@gmail.com
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=台北市萬華區西園路一段166-1號"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#82111F] transition-colors flex items-start gap-2"
              >
                Add: 台北市萬華區西園路一段166-1號
              </a>

              <div className="w-full h-[180px] mt-4 rounded-lg overflow-hidden border border-white/10 opacity-80 hover:opacity-100 transition-opacity duration-300">
                <iframe
                  src="https://maps.google.com/maps?q=台北市萬華區西園路一段166-1號&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* 👇 關鍵修改區：將 lg:w-2/3 改為 lg:w-[55%]，縮小寬度來讓區塊向右推 */}
          <div className="w-full lg:w-[55%] grid grid-cols-1 md:grid-cols-3 gap-12 text-sm tracking-widest font-sans">
            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-serif tracking-[0.2em] mb-4">
                商品種類
              </h3>
              <ul className="flex flex-col gap-4 text-gray-400">
                {productCategories.map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/categories/${c.handle}`}
                      className="hover:text-[#82111F] transition-colors duration-300"
                    >
                      {c.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-serif tracking-[0.2em] mb-4">
                關於我們
              </h3>
              <ul className="flex flex-col gap-4 text-gray-400">
                {collections.map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`${c.handle}`}
                      className="hover:text-[#82111F] transition-colors duration-300"
                    >
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))}
                <li className="mt-4">
                  <LocalizedClientLink
                    href="/blog"
                    className="flex items-center gap-2 hover:text-[#82111F] transition-colors duration-300"
                  >
                    焦點新聞
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-serif tracking-[0.2em] mb-4 text-transparent select-none">
                お知らせ (佔位)
              </h3>
              <ul className="flex flex-col gap-4 text-gray-400">
                <li>
                  <LocalizedClientLink
                    href="/blog"
                    className="hover:text-[#82111F] transition-colors duration-300"
                  >
                    最新消息
                  </LocalizedClientLink>
                </li>

                <li>
                  <LocalizedClientLink
                    href="/contact"
                    className="hover:text-[#82111F] transition-colors duration-300"
                  >
                    聯絡我們
                  </LocalizedClientLink>
                </li>
                <li className="mt-4 flex gap-4">
                  <a
                    target="_blank"
                    href="https://www.facebook.com/profile.php?id=100057131423286"
                    className="hover:text-[#82111F] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                  <a
                    href="https://lin.ee/QiLRhma"
                    target="_blank"
                    className="hover:text-[#82111F] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 3.266 8.845 8.152 9.619.317.068.749.207.859.489.1.258.064.661.031.933l-.158 1.018c-.042.261-.202 1 .878.544 1.079-.456 5.823-3.435 7.848-5.8 1.637-1.921 2.39-3.821 2.39-6.803zm-14.862 3.01h-2.525c-.297 0-.539-.242-.539-.539v-4.992c0-.297.242-.539.539-.539h.821c.297 0 .539.242.539.539v4.171h1.165c.297 0 .539.242.539.539v.821c0 .297-.242.539-.539.539zm2.41-.539c0 .297-.242.539-.539.539h-.821c-.297 0-.539-.242-.539-.539v-4.992c0-.297.242-.539.539-.539h.821c.297 0 .539.242.539.539v4.992zm5.792-2.569c0 .297-.242.539-.539.539h-.985l-1.467 2.128v.441c0 .297-.242.539-.539.539h-.821c-.297 0-.539-.242-.539-.539v-4.992c0-.297.242-.539.539-.539h.821c.297 0 .428.169.539.319l1.467 2.128v-2.447c0-.297.242-.539.539-.539h.821c.297 0 .539.242.539.539v4.992z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full mt-24 pt-8 border-t border-white/10 justify-between items-center gap-4 text-[10px] text-gray-500 tracking-widest font-sans uppercase">
          <div className="flex gap-6">
            <p>
              © {new Date().getFullYear()} TangSong Jewelry Co., Ltd. All
              Rightfffff Reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://www.jeek-webdesign.com.tw/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              Design By Jeek Design
            </a>
            <a
              href="#"
              className="hover:text-[#82111F] transition-colors flex items-center gap-2"
            >
              TangSong{" "}
              <span className="font-serif italic text-white/50">
                Online Shop
              </span>
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
