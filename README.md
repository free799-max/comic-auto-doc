# Comic Auto 文档站点

漫画自动订阅、爬取、下载和库管理系统 Comic Auto 的官方文档。

## 在线访问

- **生产环境**：https://comic.freeapps.uk
- **演示站点**：https://comic-auto.freeapps.uk（详见文档「演示站点」页）

## 技术架构

基于 [VitePress](https://vitepress.dev/) 构建的静态文档站点：

- **框架**：VitePress v1.6（Vue 3 + Vite）
- **包管理**：npm（Node.js 18+）
- **部署产物**：纯静态文件（`.vitepress/dist`），可托管于任意静态服务器

## 本地开发

```bash
npm install
npm run docs:dev      # 启动开发服务器（默认 http://localhost:5173）
npm run docs:build    # 构建生产产物到 .vitepress/dist
npm run docs:preview  # 本地预览构建产物
```

## 目录结构

```
├── .vitepress/       # VitePress 配置与主题
│   ├── config.mjs    # 站点配置（导航、侧边栏、sitemap）
│   └── theme/        # 自定义主题
├── guide/            # 指南文档（快速开始、功能、设置等）
├── public/           # 静态资源（图片、logo）
├── index.md          # 首页
└── pricing.md        # 定价页
```

## 相关仓库

- GitHub：https://github.com/free799-max/comic-auto-doc
