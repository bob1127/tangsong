"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import gsap from "gsap"
// @ts-ignore: 忽略型別檢查
import { SplitText } from "gsap/SplitText"

// ====== 1. 簡化資料型別 (改為單圖結構) ======
export interface SlideData {
  description: string
  type: string
  field: string
  date: string
  image: string // 將 left/right 合併為單一 image
}

// ====== 2. 重構圖片與文案設定 (展開為 4 個獨立物件) ======
export const slides: SlideData[] = [
  {
    description: "傳承百年的工藝精神，將靜謐的力量凝聚於此。",
    type: "Collection",
    field: "High Jewelry",
    date: "2026",
    image: "/images/0001.jpg",
  },
  {
    description: "黃金收購與貴金屬珠寶，展現極致品味。",
    type: "Collection",
    field: "High Jewelry",
    date: "2026",
    image: "/images/0002.jpg",
  },
  {
    description: "永恆的優雅，凝聚於方寸之間。",
    type: "Editorial",
    field: "Conceptual",
    date: "2026",
    image: "/images/0004.jpg",
  },
  {
    description: "唐宋珠寶，為您的高雅氣質加冕。",
    type: "Editorial",
    field: "Conceptual",
    date: "2026",
    image: "/images/004.jpg",
  },
]

// ====== 3. WebGL 著色器 (加入 uIsMobile 判斷) ======
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
  uniform float uIsMobile; // 0.0 為桌機，1.0 為手機
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
    // 如果是手機版，永遠當作左邊(全螢幕)處理
    bool isLeft = uIsMobile > 0.5 ? true : vUv.x < 0.5;
    
    // 計算畫布比例：手機全滿，桌機切半
    vec2 halfRes = mix(vec2(uResolution.x * 0.5, uResolution.y), uResolution, step(0.5, uIsMobile));
    
    vec2 localUv;
    if (uIsMobile > 0.5) {
      localUv = vUv;
    } else {
      localUv = isLeft ? vec2(vUv.x * 2.0, vUv.y) : vec2((vUv.x - 0.5) * 2.0, vUv.y);
    }
    
    float localProgress;
    if (uIsMobile > 0.5) {
      localProgress = clamp(uProgress * 1.1, 0.0, 1.0);
    } else {
      localProgress = isLeft 
        ? clamp(uProgress * 1.1, 0.0, 1.0) 
        : clamp((uProgress - 0.1) * 1.1, 0.0, 1.0);
    }

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
    
    // 桌機版畫出中間白線，手機版則隱藏
    float line = smoothstep(0.499, 0.5, vUv.x) - smoothstep(0.5, 0.501, vUv.x);
    float lineAlpha = (1.0 - step(0.5, uIsMobile)) * 0.15;
    color.rgb = mix(color.rgb, vec3(1.0), line * lineAlpha);
    
    gl_FragColor = color;
  }
`

// ====== 4. 主元件 ======
const Slider = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(SplitText)
    gsap.config({ nullTargetWarn: false })

    let currentSlideIndex: number = 0
    let isTransitioning: boolean = false
    let loadedTextures: THREE.Texture[] = []
    let shaderMaterial: THREE.ShaderMaterial
    let renderer: THREE.WebGLRenderer
    let isMobile = window.innerWidth < 768

    const createLineElements = (element: Element) => {
      new SplitText(element, { type: "lines", linesClass: "line" })
      element.querySelectorAll(".line").forEach((line) => {
        line.innerHTML = `<span>${line.textContent}</span>`
      })
    }

    const processTextElements = (container: Element) => {
      container
        .querySelectorAll(".slide-description p.animated-text")
        .forEach(createLineElements)
    }

    const createSlideElement = (slideData: SlideData): HTMLDivElement => {
      const content = document.createElement("div")
      content.className =
        "slider-content absolute bottom-12 left-0 right-0 z-10 flex flex-col items-center pointer-events-none text-white drop-shadow-lg"
      content.style.opacity = "0"

      content.innerHTML = `
        <div class="slide-description text-center max-w-lg px-4">
          
        </div>
      `
      return content
    }

    const animateSlideTransition = (nextContentIndex: number) => {
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
            const newContent = createSlideElement(slides[nextContentIndex])
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
              gsap.to(newLines, {
                y: "0%",
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.inOut",
                delay: 0.1,
              })
            }, 100)
          },
          undefined,
          0.3
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
          uIsMobile: { value: isMobile ? 1.0 : 0.0 },
        },
        vertexShader,
        fragmentShader,
      })

      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial))
      const loader = new THREE.TextureLoader()

      // 載入所有圖片
      for (const slide of slides) {
        const tex = await new Promise<THREE.Texture>((resolve) =>
          loader.load(slide.image, resolve)
        )
        tex.minFilter = tex.magFilter = THREE.LinearFilter
        const img = tex.image as any
        tex.userData = {
          size: new THREE.Vector2(img.width || 1, img.height || 1),
        }
        loadedTextures.push(tex)
      }

      // 初始賦值
      shaderMaterial.uniforms.uTexLeft1.value = loadedTextures[0]
      shaderMaterial.uniforms.uTexLeft1Size.value =
        loadedTextures[0].userData.size
      if (!isMobile) {
        shaderMaterial.uniforms.uTexRight1.value = loadedTextures[1]
        shaderMaterial.uniforms.uTexRight1Size.value =
          loadedTextures[1].userData.size
      }

      const render = () => {
        requestAnimationFrame(render)
        renderer.render(scene, camera)
      }
      render()

      // 初次載入文字動畫
      const initialContent = createSlideElement(slides[0])
      sliderRef.current?.appendChild(initialContent)
      processTextElements(initialContent)
      gsap.to(initialContent, { opacity: 1, duration: 0.1 })
      const lines = Array.from(initialContent.querySelectorAll(".line span"))
      gsap.fromTo(
        lines,
        { y: "100%" },
        {
          y: "0%",
          duration: 0.8,
          stagger: 0.025,
          ease: "power2.out",
          delay: 0.2,
        }
      )
    }

    const handleSlideChange = () => {
      if (isTransitioning) return
      isTransitioning = true

      isMobile = window.innerWidth < 768

      // 計算最大輪播頁數：手機 4 頁，桌機 2 頁
      const maxSlides = isMobile
        ? loadedTextures.length
        : Math.ceil(loadedTextures.length / 2)
      const nextIndex = (currentSlideIndex + 1) % maxSlides

      if (isMobile) {
        shaderMaterial.uniforms.uTexLeft1.value =
          loadedTextures[currentSlideIndex]
        shaderMaterial.uniforms.uTexLeft2.value = loadedTextures[nextIndex]
        shaderMaterial.uniforms.uTexLeft1Size.value =
          loadedTextures[currentSlideIndex].userData.size
        shaderMaterial.uniforms.uTexLeft2Size.value =
          loadedTextures[nextIndex].userData.size
      } else {
        const currL = currentSlideIndex * 2,
          nextL = nextIndex * 2
        shaderMaterial.uniforms.uTexLeft1.value = loadedTextures[currL]
        shaderMaterial.uniforms.uTexLeft2.value = loadedTextures[nextL]
        shaderMaterial.uniforms.uTexRight1.value = loadedTextures[currL + 1]
        shaderMaterial.uniforms.uTexRight2.value = loadedTextures[nextL + 1]

        shaderMaterial.uniforms.uTexLeft1Size.value =
          loadedTextures[currL].userData.size
        shaderMaterial.uniforms.uTexLeft2Size.value =
          loadedTextures[nextL].userData.size
        shaderMaterial.uniforms.uTexRight1Size.value =
          loadedTextures[currL + 1].userData.size
        shaderMaterial.uniforms.uTexRight2Size.value =
          loadedTextures[nextL + 1].userData.size
      }

      // 桌機會抓左邊那張圖的對應文字
      const textDataIndex = isMobile ? nextIndex : nextIndex * 2
      animateSlideTransition(textDataIndex)

      gsap.fromTo(
        shaderMaterial.uniforms.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: 2.5,
          ease: "power2.inOut",
          onComplete: () => {
            shaderMaterial.uniforms.uProgress.value = 0
            currentSlideIndex = nextIndex
            isTransitioning = false

            // 將過渡完的下一張圖設定為目前的底圖
            if (isMobile) {
              shaderMaterial.uniforms.uTexLeft1.value =
                loadedTextures[nextIndex]
              shaderMaterial.uniforms.uTexLeft1Size.value =
                loadedTextures[nextIndex].userData.size
            } else {
              shaderMaterial.uniforms.uTexLeft1.value =
                loadedTextures[nextIndex * 2]
              shaderMaterial.uniforms.uTexRight1.value =
                loadedTextures[nextIndex * 2 + 1]

              // 👇 就是漏了下面這兩行！桌機版也必須更新尺寸
              shaderMaterial.uniforms.uTexLeft1Size.value =
                loadedTextures[nextIndex * 2].userData.size
              shaderMaterial.uniforms.uTexRight1Size.value =
                loadedTextures[nextIndex * 2 + 1].userData.size
            }
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

        // 螢幕改變時，重置陣列避免破圖
        const newIsMobile = window.innerWidth < 768
        if (newIsMobile !== isMobile) {
          isMobile = newIsMobile
          shaderMaterial.uniforms.uIsMobile.value = isMobile ? 1.0 : 0.0
          currentSlideIndex = 0
          shaderMaterial.uniforms.uTexLeft1.value = loadedTextures[0]
          if (!isMobile)
            shaderMaterial.uniforms.uTexRight1.value = loadedTextures[1]
        }
      }
    }

    // 啟動與綁定事件
    initializeRenderer()
    const autoPlayTimer = setInterval(() => handleSlideChange(), 6000)
    const slider = sliderRef.current
    if (slider) slider.addEventListener("click", handleSlideChange)
    window.addEventListener("resize", handleResize)

    return () => {
      clearInterval(autoPlayTimer)
      if (slider) slider.removeEventListener("click", handleSlideChange)
      window.removeEventListener("resize", handleResize)
      if (renderer) renderer.dispose()
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
        <h2 className="text-base md:text-xl font-normal tracking-[0.15em] opacity-90">
          專業檢測與透明報價，安心回收每一份價值
        </h2>
      </div>
    </div>
  )
}

export default Slider
