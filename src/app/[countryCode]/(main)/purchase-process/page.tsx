"use client"

import React, { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

// ==========================================
// TypeScript 型別定義
// ==========================================
interface PurchaseStep {
  step: string
  title: string
  subtitle: string
  desc: string
  image: string
}

interface MeltingHighlight {
  title: string
  desc: string
}

// ==========================================
// 靜態資料區塊
// ==========================================
const purchaseSteps: PurchaseStep[] = [
  {
    step: "01",
    title: "現場初步檢視",
    subtitle: "INITIAL INSPECTION",
    desc: "進店後專人為您的商品進行分類與基本檢查，確認物件的完整度與大方向分類。",
    image: "/images/現場初步檢視.jpg",
  },
  {
    step: "02",
    title: "專業儀器鑑定",
    subtitle: "INSTRUMENT ANALYSIS",
    desc: "使用精密光譜或比重儀器檢測基本成色，不損傷珠寶原貌，為您提供最科學的初步估價。",
    image: "/images/專業儀器鑑定.jpg",
  },
  {
    step: "03",
    title: "精確秤重與報價",
    subtitle: "WEIGHT & PRICING",
    desc: "在您的面前使用經濟部標準檢驗局合格之電子磅秤精確秤重，並依當日公開行情詳細說明估價方式。價格公開透明，您覺得滿意、合理，再進行下一步驟。",
    image: "/images/秤重確認價格.jpg",
  },
  {
    step: "04",
    title: "精準成色檢測 (熔融檢測)",
    subtitle: "MELTING VERIFICATION",
    desc: "針對成分複雜、非標準廠模或老舊金飾，若表面檢測有誤差疑慮，我們會現場進行熔融檢測，將雜質燒除，提煉出最純粹的貴金屬，取得百分之百精準的純度數據。",
    image: "/images/精準成色檢測.jpg",
  },
  {
    step: "05",
    title: "當場現金交易",
    subtitle: "TRANSACTION COMPLETE",
    desc: "確認最終精準成色與金重後，核對身份簽署法定收購簿冊，當場以現金或即時轉帳完成交易，過程俐落且注重隱私。",
    image:
      "https://images.pexels.com/photos/33175648/pexels-photo-33175648.jpeg",
  },
]

const meltingHighlights: MeltingHighlight[] = [
  {
    title: "拒絕傳統銀樓的「扣耗損」黑箱",
    desc: "許多傳統老銀樓不論黃金純度，收購時一律習慣性扣除 3% 到 5% 的重量作為損耗。唐宋珠寶堅持科學誠信，透過熔融將黃金與雜質徹底分離，燒出來剩多少純金就秤多少重量，絕對不憑感覺亂扣顧客一分一毫。",
  },
  {
    title: "釐清表面鍍金與內在純度",
    desc: "現代加工技術高超，部分市售金飾、國外帶回的飾品可能僅表面包金（Gold Plated）或內部灌鉛。熔融檢測能透過高溫瞬間還原金屬本質，是國際貴金屬交易中最公允、最無法造假的終極鑑定手段。",
  },
  {
    title: "保障特殊金飾與老舊飾品的價值",
    desc: "長輩流傳下來的舊金飾、Ｋ金耳環、甚至牙金，常因沒有保單或成色標記模糊而被低估。透過熔融檢測將雜質燒除成純金塊後，不論來源與外觀多老舊，都能立刻變現它真正該有的尊貴價值。",
  },
]

export default function PurchaseProcessPage() {
  const pageRef = useRef<HTMLElement | null>(null)

  useGSAP(
    () => {
      // 步驟區塊的逐個淡入與微移
      const steps = gsap.utils.toArray<HTMLElement>(".step-card")
      steps.forEach((step) => {
        gsap.from(step, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          scrollTrigger: {
            trigger: step,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
        })
      })
    },
    { scope: pageRef }
  )

  return (
    <main
      ref={pageRef}
      className="w-full bg-[#fbfcfd] text-stone-900 font-sans overflow-hidden"
    >
      {/* ================= SECTION 1: 五步驟收購流程 ================= */}
      <section className="w-full max-w-[1400px] mx-auto py-24 px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold tracking-[0.3em] text-[#b62f26] uppercase mb-2">
            THE 5 STEPS
          </h2>
          <p className="text-2xl md:text-3xl font-serif font-bold tracking-widest text-stone-800">
            「安心滿意」的收購流程
          </p>
          <p className="text-xs text-stone-400 mt-2 tracking-widest">
            每一環節都在您的視線內透明進行
          </p>
        </div>

        {/* 時間軸交錯排版 */}
        <div className="relative flex flex-col gap-20 md:gap-32 before:absolute before:top-0 before:bottom-0 before:left-4 md:before:left-1/2 before:w-[1px] before:bg-stone-200">
          {purchaseSteps.map((step, index) => {
            const isEven = index % 2 === 0
            return (
              <div
                key={step.step}
                className={`step-card relative flex flex-col md:flex-row w-full ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-8 md:gap-16`}
              >
                {/* 時間軸中心圓點 */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#b62f26] border-4 border-white shadow-sm z-10" />

                {/* 圖片區 */}
                <div className="w-full md:w-1/2 pl-10 md:pl-0">
                  <div className="relative w-full aspect-[16/10] overflow-hidden rounded-sm shadow-md bg-stone-100 group">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                </div>

                {/* 文字內容區 */}
                <div className="w-full md:w-1/2 pl-10 md:pl-0 flex flex-col justify-center">
                  <div className="max-w-md">
                    <span className="text-4xl md:text-5xl font-serif font-extrabold text-[#b62f26]/20 block mb-2">
                      STEP {step.step}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold tracking-wider text-stone-800 flex items-center gap-3">
                      {step.title}
                    </h3>
                    <span className="text-[10px] font-bold tracking-widest text-stone-400 block mb-4 uppercase">
                      {step.subtitle}
                    </span>
                    <p className="text-xs md:text-sm leading-[2.2] text-stone-600 tracking-wide text-justify">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ================= SECTION 2: 為什麼需要熔融檢測 ================= */}
      <section className="w-full bg-gradient-to-b from-stone-900 to-stone-950 text-white py-24 px-6 lg:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-center">
            {/* 左側：震撼視覺排版 */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <span className="text-xs font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
                SCIENCE & INTEGRITY
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-widest leading-smooth text-[#FDF5E6]">
                為什麼交易需要
                <br />
                「熔融檢測」？
              </h2>
              <div className="w-12 h-[2px] bg-[#b62f26]" />
              <p className="text-xs md:text-sm text-stone-400 leading-[2.3] tracking-widest text-justify">
                傳統銀樓估價常依靠師傅的「肉眼眼力」或「敲擊聽聲」，這往往存在巨大灰色地帶，店家常以「成色不足」為由扣除大量耗損金額。唐宋珠寶引進科學熔融檢測，讓數據說話，用客觀事實捍衛您的財產權益。
              </p>
            </div>

            {/* 右側：三大科普優勢列表 */}
            <div className="lg:col-span-3 flex flex-col gap-8 md:gap-10">
              {meltingHighlights.map((highlight, index) => (
                <div
                  key={index}
                  className="bg-white/[0.03] border border-white/5 p-6 md:p-8 rounded-sm hover:border-[#D4AF37]/30 transition-all duration-300 group"
                >
                  <div className="flex gap-4 items-start">
                    <span className="text-xl md:text-2xl font-serif font-bold text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity">
                      0{index + 1}
                    </span>
                    <div className="flex flex-col gap-3">
                      <h3 className="text-base md:text-lg font-bold tracking-wider text-[#FDF5E6]">
                        {highlight.title}
                      </h3>
                      <p className="text-xs md:text-sm text-stone-400 leading-[2.2] tracking-wide text-justify">
                        {highlight.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: 誠信保障與線上預約 CTA ================= */}
      <section className="w-full bg-[#f4f5f7] py-20 px-6 text-center border-t border-stone-200">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <h3 className="text-xl md:text-2xl font-serif font-bold tracking-widest text-stone-800">
            想了解您手邊珍藏的即時價值嗎？
          </h3>
          <p className="text-xs md:text-sm text-stone-500 leading-loose tracking-wide">
            歡迎親臨唐宋珠寶台中門市，我們將為您提供最專業、完全免費的成色鑑定與秤重估價服務。絕不強迫交易，流程完全公開。
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <Link
              href="/contact"
              className="bg-[#b62f26] text-white px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#9c241c] transition-colors shadow-md rounded-sm"
            >
              預約親臨現場鑑定
            </Link>
            <Link
              href="/"
              className="bg-white text-stone-800 border border-stone-300 px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-stone-50 transition-colors rounded-sm"
            >
              返回大廳行情表
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
