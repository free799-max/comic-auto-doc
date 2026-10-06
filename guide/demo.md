# 演示站点

在线体验完整功能，无需部署。

<div class="demo-container">
  <a class="demo-card" href="https://comic-auto.freeapps.uk" target="_blank" rel="noopener">
    <h3>Comic Auto</h3>
    <p class="demo-desc">漫画自动化管理系统本体</p>
    <p class="demo-account">账号：<code>待提供</code>　密码：<code>待提供</code></p>
    <span class="demo-link">进入演示 →</span>
  </a>
  <a class="demo-card" href="https://komga.freeapps.uk" target="_blank" rel="noopener">
    <h3>Komga</h3>
    <p class="demo-desc">漫画媒体库与 Web 阅读器</p>
    <p class="demo-account">账号：<code>待提供</code>　密码：<code>待提供</code></p>
    <span class="demo-link">进入演示 →</span>
  </a>
  <a class="demo-card" href="https://kavita.freeapps.uk" target="_blank" rel="noopener">
    <h3>Kavita</h3>
    <p class="demo-desc">另一款漫画媒体库与阅读器</p>
    <p class="demo-account">账号：<code>待提供</code>　密码：<code>待提供</code></p>
    <span class="demo-link">进入演示 →</span>
  </a>
</div>

<style scoped>
.demo-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 24px;
}
.demo-card {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 24px 20px;
  text-decoration: none;
  transition: all 0.3s ease;
}
.demo-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 24px -8px rgba(99, 102, 241, 0.15);
}
.demo-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 6px;
  color: var(--vp-c-text-1);
}
.demo-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  margin: 0 0 14px;
}
.demo-account {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0 0 16px;
}
.demo-account code {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 0.8rem;
  color: var(--vp-c-brand-1);
}
.demo-link {
  margin-top: auto;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
@media (max-width: 768px) {
  .demo-container { grid-template-columns: 1fr; }
}
</style>
