# 前端开发

本文档介绍 comic-auto-ui 的前端开发规范和核心模块。

## 技术栈

| 属性 | 版本 |
|------|------|
| 框架 | Vue 3.4 |
| 构建工具 | Vite 8 |
| 路由 | Vue Router 4 |
| UI 组件库 | Naive UI 2.43 |
| HTTP 客户端 | Axios |
| 图标 | @vicons/ionicons5 |
| 语言 | JavaScript ESM |

## 开发规范

### Composition API

必须使用 `<script setup>` 语法：

```vue
<script setup>
import { ref, onMounted } from 'vue'

const count = ref(0)

onMounted(() => {
  console.log('组件挂载')
})
</script>

<template>
  <n-button @click="count++">{{ count }}</n-button>
</template>
```

### 优先使用框架能力

**示例：**

1. **响应式布局**：
   - ✅ 使用 Naive UI 的 `n-grid`：`:cols="'4 768:6 1024:8'"`
   - ❌ 不要手动监听 `window.resize`

2. **组件状态**：
   - ✅ 使用组件内置属性
   - ❌ 不要重复实现已有状态管理

3. **样式和动画**：
   - ✅ 使用 Naive UI 主题系统
   - ❌ 不要手动编写复杂 CSS 动画

### 命名规范

- 组件文件：`PascalCase.vue`
- 路由路径：`kebab-case`
- 变量/函数：`camelCase`
- 注释语言：中文

## 项目结构

```
src/
├── main.js              # 应用入口
├── App.vue              # 根组件
├── router/
│   └── index.js         # 路由配置
├── api/                 # API 接口
│   ├── request.js       # Axios 封装
│   ├── auth.js
│   ├── subscription.js
│   ├── explore.js
│   └── ...
├── components/          # 公共组件
│   ├── layout/          # 布局组件
│   │   ├── Layout.vue
│   │   ├── Sidebar.vue
│   │   └── SearchBar.vue
│   ├── AuthImage.vue    # 认证图片组件
│   └── PageContainer.vue
├── views/               # 页面视图
│   ├── Dashboard.vue
│   ├── Subscriptions.vue
│   ├── Explore.vue
│   ├── Tasks.vue
│   └── Settings.vue
├── utils/               # 工具函数
│   ├── auth.js          # Token 管理
│   └── image-loader.js  # 图片加载
└── assets/              # 静态资源
```

## 核心模块

### API 请求

`src/api/request.js` 封装了 Axios 实例：

```javascript
import request from '@/api/request'

// 使用
const result = await request.get('/api/v1/app/subscriptions/')
// result 已经是 response.data.data（拦截器处理）
```

**拦截器逻辑：**
1. 检查 `code` 字段
2. `code !== 0` 时抛出错误
3. `code === 0` 返回 `data`
4. 兼容旧格式

### 图片加载

`src/utils/image-loader.js` 解决认证图片加载：

```javascript
import { loadAuthImage, preloadImages } from '@/utils/image-loader'

// 加载单张图片
const blobUrl = await loadAuthImage(coverUrl)

// 预加载
await preloadImages(urlList)
```

**特性：**
- `fetch` 携带 Bearer token
- LRU 缓存（最多 100 张）
- 并发控制（最多 6 个）
- 请求去重

### 图片代理

外部图片必须通过后端代理：

```javascript
import { getExploreProxyCoverUrl, resolveExploreSource } from '@/views/explore/utils/coverProxy.js'

// 生成代理 URL
const src = getExploreProxyCoverUrl(coverUrl, crawlingType)
```

代理地址格式：
```
/api/v1/app/proxy/cover/?url=<encodeURIComponent(url)>&source=<crawling_type>
```

### 路由守卫

```javascript
// src/router/index.js
router.beforeEach((to, from, next) => {
  const token = getToken()
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})
```

### 环境变量

```
.env                  # 开发
VITE_API_BASE_URL=http://127.0.0.1:8000

.env.production       # 生产
VITE_API_BASE_URL=    # 相对路径
```

## 新增页面流程

1. 在 `src/views/` 创建新的 `.vue` 视图组件
2. 在 `src/router/index.js` 添加路由记录
3. 在 `src/components/layout/Sidebar.vue` 添加导航菜单

**视图目录规范：**

```
src/views/{模块}/
├── {模块}.vue           # 布局框架
└── components/
    └── {功能块}.vue     # 业务逻辑
```

**示例：**

```
src/views/system/
├── Settings.vue                 # 只有 n-tabs 框架
└── components/
    ├── BasicSettings.vue        # 基本设置
    └── MediaServerSettings.vue  # 媒体服务器
```

## 常用命令

```bash
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run preview    # 预览构建
npm run test       # 测试
```

## PWA 配置

已集成 Vite PWA Plugin：

```javascript
// vite.config.js
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'Comic Auto',
    theme_color: '#6366f1',
    // ...
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\..*/i,
        handler: 'NetworkFirst'
      },
      {
        urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
        handler: 'CacheFirst'
      }
    ]
  }
})
```
