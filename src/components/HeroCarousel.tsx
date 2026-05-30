"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import gsap from "gsap"
import {
  DEFAULT_HERO_CAROUSEL_SLIDES,
  fetchHeroCarouselSlidesClient,
} from "@lib/data/hero-carousel"

export const slides = [...DEFAULT_HERO_CAROUSEL_SLIDES]

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
    
    gl_FragColor = color;
  }
`

// ====== 4. 主元件 ======
type SliderProps = {
  slides?: string[]
}

const Slider = ({ slides: slidesProp }: SliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const initialSlidesKey = (
    slidesProp?.length ? slidesProp : DEFAULT_HERO_CAROUSEL_SLIDES
  ).join("|")
  const [resolvedSlides, setResolvedSlides] = useState<string[]>(() =>
    slidesProp?.length ? slidesProp : [...DEFAULT_HERO_CAROUSEL_SLIDES]
  )
  const slidesKey = resolvedSlides.join("|")

  useEffect(() => {
    let cancelled = false

    fetchHeroCarouselSlidesClient().then((fetched) => {
      if (cancelled) return
      const nextKey = fetched.join("|")
      if (nextKey !== initialSlidesKey) {
        setResolvedSlides(fetched)
      }
    })

    return () => {
      cancelled = true
    }
  }, [initialSlidesKey])

  useEffect(() => {
    const slideImages = resolvedSlides
    gsap.config({ nullTargetWarn: false })

    const container = sliderRef.current
    if (!container) return

    // 每次 effect 建立新 canvas，避免 Strict Mode dispose 後 context 失效
    const canvas = document.createElement("canvas")
    canvas.className = "absolute inset-0 z-0 block h-full w-full"
    container.insertBefore(canvas, container.firstChild)

    let active = true
    let currentSlideIndex = 0
    let isTransitioning = false
    let loadedTextures: THREE.Texture[] = []
    let shaderMaterial: THREE.ShaderMaterial | null = null
    let renderer: THREE.WebGLRenderer | null = null
    let isMobile = window.innerWidth < 768
    let autoPlayTimer: ReturnType<typeof setInterval> | null = null
    let animationFrameId: number | null = null

    const loadTexture = (
      loader: THREE.TextureLoader,
      url: string
    ): Promise<THREE.Texture> =>
      new Promise((resolve, reject) => {
        loader.setCrossOrigin("anonymous")
        loader.load(
          url,
          (texture) => {
            texture.minFilter = THREE.LinearFilter
            texture.magFilter = THREE.LinearFilter
            const img = texture.image as HTMLImageElement
            texture.userData = {
              size: new THREE.Vector2(
                img.naturalWidth || 1,
                img.naturalHeight || 1
              ),
            }
            resolve(texture)
          },
          undefined,
          (error) => reject(new Error(`無法載入輪播圖 ${url}: ${error}`))
        )
      })

    const handleSlideChange = () => {
      if (
        !active ||
        isTransitioning ||
        !shaderMaterial ||
        loadedTextures.length === 0
      ) {
        return
      }

      const material = shaderMaterial
      isTransitioning = true
      isMobile = window.innerWidth < 768

      const maxSlides = isMobile
        ? loadedTextures.length
        : Math.ceil(loadedTextures.length / 2)
      const nextIndex = (currentSlideIndex + 1) % maxSlides

      if (isMobile) {
        material.uniforms.uTexLeft1.value = loadedTextures[currentSlideIndex]
        material.uniforms.uTexLeft2.value = loadedTextures[nextIndex]
        material.uniforms.uTexLeft1Size.value =
          loadedTextures[currentSlideIndex].userData.size
        material.uniforms.uTexLeft2Size.value =
          loadedTextures[nextIndex].userData.size
      } else {
        const currL = currentSlideIndex * 2
        const nextL = nextIndex * 2
        material.uniforms.uTexLeft1.value = loadedTextures[currL]
        material.uniforms.uTexLeft2.value = loadedTextures[nextL]
        material.uniforms.uTexRight1.value = loadedTextures[currL + 1]
        material.uniforms.uTexRight2.value = loadedTextures[nextL + 1]
        material.uniforms.uTexLeft1Size.value =
          loadedTextures[currL].userData.size
        material.uniforms.uTexLeft2Size.value =
          loadedTextures[nextL].userData.size
        material.uniforms.uTexRight1Size.value =
          loadedTextures[currL + 1].userData.size
        material.uniforms.uTexRight2Size.value =
          loadedTextures[nextL + 1].userData.size
      }

      gsap.fromTo(
        material.uniforms.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: 2.5,
          ease: "power2.inOut",
          onComplete: () => {
            if (!active) return
            material.uniforms.uProgress.value = 0
            currentSlideIndex = nextIndex
            isTransitioning = false

            if (isMobile) {
              material.uniforms.uTexLeft1.value = loadedTextures[nextIndex]
              material.uniforms.uTexLeft1Size.value =
                loadedTextures[nextIndex].userData.size
            } else {
              material.uniforms.uTexLeft1.value = loadedTextures[nextIndex * 2]
              material.uniforms.uTexRight1.value =
                loadedTextures[nextIndex * 2 + 1]
              material.uniforms.uTexLeft1Size.value =
                loadedTextures[nextIndex * 2].userData.size
              material.uniforms.uTexRight1Size.value =
                loadedTextures[nextIndex * 2 + 1].userData.size
            }
          },
        }
      )
    }

    const handleResize = () => {
      if (
        !active ||
        !renderer ||
        !shaderMaterial ||
        loadedTextures.length === 0
      ) {
        return
      }

      renderer.setSize(window.innerWidth, window.innerHeight)
      shaderMaterial.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      )

      const newIsMobile = window.innerWidth < 768
      if (newIsMobile !== isMobile) {
        isMobile = newIsMobile
        shaderMaterial.uniforms.uIsMobile.value = isMobile ? 1.0 : 0.0
        currentSlideIndex = 0
        shaderMaterial.uniforms.uTexLeft1.value = loadedTextures[0]
        shaderMaterial.uniforms.uTexLeft1Size.value =
          loadedTextures[0].userData.size
        if (!isMobile && loadedTextures[1]) {
          shaderMaterial.uniforms.uTexRight1.value = loadedTextures[1]
          shaderMaterial.uniforms.uTexRight1Size.value =
            loadedTextures[1].userData.size
        }
      }
    }

    const startAutoPlay = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer)
      autoPlayTimer = setInterval(() => handleSlideChange(), 6000)
    }

    const initializeRenderer = async () => {
      if (!active) return

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.toneMapping = THREE.NoToneMapping

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
        toneMapped: false,
      })

      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial))
      const loader = new THREE.TextureLoader()

      for (const image of slideImages) {
        const tex = await loadTexture(loader, image)
        if (!active) {
          tex.dispose()
          return
        }
        loadedTextures.push(tex)
      }

      if (!shaderMaterial || loadedTextures.length === 0) return

      shaderMaterial.uniforms.uTexLeft1.value = loadedTextures[0]
      shaderMaterial.uniforms.uTexLeft1Size.value =
        loadedTextures[0].userData.size
      if (!isMobile && loadedTextures[1]) {
        shaderMaterial.uniforms.uTexRight1.value = loadedTextures[1]
        shaderMaterial.uniforms.uTexRight1Size.value =
          loadedTextures[1].userData.size
      }

      const render = () => {
        if (!active || !renderer) return
        animationFrameId = requestAnimationFrame(render)
        renderer.render(scene, camera)
      }
      render()

      startAutoPlay()
    }

    container.addEventListener("click", handleSlideChange)
    window.addEventListener("resize", handleResize)

    initializeRenderer().catch((error) => {
      console.error("[HeroCarousel] 初始化失敗:", error)
    })

    return () => {
      active = false
      if (autoPlayTimer) clearInterval(autoPlayTimer)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      container.removeEventListener("click", handleSlideChange)
      window.removeEventListener("resize", handleResize)
      loadedTextures.forEach((tex) => tex.dispose())
      loadedTextures = []
      if (renderer) {
        renderer.dispose()
        renderer = null
      }
      canvas.remove()
    }
  }, [slidesKey])

  return (
    <div
      className="slider h-screen w-full relative overflow-hidden cursor-pointer"
      ref={sliderRef}
      aria-label="首頁輪播，點擊可切換下一張"
    >
      {/* ===== 絕對置中且固定的品牌標題區 ===== */}
      <div className="absolute inset-0 z-20 flex flex-col justify-center items-center pointer-events-none text-white drop-shadow-2xl">
        <h1 className="text-5xl md:text-7xl font-serif tracking-[0.2em] mb-4">
          唐宋珠寶
        </h1>
        <p className="text-base md:text-xl font-light tracking-[0.15em] opacity-90">
          專業檢測與透明報價，安心回收每一份價值
        </p>
      </div>
    </div>
  )
}

export default Slider
