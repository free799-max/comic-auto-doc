---
layout: home

hero:
  name: "Comic Auto"
  text: "漫画自动化管理系统"
  tagline: 漫画订阅、探索、追更、刮削一站式自动化管理系统
  image:
    src: /logo.svg
    alt: Comic Auto
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/
    - theme: alt
      text: 使用指南
      link: /guide/
---

<div class="carousel-wrapper">
  <div class="carousel-container" id="carousel">
    <div class="carousel-slide active">
      <img src="/images/漫画订阅.png" alt="漫画订阅" />
      <div class="carousel-caption">
        <div class="carousel-title">📚 漫画订阅</div>
        <div class="carousel-desc">智能追踪与自动下载</div>
      </div>
    </div>
    <div class="carousel-slide">
      <img src="/images/探索发现.png" alt="探索发现" />
      <div class="carousel-caption">
        <div class="carousel-title">🔍 探索发现</div>
        <div class="carousel-desc">聚合多平台漫画榜单</div>
      </div>
    </div>
    <div class="carousel-slide">
      <img src="/images/站点管理.png" alt="站点管理" />
      <div class="carousel-caption">
        <div class="carousel-title">🌐 站点管理</div>
        <div class="carousel-desc">爬虫站点健康监控</div>
      </div>
    </div>
    <div class="carousel-slide">
      <img src="/images/系统设置.png" alt="系统设置" />
      <div class="carousel-caption">
        <div class="carousel-title">⚙️ 系统设置</div>
        <div class="carousel-desc">媒体服务器与全局配置</div>
      </div>
    </div>
  </div>

  <button class="carousel-arrow carousel-prev" onclick="changeSlide(-1)">&#10094;</button>
  <button class="carousel-arrow carousel-next" onclick="changeSlide(1)">&#10095;</button>

  <div class="carousel-dots">
    <span class="carousel-dot active" onclick="goToSlide(0)"></span>
    <span class="carousel-dot" onclick="goToSlide(1)"></span>
    <span class="carousel-dot" onclick="goToSlide(2)"></span>
    <span class="carousel-dot" onclick="goToSlide(3)"></span>
  </div>
</div>

<style>
.VPHero .VPImage {
  filter: drop-shadow(0 20px 40px rgba(99, 102, 241, 0.25));
}

/* 轮播容器 */
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

/* 幻灯片 */
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

/* 底部标题区域 */
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

/* 左右箭头 */
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
  left: 8px;
}

.carousel-next {
  right: 8px;
}

/* 底部圆点 */
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

/* 深色模式 */
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

/* 响应式 */
@media (max-width: 768px) {
  .carousel-wrapper {
    margin: 24px auto 40px;
    padding: 0 16px;
  }

  .carousel-container {
    aspect-ratio: 4 / 3;
    border-radius: 14px;
  }

  .carousel-arrow {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }

  .carousel-prev { left: 4px; }
  .carousel-next { right: 4px; }

  .carousel-caption {
    height: 64px;
    padding: 0 16px 12px;
  }

  .carousel-title { font-size: 15px; }
  .carousel-desc { font-size: 12px; }
}
</style>

<script>
(function() {
  if (typeof document === 'undefined') return;
  let currentIndex = 0;
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const total = slides.length;
  let autoplayTimer = null;

  function updateSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  window.changeSlide = function(direction) {
    let next = currentIndex + direction;
    if (next < 0) next = total - 1;
    if (next >= total) next = 0;
    updateSlide(next);
    resetAutoplay();
  };

  window.goToSlide = function(index) {
    updateSlide(index);
    resetAutoplay();
  };

  function nextSlide() {
    let next = (currentIndex + 1) % total;
    updateSlide(next);
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 4000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  // 鼠标悬停暂停
  const carousel = document.getElementById('carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  // 自动播放
  startAutoplay();
})();
</script>
