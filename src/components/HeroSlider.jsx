"use client"

import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"

// 💡 註冊 CustomEase
gsap.registerPlugin(CustomEase)

// 💡 可以在這裡替換成你自己的圖片與文字
const SLIDES_DATA = [
  {
    title: "Field Unit",
    description: "Concept Art",
    image:
      "https://i.pinimg.com/736x/b3/4a/75/b34a750d71edf029154c788a96299b7e.jpg",
  },
  {
    title: "Astral Convergence",
    description: "Soundscape",
    image:
      "https://i.pinimg.com/1200x/6a/ba/93/6aba9332377f676cc0c13636b1319ced.jpg",
  },
  // 可以自由新增更多幻燈片...
]

export default function InfiniteVerticalSlider() {
  const containerRef = useRef(null)
  const sliderRef = useRef(null)
  const mainImageContainerRef = useRef(null)
  const titleContainerRef = useRef(null)
  const descriptionContainerRef = useRef(null)
  const counterContainerRef = useRef(null)

  // 狀態追蹤 (使用 useRef 避免觸發 React 重新渲染而打斷動畫)
  const currentSlideRef = useRef(1)
  const isAnimatingRef = useRef(false)
  const autoplayTimerRef = useRef(null) // 💡 新增：用來儲存自動輪播的計時器 ID

  useEffect(() => {
    const totalSlides = SLIDES_DATA.length

    // 建立 CustomEase 曲線
    CustomEase.create("sliderEase", ".87,0,.13,1")

    function createSlide(slideNumber, direction) {
      const slide = document.createElement("div")
      slide.className = "slide"

      const slideBgImg = document.createElement("div")
      slideBgImg.className = "slide-bg-img"

      const img = document.createElement("img")
      img.src = SLIDES_DATA[slideNumber - 1].image
      img.alt = ""

      slideBgImg.appendChild(img)
      slide.appendChild(slideBgImg)

      if (direction === "down") {
        slideBgImg.style.clipPath =
          "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
      } else {
        slideBgImg.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      }

      return slide
    }

    function createMainImageWrapper(slideNumber, direction) {
      const wrapper = document.createElement("div")
      wrapper.className = "slide-main-img-wrapper"

      const img = document.createElement("img")
      img.src = SLIDES_DATA[slideNumber - 1].image
      img.alt = ""

      wrapper.appendChild(img)

      if (direction === "down") {
        wrapper.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      } else {
        wrapper.style.clipPath =
          "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)"
      }

      return wrapper
    }

    function createTextElements(slideNumber, direction) {
      const newTitle = document.createElement("h1")
      newTitle.textContent = SLIDES_DATA[slideNumber - 1].title
      gsap.set(newTitle, { y: direction === "down" ? 50 : -50 })

      const newDescription = document.createElement("p")
      newDescription.textContent = SLIDES_DATA[slideNumber - 1].description
      gsap.set(newDescription, { y: direction === "down" ? 20 : -20 })

      const newCounter = document.createElement("p")
      newCounter.textContent = slideNumber
      gsap.set(newCounter, { y: direction === "down" ? 18 : -18 })

      return { newTitle, newDescription, newCounter }
    }

    function animateSlide(direction) {
      if (isAnimatingRef.current) return

      isAnimatingRef.current = true

      const currentSlideElement = sliderRef.current.querySelector(".slide")
      const currentMainWrapper = mainImageContainerRef.current.querySelector(
        ".slide-main-img-wrapper"
      )
      const currentTitle = titleContainerRef.current.querySelector("h1")
      const currentDescription =
        descriptionContainerRef.current.querySelector("p")
      const currentCounter = counterContainerRef.current.querySelector("p")

      if (direction === "down") {
        currentSlideRef.current =
          currentSlideRef.current === totalSlides
            ? 1
            : currentSlideRef.current + 1
      } else {
        currentSlideRef.current =
          currentSlideRef.current === 1
            ? totalSlides
            : currentSlideRef.current - 1
      }

      const newSlide = createSlide(currentSlideRef.current, direction)
      const newMainWrapper = createMainImageWrapper(
        currentSlideRef.current,
        direction
      )
      const { newTitle, newDescription, newCounter } = createTextElements(
        currentSlideRef.current,
        direction
      )

      sliderRef.current.appendChild(newSlide)
      mainImageContainerRef.current.appendChild(newMainWrapper)
      titleContainerRef.current.appendChild(newTitle)
      descriptionContainerRef.current.appendChild(newDescription)
      counterContainerRef.current.appendChild(newCounter)

      gsap.set(newMainWrapper.querySelector("img"), {
        y: direction === "down" ? "-50%" : "50%",
      })

      const tl = gsap.timeline({
        onComplete: () => {
          ;[
            currentSlideElement,
            currentMainWrapper,
            currentTitle,
            currentDescription,
            currentCounter,
          ].forEach((el) => el?.remove())
          isAnimatingRef.current = false
        },
      })

      // 執行动畫
      tl.to(
        newSlide.querySelector(".slide-bg-img"),
        {
          clipPath:
            direction === "down"
              ? "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)"
              : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.25,
          ease: "sliderEase",
        },
        0
      )
        .to(
          currentSlideElement.querySelector("img"),
          { scale: 1.5, duration: 1.25, ease: "sliderEase" },
          0
        )
        .to(
          newMainWrapper,
          {
            clipPath:
              direction === "down"
                ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                : "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
            duration: 1.25,
            ease: "sliderEase",
          },
          0
        )
        .to(
          currentMainWrapper.querySelector("img"),
          {
            y: direction === "down" ? "50%" : "-50%",
            duration: 1.25,
            ease: "sliderEase",
          },
          0
        )
        .to(
          newMainWrapper.querySelector("img"),
          { y: "0%", duration: 1.25, ease: "sliderEase" },
          0
        )
        .to(
          currentTitle,
          {
            y: direction === "down" ? -50 : 50,
            duration: 1.25,
            ease: "sliderEase",
          },
          0
        )
        .to(newTitle, { y: 0, duration: 1.25, ease: "sliderEase" }, 0)
        .to(
          currentDescription,
          {
            y: direction === "down" ? -20 : 20,
            duration: 1.25,
            ease: "sliderEase",
          },
          0
        )
        .to(newDescription, { y: 0, duration: 1.25, ease: "sliderEase" }, 0)
        .to(
          currentCounter,
          {
            y: direction === "down" ? -18 : 18,
            duration: 1.25,
            ease: "sliderEase",
          },
          0
        )
        .to(newCounter, { y: 0, duration: 1.25, ease: "sliderEase" }, 0)
    }

    // 💡 啟動自動輪播 (設定為每 4 秒切換一次，可自行更改 4000 這個數字)
    const startAutoplay = () => {
      autoplayTimerRef.current = setInterval(() => {
        animateSlide("down") // 固定向下自動播放
      }, 4000)
    }

    startAutoplay()

    // 💡 Cleanup: 離開元件時清除計時器，防止 Memory Leak
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="exo-slider-wrapper" ref={containerRef}>
      <style>{`
        .exo-slider-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "TWK Lausanne", sans-serif;
          overflow: hidden;
          background: #000;
        }

        .exo-slider-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform;
        }

        .exo-slider-wrapper nav {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          padding: 3em;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 20;
          pointer-events: none;
        }

        .exo-slider-wrapper nav p,
        .exo-slider-wrapper nav .logo {
          color: #fff;
          font-size: 15px;
          font-weight: 300;
          pointer-events: auto;
        }

        .exo-slider-wrapper .nav-items {
          display: flex;
          gap: 2em;
        }

        .exo-slider-wrapper footer {
          position: absolute;
          bottom: 0; left: 0;
          width: 100%;
          padding: 3em;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 20;
          pointer-events: none;
        }

        .exo-slider-wrapper footer p {
          color: #fff;
          font-size: 15px;
          font-weight: 300;
        }

        .exo-slider-wrapper .slider-counter {
          display: flex;
          pointer-events: auto;
        }

        .exo-slider-wrapper .slider-counter p,
        .exo-slider-wrapper .slider-counter > div {
          width: 24px;
          display: flex;
          justify-content: center;
        }

        .exo-slider-wrapper .slider-counter p {
          opacity: 0.35;
        }

        .exo-slider-wrapper .count {
          position: relative;
          height: 18px;
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }

        .exo-slider-wrapper .count p {
          position: absolute;
          transform: translateY(0px);
          font-size: 16px;
          line-height: 1;
          will-change: transform;
          opacity: 1;
        }

        .exo-slider-wrapper .slider {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .exo-slider-wrapper .slide {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
        }

        .exo-slider-wrapper .slide-bg-img {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
          will-change: clip-path;
        }

        .exo-slider-wrapper .slide-bg-img:after {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          display: block;
          background-color: rgba(0, 0, 0, 0.25);
        }

        .exo-slider-wrapper .slide-main-img {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 25%;
          height: 50%;
          z-index: 10;
        }

        .exo-slider-wrapper .slide-main-img-wrapper {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
          will-change: clip-path;
        }

        .exo-slider-wrapper .slide-copy {
          position: absolute;
          top: 50%; left: 30%;
          transform: translate(-50%, -50%);
          color: #fff;
          z-index: 10;
          pointer-events: none;
        }

        .exo-slider-wrapper .slide-title {
          position: relative;
          width: 500px;
          height: 60px;
          margin-bottom: 0.75em;
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }

        .exo-slider-wrapper .slide-title h1 {
          position: absolute;
          color: #fff;
          font-size: 48px;
          font-weight: 400;
          line-height: 1.1;
          margin: 0;
          transform: translateY(0px);
          will-change: transform;
        }

        .exo-slider-wrapper .slide-description {
          position: relative;
          width: 500px;
          height: 25px;
          clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
        }

        .exo-slider-wrapper .slide-description p {
          position: absolute;
          color: #fff;
          font-size: 18px;
          font-weight: 300;
          line-height: 1;
          margin: 0;
          transform: translateY(0px);
          will-change: transform;
        }

        @media (max-width: 900px) {
          .exo-slider-wrapper .slide-main-img {
            width: 75%;
          }
          .exo-slider-wrapper .slide-copy {
            top: 60%;
            left: 50%;
            width: 80%;
            text-align: center;
          }
          .exo-slider-wrapper .slide-title, 
          .exo-slider-wrapper .slide-description {
            width: 100%;
          }
          .exo-slider-wrapper .slide-title h1, 
          .exo-slider-wrapper .slide-description p {
            width: 100%;
          }
        }
      `}</style>

      <nav>
        <div className="logo"></div>
        <div className="nav-items"></div>
      </nav>

      <footer>
        <p>All Projects</p>
        <div className="slider-counter" ref={counterContainerRef}>
          <div className="count">
            <p>1</p>
          </div>
          <p>/</p>
          <p>{SLIDES_DATA.length}</p>
        </div>
      </footer>

      {/* 背景圖片區 */}
      <div className="slider" ref={sliderRef}>
        <div className="slide">
          <div className="slide-bg-img">
            <img src={SLIDES_DATA[0].image} alt="" />
          </div>
        </div>
      </div>

      {/* 中央主圖區 */}
      <div className="slide-main-img" ref={mainImageContainerRef}>
        <div className="slide-main-img-wrapper">
          <img src={SLIDES_DATA[0].image} alt="" />
        </div>
      </div>

      {/* 左側文字區 */}
      <div className="slide-copy">
        <div className="slide-title" ref={titleContainerRef}>
          <h1>{SLIDES_DATA[0].title}</h1>
        </div>
        <div className="slide-description" ref={descriptionContainerRef}>
          <p>{SLIDES_DATA[0].description}</p>
        </div>
      </div>
    </div>
  )
}
