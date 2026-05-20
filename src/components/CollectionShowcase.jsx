"use client"

import React, { useRef } from "react"
import Image from "next/image"
import Link from "next/link"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

// 引用外部 Carousel
import Carousel from "../components/EmblaCarousel06/index.jsx"

gsap.registerPlugin(ScrollTrigger)

// ==========================================
// 1. 單一繁中語系內容
// ==========================================
const content = {
  headerTitle: "CURATION",
  headerSub: "(STYLE)",
  headerTag: "深耕在地十餘年 口碑與誠信的傳承",
  headerDesc:
    "唐宋珠寶深耕在地十餘年，始終堅持提供顧客高價收購與公開透明的交易流程。每一件商品，我們都會詳細說明，讓您清楚了解成色、價格與評估方式，有不明白想了解的，都會為您解答。一路走來，憑藉著老顧客的支持與口碑介紹，讓我們持續服務至今。誠摯邀請您，給我們一個為您服務的機會。",
  tagFeatured: "唐宋珠寶",
  btnReadMore: "DISCOVER MORE",
  cases: [
    {
      id: "style-01",
      caseNumber: "STYLE 01",
      role: "TIMELESS CLASSIC",
      name: "經典傳承",
      description: "為什麼經典包款永遠是無可取代的選擇？",
      image: "/images/e48dcfbd-a446-4d95-98e0-1e92f6a16047.png",
      blockTitle: "「安心滿意」的收購流程",
      blockDesc:
        "我們提供最標準化且透明的五步驟，讓您的每一件珍藏都能獲得最公正的評估。",
      customProducts: [
        {
          id: "prod_01",
          title: "現場初步檢視",
          slug: "step-1",
          price: "進店後先為您的商品進行分類與基本檢查。",
          image: "/images/現場初步檢視.jpg",
          stepNum: "步驟 1",
        },
        {
          id: "prod_02",
          title: "專業儀器鑑定",
          slug: "step-2",
          price: "使用精密儀器檢測成色，為您提供初步估價。",
          image: "/images/專業儀器鑑定.jpg",
          stepNum: "步驟 2",
        },
        {
          id: "prod_03",
          title: "秤重確認價格",
          slug: "step-3",
          price: "詳細說明估價方式，您覺得合理再進行下一步。",
          image: "/images/秤重確認價格.jpg",
          stepNum: "步驟 3",
        },
        {
          id: "prod_04",
          title: "精準成色檢測",
          slug: "step-4",
          price: "若需進一步確認，會進行熔融檢測，取得更準確成色 (必要時)。",
          image: "/images/精準成色檢測.jpg",
          stepNum: "步驟 4",
        },
        {
          id: "prod_05",
          title: "完成交易",
          slug: "step-5",
          price: "確認最終成色與價格後，當場以現金或匯款完成交易。",
          image:
            "https://images.pexels.com/photos/33175648/pexels-photo-33175648.jpeg",
          stepNum: "步驟 5",
        },
      ],
    },
    {
      id: "style-02",
      caseNumber: "STYLE 02",
      role: "URBAN ELEGANCE",
      name: "都會奢華",
      description: " ",
      image: "/images/18e59f52-18b7-413b-a783-ff21e3c51ad3.png",
      blockTitle: "科學儀器精準檢測-純度價值透明呈現",
      blockDesc:
        "在交易黃金與 K 金時，最重要的是「純度」與「透明」。本店特別引進專業級檢測設備，能迅速、準確分析飾品成分，不僅判定純度精準，還能完整呈現含金比例。全程為非破壞式檢測，不會損傷您的珠寶與飾品，讓您在確認價值的同時，依然能保存原貌。十多年來，我們始終秉持誠信經營的理念，杜絕憑肉眼估價的不透明流程。所有價格公開、公平，檢測數據當場呈現，沒有任何隱藏費用，讓您在交易過程中感受最真誠的保障。",
      // 🚀 這裡放置 STYLE 02 專屬的大圖路徑
      bigImage: "/images/Photoroom_20260422_115847.jpg.webp",
    },
  ],
}

export default function CollectionShowcase() {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      const images = gsap.utils.toArray(".parallax-img-wrapper")
      images.forEach((img) => {
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
      })
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="w-full bg-white text-black font-sans"
    >
      {/* 頂部標題 */}
      <div className="w-full pt-28 pb-5 md:pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-widest flex items-start justify-center gap-1 mb-2">
            {content.headerTitle}
            <span className="text-[15px] lg:text-[15px] font-bold mt-2 tracking-normal uppercase">
              {content.headerSub}
            </span>
          </h2>
          <p className="text-sm md:text-base font-bold tracking-[0.2em] uppercase">
            {content.headerTag}
          </p>
        </div>
        <p className="text-[12px] md:text-[14px] text-gray-700 leading-[2.5] tracking-[0.15em] whitespace-pre-line max-w-3xl">
          {content.headerDesc}
        </p>
      </div>
    </section>
  )
}
