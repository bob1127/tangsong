"use client"

import React, { useRef } from "react"
import Image from "next/image"
import Link from "next/link"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

// ==========================================
// 元件專屬內容設定
// ==========================================
const content = {
  caseNumber: "STYLE 02",
  role: "URBAN ELEGANCE",
  name: " ",
  description: " ",
  image: "/images/18e59f52-18b7-413b-a783-ff21e3c51ad3.png",
  blockTitle: "科學儀器精準檢測-純度價值透明呈現",
  blockDesc:
    "在交易黃金與 K 金時，最重要的是「純度」與「透明」。本店特別引進專業級檢測設備，能迅速、準確分析飾品成分，不僅判定純度精準，還能完整呈現含金比例。全程為非破壞式檢測，不會損傷您的珠寶與飾品，讓您在確認價值的同時，依然能保存原貌。十多年來，我們始終秉持誠信經營的理念，杜絕憑肉眼估價的不透明流程。所有價格公開、公平，檢測數據當場呈現，沒有任何隱藏費用，讓您在交易過程中感受最真誠的保障。",
  bigImage: "/images/Photoroom_20260422_115847.jpg.webp",
  tagFeatured: "唐宋珠寶",
  btnReadMore: "DISCOVER MORE",
  href: "/purchase-process", // 若有對應的內頁可以填寫路徑
}

export default function ScientificDetection() {
  const containerRef = useRef(null)

  // 封裝專屬的 GSAP 視差滾動動畫
  useGSAP(
    () => {
      const img = containerRef.current.querySelector(".parallax-img-wrapper")
      if (img) {
        gsap.to(img, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })
      }
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="w-full  bg-white   text-black font-sans"
    >
      {/* 使用 lg:flex-row-reverse 保持與原先陣列中奇數項相同的左右交錯感
        (左圖右文，或是視覺上的左文右圖)
      */}
      <div className="flex w-full h-auto justify-center pb-20 ">
        {/* ================= 資訊展示區 ================= */}
        <div className="w-full lg:w-[50%] h-full overflow-hidden flex flex-col items-center justify-center bg-white z-10 relative py-12 lg:py-0">
          <div className="text-center mb-8 max-w-lg px-4">
            <h3 className="text-[20px] lg:text-[24px] font-bold leading-[1.8] mb-4 whitespace-pre-line text-gray-900 tracking-wider">
              {content.blockTitle}
            </h3>
            <p className="text-[11px] lg:text-[12px] leading-[2.2] text-gray-500 whitespace-pre-line tracking-[0.1em] text-justify">
              {content.blockDesc}
            </p>
            <div className="mt-6 inline-block border border-gray-300 rounded-full px-5 py-1.5">
              <span className="text-[9px] font-bold tracking-[0.15em] text-gray-600 uppercase">
                {content.tagFeatured}
              </span>
            </div>
          </div>

          {/* 大圖展示 */}
          <div className="w-full px-10 md:px-20 mt-4">
            <div className="relative w-full aspect-[16/10] md:aspect-[16/9] overflow-hidden bg-gray-50">
              <Image
                src={content.bigImage}
                alt={content.blockTitle}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
