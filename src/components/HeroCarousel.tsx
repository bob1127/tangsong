"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import gsap from "gsap"
// @ts-ignore: 忽略型別檢查
import { SplitText } from "gsap/SplitText"

// ====== 1. 定義資料型別 (TypeScript Interfaces) ======
export interface SlideData {
  description: string
  type: string
  field: string
  date: string
  leftImage: string
  rightImage: string
}

// ====== 2. 你的圖片與文案設定 ======
// 注意：因為大標題已經固定在中央，這裡的資料只留下副文案
export const slides: SlideData[] = [
  {
    description:
      "傳承百年的工藝精神，將靜謐的力量與永恆的優雅，凝聚於方寸之間。",
    type: "Collection",
    field: "High Jewelry",
    date: "2026",
    leftImage: "/images/001.jpg",
    rightImage: "/images/002.jpg",
  },
  {
    description: "繁複的細節與流動的光影交織，展現無聲卻懾人的尊貴氣場。",
    type: "Editorial",
    field: "Conceptual",
    date: "2026",
    leftImage: "/images/d75e7ae20d037f83012b57261970d779.jpg",
    rightImage: "/images/004.jpg",
  },
]

// ====== 3. WebGL 著色器 (核心特效區) ======
export const vertexShader: string = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const fragmentShader: string = `
  uniform sampler2D uTexLeft1;
  uniform sampler2D uTexLeft2;
  uniform sampler2D uTexRight1;
  uniform sampler2D uTexRight2;
  
  uniform vec2 uTexLeft1Size;
  uniform vec2 uTexLeft2Size;
  uniform vec2 uTexRight1Size;
  uniform vec2 uTexRight2Size;
  
  uniform float uProgress;
  uniform vec2 uResolution;
  varying vec2 vUv;
  
  vec2 getCoverUV(vec2 uv, vec2 resolution, vec2 textureSize) {
    vec2 s = resolution / textureSize;
    float scale = max(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (resolution - scaledSize) * 0.5;
    return (uv * resolution - offset) / scaledSize;
  }
  
  vec2 getDistortedUv(vec2 uv, vec2 direction, float factor) {
    vec2 scaledDirection = direction;
    scaledDirection.y *= 2.0;
    return uv - scaledDirection * factor;
  }
  
  struct LensDistortion {
    vec2 distortedUV;
    float inside;
  };
  
  LensDistortion getLensDistortion(
    vec2 p, vec2 uv, vec2 sphereCenter, float sphereRadius, float focusFactor
  ) {
    vec2 distortionDirection = normalize(p - sphereCenter);
    float focusRadius = sphereRadius * focusFactor;
    float focusStrength = sphereRadius / 3000.0;
    float focusSdf = length(sphereCenter - p) - focusRadius;
    float sphereSdf = length(sphereCenter - p) - sphereRadius;
    float inside = smoothstep(0.0, 1.0, -sphereSdf / (sphereRadius * 0.001));
    
    float magnifierFactor = focusSdf / (sphereRadius - focusRadius);
    float mFactor = clamp(magnifierFactor * inside, 0.0, 1.0);
    mFactor = pow(mFactor, 5.0);
    
    float distortionFactor = mFactor * focusStrength;
    vec2 distortedUV = getDistortedUv(uv, distortionDirection, distortionFactor);
    
    return LensDistortion(distortedUV, inside);
  }
  
  void main() {
    bool isLeft = vUv.x < 0.5;
    
    vec2 halfRes = vec2(uResolution.x * 0.5, uResolution.y);
    vec2 localUv = isLeft ? vec2(vUv.x * 2.0, vUv.y) : vec2((vUv.x - 0.5) * 2.0, vUv.y);
    
    float localProgress = isLeft 
      ? clamp(uProgress * 1.1, 0.0, 1.0) 
      : clamp((uProgress - 0.1) * 1.1, 0.0, 1.0);

    vec2 center = vec2(0.5, 0.5);
    vec2 p = localUv * halfRes;
    vec2 sphereCenter = center * halfRes;
    
    float maxRadius = length(halfRes) * 1.5;
    float bubbleRadius = localProgress * maxRadius;
    float focusFactor = 0.25;
    
    float dist = length(sphereCenter - p);
    float mask = step(bubbleRadius, dist);
    
    vec4 currentImg;
    vec4 newImg;
    LensDistortion distortion;
    
    if (isLeft) {
      vec2 uv1 = getCoverUV(localUv, halfRes, uTexLeft1Size);
      vec2 uv2 = getCoverUV(localUv, halfRes, uTexLeft2Size);
      currentImg = texture2D(uTexLeft1, uv1);
      distortion = getLensDistortion(p, uv2, sphereCenter, bubbleRadius, focusFactor);
      newImg = texture2D(uTexLeft2, distortion.distortedUV);
    } else {
      vec2 uv1 = getCoverUV(localUv, halfRes, uTexRight1Size);
      vec2 uv2 = getCoverUV(localUv, halfRes, uTexRight2Size);
      currentImg = texture2D(uTexRight1, uv1);
      distortion = getLensDistortion(p, uv2, sphereCenter, bubbleRadius, focusFactor);
      newImg = texture2D(uTexRight2, distortion.distortedUV);
    }
    
    float finalMask = max(mask, 1.0 - distortion.inside);
    vec4 color = mix(newImg, currentImg, finalMask);
    
    float line = smoothstep(0.499, 0.5, vUv.x) - smoothstep(0.5, 0.501, vUv.x);
    color.rgb = mix(color.rgb, vec3(1.0), line * 0.15);
    
    gl_FragColor = color;
  }
`

// ====== 4. 主元件 ======
const Slider = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  let currentSlideIndex: number = 0
  let isTransitioning: boolean = false
  let slideTexturesLeft: THREE.Texture[] = []
  let slideTexturesRight: THREE.Texture[] = []
  let shaderMaterial: THREE.ShaderMaterial
  let renderer: THREE.WebGLRenderer

  const createLineElements = (element: Element) => {
    new SplitText(element, { type: "lines", linesClass: "line" })
    element.querySelectorAll(".line").forEach((line) => {
      line.innerHTML = `<span>${line.textContent}</span>`
    })
  }

  const processTextElements = (container: Element) => {
    container
      .querySelectorAll(".slide-description p")
      .forEach(createLineElements)
  }

  const createSlideElement = (slideData: SlideData): HTMLDivElement => {
    const content = document.createElement("div")
    // 這裡補上 Tailwind class，確保動態生成的描述文字會固定在畫面底部
    content.className =
      "slider-content absolute bottom-12 left-0 right-0 z-10 flex flex-col items-center pointer-events-none text-white drop-shadow-lg"
    content.style.opacity = "0"

    content.innerHTML = `
      <div class="slide-description text-center max-w-lg">
        <p class="font-light tracking-wider opacity-90 mb-8">${slideData.description}</p>
        <div class="slide-info flex justify-center gap-6 text-sm opacity-70 uppercase tracking-widest">
          <p>Type. ${slideData.type}</p>
          <p>Field. ${slideData.field}</p>
          <p>Date. ${slideData.date}</p>
        </div>
      </div>
    `
    return content
  }

  const animateSlideTransition = (nextIndex: number) => {
    const currentContent = document.querySelector(".slider-content")
    const slider = sliderRef.current
    if (!currentContent || !slider) return

    const timeline = gsap.timeline()
    const currentLines = Array.from(
      currentContent.querySelectorAll(".line span")
    )

    timeline
      .to(currentLines, {
        y: "-100%",
        duration: 0.6,
        stagger: 0.025,
        ease: "power2.inOut",
      })
      .call(
        () => {
          const newContent = createSlideElement(slides[nextIndex])
          timeline.kill()
          currentContent.remove()
          slider.appendChild(newContent)

          gsap.set(newContent.querySelectorAll("span"), { y: "100%" })

          setTimeout(() => {
            processTextElements(newContent)
            const newLines = Array.from(
              newContent.querySelectorAll(".line span")
            )

            gsap.set(newLines, { y: "100%" })
            gsap.set(newContent, { opacity: 1 })

            gsap
              .timeline({
                onComplete: () => {
                  isTransitioning = false
                  currentSlideIndex = nextIndex
                },
              })
              .to(
                newLines,
                { y: "0%", duration: 0.5, stagger: 0.1, ease: "power2.inOut" },
                0.1
              )
          }, 100)
        },
        undefined,
        0.3
      )
  }

  const setupInitialSlide = () => {
    const content = document.querySelector(".slider-content")
    if (!content) return

    processTextElements(content)
    const lines = Array.from(content.querySelectorAll(".line span"))

    gsap.fromTo(
      lines,
      { y: "100%" },
      { y: "0%", duration: 0.8, stagger: 0.025, ease: "power2.out", delay: 0.2 }
    )
  }

  const initializeRenderer = async () => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)

    shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTexLeft1: { value: null },
        uTexLeft2: { value: null },
        uTexRight1: { value: null },
        uTexRight2: { value: null },
        uProgress: { value: 0.0 },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uTexLeft1Size: { value: new THREE.Vector2(1, 1) },
        uTexLeft2Size: { value: new THREE.Vector2(1, 1) },
        uTexRight1Size: { value: new THREE.Vector2(1, 1) },
        uTexRight2Size: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader,
      fragmentShader,
    })

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial))
    const loader = new THREE.TextureLoader()

    for (const slide of slides) {
      const texL = await new Promise<THREE.Texture>((resolve) =>
        loader.load(slide.leftImage, resolve)
      )
      texL.minFilter = texL.magFilter = THREE.LinearFilter
      const imgL = texL.image as any
      texL.userData = {
        size: new THREE.Vector2(imgL.width || 1, imgL.height || 1),
      }
      slideTexturesLeft.push(texL)

      const texR = await new Promise<THREE.Texture>((resolve) =>
        loader.load(slide.rightImage, resolve)
      )
      texR.minFilter = texR.magFilter = THREE.LinearFilter
      const imgR = texR.image as any
      texR.userData = {
        size: new THREE.Vector2(imgR.width || 1, imgR.height || 1),
      }
      slideTexturesRight.push(texR)
    }

    shaderMaterial.uniforms.uTexLeft1.value = slideTexturesLeft[0]
    shaderMaterial.uniforms.uTexLeft2.value =
      slideTexturesLeft[1] || slideTexturesLeft[0]
    shaderMaterial.uniforms.uTexLeft1Size.value =
      slideTexturesLeft[0].userData.size

    shaderMaterial.uniforms.uTexRight1.value = slideTexturesRight[0]
    shaderMaterial.uniforms.uTexRight2.value =
      slideTexturesRight[1] || slideTexturesRight[0]
    shaderMaterial.uniforms.uTexRight1Size.value =
      slideTexturesRight[0].userData.size

    const render = () => {
      requestAnimationFrame(render)
      renderer.render(scene, camera)
    }
    render()
  }

  const handleSlideChange = () => {
    if (isTransitioning) return

    isTransitioning = true
    const nextIndex = (currentSlideIndex + 1) % slides.length

    shaderMaterial.uniforms.uTexLeft1.value =
      slideTexturesLeft[currentSlideIndex]
    shaderMaterial.uniforms.uTexLeft2.value = slideTexturesLeft[nextIndex]
    shaderMaterial.uniforms.uTexLeft1Size.value =
      slideTexturesLeft[currentSlideIndex].userData.size
    shaderMaterial.uniforms.uTexLeft2Size.value =
      slideTexturesLeft[nextIndex].userData.size

    shaderMaterial.uniforms.uTexRight1.value =
      slideTexturesRight[currentSlideIndex]
    shaderMaterial.uniforms.uTexRight2.value = slideTexturesRight[nextIndex]
    shaderMaterial.uniforms.uTexRight1Size.value =
      slideTexturesRight[currentSlideIndex].userData.size
    shaderMaterial.uniforms.uTexRight2Size.value =
      slideTexturesRight[nextIndex].userData.size

    animateSlideTransition(nextIndex)

    gsap.fromTo(
      shaderMaterial.uniforms.uProgress,
      { value: 0 },
      {
        value: 1,
        duration: 2.5,
        ease: "power2.inOut",
        onComplete: () => {
          shaderMaterial.uniforms.uProgress.value = 0
          shaderMaterial.uniforms.uTexLeft1.value = slideTexturesLeft[nextIndex]
          shaderMaterial.uniforms.uTexLeft1Size.value =
            slideTexturesLeft[nextIndex].userData.size
          shaderMaterial.uniforms.uTexRight1.value =
            slideTexturesRight[nextIndex]
          shaderMaterial.uniforms.uTexRight1Size.value =
            slideTexturesRight[nextIndex].userData.size
        },
      }
    )
  }

  const handleResize = () => {
    if (renderer) {
      renderer.setSize(window.innerWidth, window.innerHeight)
      shaderMaterial.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      )
    }
  }

  useEffect(() => {
    gsap.registerPlugin(SplitText)
    gsap.config({ nullTargetWarn: false })

    const initSlider = async () => {
      setupInitialSlide()
      await initializeRenderer()
    }

    initSlider()

    // ===== 加入自動輪播邏輯 =====
    // 每 6 秒切換一次圖片 (6000 毫秒)
    const autoPlayTimer = setInterval(() => {
      handleSlideChange()
    }, 6000)

    const slider = sliderRef.current
    if (slider) {
      // 依然保留點擊切換的功能
      slider.addEventListener("click", handleSlideChange)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(autoPlayTimer) // 離開頁面時清除自動輪播計時器
      if (slider) {
        slider.removeEventListener("click", handleSlideChange)
      }
      window.removeEventListener("resize", handleResize)
      if (renderer) {
        renderer.dispose()
      }
    }
  }, [])

  return (
    <div
      className="slider h-screen w-full relative overflow-hidden"
      ref={sliderRef}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* ===== 絕對置中且固定的品牌標題區 ===== */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center pointer-events-none text-white drop-shadow-2xl">
        <h1 className="text-5xl md:text-7xl font-serif tracking-[0.2em] mb-4">
          唐宋珠寶
        </h1>
        <p className="text-base md:text-xl font-light tracking-[0.15em] opacity-90">
          黃金收購 ｜ 貴金屬珠寶收購 ｜ 高價收購
        </p>
      </div>

      {/* ===== 原本隨輪播切換的動態文字區 (已移動至底部) ===== */}
      <div className="slider-content absolute bottom-12 left-0 right-0 z-10 flex flex-col items-center pointer-events-none text-white drop-shadow-lg">
        <div className="slide-description text-center max-w-lg px-4">
          <p className="font-light tracking-wider opacity-90 mb-8">
            傳承百年的工藝精神，將靜謐的力量與永恆的優雅，凝聚於方寸之間。
          </p>
          <div className="slide-info flex justify-center gap-6 text-xs md:text-sm opacity-70 uppercase tracking-widest">
            <p>Type. Collection</p>
            <p>Field. High Jewelry</p>
            <p>Date. 2026</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Slider
