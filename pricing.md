# 定价

<div class="pricing-container">

  <div class="pricing-card">
    <h3>免费</h3>
    <div class="pricing-price"><strong>¥0</strong></div>
    <ul class="pricing-list">
      <li>✓ 漫画探索发现</li>
      <li>✓ 媒体库刮削</li>
      <li>✓ 站点管理</li>
      <li>✓ 漫画追更订阅</li>
      <li>✓ 从漫画平台同步收藏</li>
      <li class="pricing-disabled">✗ 自动追更下载刮削</li>
    </ul>
    <a class="pricing-btn" href="#">开始使用</a>
  </div>

  <div class="pricing-card">
    <h3>年付</h3>
    <div class="pricing-price">¥<strong>58</strong><span>/ 年</span></div>
    <ul class="pricing-list">
      <li>✓ 漫画探索发现</li>
      <li>✓ 媒体库刮削</li>
      <li>✓ 站点管理</li>
      <li>✓ 漫画追更订阅</li>
      <li>✓ 从漫画平台同步收藏</li>
      <li>✓ 新章节自动下载入库</li>
    </ul>
    <a class="pricing-btn pricing-btn-primary" href="#">订阅</a>
  </div>

  <div class="pricing-card pricing-popular">
    <div class="pricing-badge">推荐</div>
    <h3>永久</h3>
    <div class="pricing-price">¥<strong>98</strong><span>永久</span></div>
    <ul class="pricing-list">
      <li>✓ 漫画探索发现</li>
      <li>✓ 媒体库刮削</li>
      <li>✓ 站点管理</li>
      <li>✓ 漫画追更订阅</li>
      <li>✓ 从漫画平台同步收藏</li>
      <li>✓ 新章节自动下载入库</li>
    </ul>
    <a class="pricing-btn" href="#">购买</a>
  </div>

</div>

<style scoped>
.pricing-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 32px;
}
.pricing-card {
  position: relative;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 32px 20px;
  text-align: center;
  transition: all 0.3s ease;
}
.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(99, 102, 241, 0.15);
}
.pricing-popular {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.12);
}
.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #6366f1, #f472b6);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: 20px;
}
.pricing-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
}
.pricing-price {
  margin-bottom: 20px;
}
.pricing-price strong {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  letter-spacing: -0.02em;
}
.pricing-price span {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-left: 4px;
}
.pricing-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  text-align: left;
}
.pricing-list li {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  padding: 6px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}
.pricing-list li:last-child {
  border-bottom: none;
}
.pricing-disabled {
  color: var(--vp-c-text-3);
}
.pricing-btn {
  display: block;
  padding: 10px 0;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border: 1px solid var(--vp-c-brand-1);
  transition: all 0.2s ease;
}
.pricing-btn:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}
.pricing-btn-primary {
  background: linear-gradient(135deg, #6366f1, #f472b6);
  color: #fff;
  border: none;
}
.pricing-btn-primary:hover {
  opacity: 0.9;
}
@media (max-width: 768px) {
  .pricing-container { grid-template-columns: 1fr; }
}
</style>
