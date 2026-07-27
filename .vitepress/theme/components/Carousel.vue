<template>
  <div class="carousel-wrapper">
    <div class="carousel-container" ref="carouselRef">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        class="carousel-slide"
        :class="{ active: currentIndex === index }"
      >
        <img :src="slide.src" :alt="slide.alt" />
        <div class="carousel-caption">
          <div class="carousel-title">{{ slide.title }}</div>
          <div class="carousel-desc">{{ slide.desc }}</div>
        </div>
      </div>
    </div>

    <button class="carousel-arrow carousel-prev" @click="changeSlide(-1)">&#10094;</button>
    <button class="carousel-arrow carousel-next" @click="changeSlide(1)">&#10095;</button>

    <div class="carousel-dots">
      <span
        v-for="(_, index) in slides"
        :key="index"
        class="carousel-dot"
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  { src: '/images/漫画订阅.png', alt: '漫画订阅', title: '📚 漫画订阅', desc: '智能追踪与自动下载' },
  { src: '/images/探索发现.png', alt: '探索发现', title: '🔍 探索发现', desc: '聚合多平台漫画榜单' },
  { src: '/images/站点管理.png', alt: '站点管理', title: '🌐 站点管理', desc: '爬虫站点健康监控' },
  { src: '/images/系统设置.png', alt: '系统设置', title: '⚙️ 系统设置', desc: '媒体服务器与全局配置' },
]

const currentIndex = ref(0)
const autoplayTimer = ref(null)
const carouselRef = ref(null)

function changeSlide(direction) {
  let next = currentIndex.value + direction
  if (next < 0) next = slides.length - 1
  if (next >= slides.length) next = 0
  currentIndex.value = next
  resetAutoplay()
}

function goToSlide(index) {
  currentIndex.value = index
  resetAutoplay()
}

function nextSlide() {
  currentIndex.value = (currentIndex.value + 1) % slides.length
}

function startAutoplay() {
  autoplayTimer.value = setInterval(nextSlide, 4000)
}

function resetAutoplay() {
  clearInterval(autoplayTimer.value)
  startAutoplay()
}

function handleMouseEnter() {
  clearInterval(autoplayTimer.value)
}

function handleMouseLeave() {
  startAutoplay()
}

onMounted(() => {
  startAutoplay()
  if (carouselRef.value) {
    carouselRef.value.addEventListener('mouseenter', handleMouseEnter)
    carouselRef.value.addEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  clearInterval(autoplayTimer.value)
  if (carouselRef.value) {
    carouselRef.value.removeEventListener('mouseenter', handleMouseEnter)
    carouselRef.value.removeEventListener('mouseleave', handleMouseLeave)
  }
})
</script>

<style scoped>
.carousel-wrapper {
  position: relative;
  max-width: 1200px;
  margin: 40px auto 60px;
  padding: 0 24px;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 580px;
  border-radius: 20px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: translateX(60px) scale(0.95);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.carousel-slide.active {
  opacity: 1;
  transform: translateX(0) scale(1);
  pointer-events: auto;
  z-index: 2;
}

.carousel-slide img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 60%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 24px 16px;
  z-index: 3;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.4s ease;
  pointer-events: none;
}

.carousel-container:hover .carousel-caption {
  opacity: 1;
  transform: translateY(0);
}

.carousel-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.carousel-desc {
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  margin-top: 2px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.9);
  color: var(--vp-c-brand-1);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.25s ease;
  z-index: 10;
}

.carousel-arrow:hover {
  background: var(--vp-c-brand-1);
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.carousel-prev {
  left: 32px;
}

.carousel-next {
  right: 32px;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.carousel-dot:hover {
  background: var(--vp-c-brand-3);
  transform: scale(1.2);
}

.carousel-dot.active {
  background: var(--vp-c-brand-1);
  transform: scale(1.2);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.dark .carousel-container {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dark .carousel-arrow {
  background: rgba(30, 30, 40, 0.9);
  color: var(--vp-c-brand-2);
}

.dark .carousel-arrow:hover {
  background: var(--vp-c-brand-1);
  color: white;
}

@media (max-width: 768px) {
  .carousel-wrapper {
    margin: 24px auto 40px;
    padding: 0 16px;
  }

  .carousel-container {
    aspect-ratio: 16 / 9;
    height: auto;
    border-radius: 14px;
  }

  .carousel-arrow {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .carousel-prev { left: 20px; }
  .carousel-next { right: 20px; }

  .carousel-caption {
    height: 64px;
    padding: 0 16px 12px;
  }

  .carousel-title { font-size: 15px; }
  .carousel-desc { font-size: 12px; }
}
</style>
