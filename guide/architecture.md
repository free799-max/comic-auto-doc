# 系统架构

## 技术栈

### 后端核心

| 组件 | 技术 | 说明 |
|------|------|------|
| Web 框架 | Django 5.2 + DRF | RESTful API 服务 |
| 实时通信 | Django Channels | WebSocket 支持 |
| 异步任务 | Celery + Celery Beat | 异步处理和定时调度 |
| 消息队列 | Redis | Celery Broker + 缓存 |
| 数据库 | PostgreSQL | 主数据库 |
| 浏览器自动化 | Playwright | Chromium，内置反检测 |
| HTML 解析 | BeautifulSoup4 + lxml | 页面解析 |
| 认证 | JWT (simplejwt) | Token 认证 |
| API 文档 | drf-spectacular | 自动生成 Swagger/ReDoc |

### 前端核心

| 组件 | 技术 | 说明 |
|------|------|------|
| 框架 | Vue 3.4 | Composition API `<script setup>` |
| 构建工具 | Vite 8 | 极速开发体验 |
| UI 组件库 | Naive UI 2.43 | 企业级组件库 |
| 路由 | Vue Router 4 | 单页应用路由 |
| HTTP 客户端 | Axios | API 请求封装 |
| 图标 | @vicons/ionicons5 | Ionic 图标库 |
| PWA | Vite PWA Plugin | 渐进式 Web 应用 |
| 移动端 | Capacitor 8 | Android App 打包 |

## 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        客户端层                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  Web 浏览器  │  │   PWA      │  │      Android App        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API 网关层 (Nginx)                           │
│              静态文件服务 / 反向代理 / 负载均衡                    │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   前端服务     │   │   后端 API    │   │   WebSocket   │
│  comic-ui    │   │  comic-api   │   │   实时日志     │
│   (Vite)     │   │   (Django)   │   │  (Channels)  │
└───────────────┘   └───────────────┘   └───────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  View 层      │   │   Celery      │   │   爬虫系统     │
│  参数解析/权限  │   │   异步任务     │   │  多站点爬取    │
└───────────────┘   └───────────────┘   └───────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Service 层    │   │  Celery Beat  │   │ 第三方漫画站   │
│ 业务逻辑编排   │   │   定时调度     │   │               │
└───────────────┘   └───────────────┘   └───────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Repository 层 │   │     Redis     │   │ Komga / Kavita│
│ ORM 数据访问   │   │  队列/缓存    │   │   媒体库同步   │
└───────────────┘   └───────────────┘   └───────────────┘
        │
        ▼
┌───────────────┐
│  PostgreSQL   │
│   主数据库     │
└───────────────┘
```

## 三层架构

后端严格遵循 **View → Service → Repository** 三层架构：

### View 层

- 仅做参数解析、权限校验、返回格式化
- 不含任何业务逻辑
- 所有 API 接口必须添加 `@extend_schema` 装饰器

```python
from app.services.subscription.service import ComicSubscriptionService

class SubscriptionView(APIView):
    def get(self, request):
        # 参数解析
        keyword = request.query_params.get('keyword')
        # 调用 Service
        result = ComicSubscriptionService.list_subscriptions(keyword=keyword)
        # 返回格式化
        return success_response(result)
```

### Service 层

- 业务编排核心
- 可被 View 和 Celery Task 复用
- 处理业务规则、数据转换、外部调用

```python
class ComicSubscriptionService:
    @staticmethod
    def list_subscriptions(keyword=None):
        queryset = SubscriptionRepository.search(keyword)
        return build_paginated_result(queryset)
```

### Repository 层

- 复用 ORM 查询
- 封装复杂查询条件
- 不处理业务逻辑

```python
class SubscriptionRepository:
    @staticmethod
    def search(keyword=None):
        qs = ComicSubscription.objects.all()
        if keyword:
            qs = qs.filter(name__icontains=keyword)
        return qs.order_by('-updated_at')
```

## 数据流

### 订阅更新流程

```
用户创建订阅
    │
    ▼
定时任务触发 (Celery Beat)
    │
    ▼
process_subscription()
    │
    ├── search_and_match_source()    # 搜索并匹配最优下载源
    │   ├── 动态加载爬虫搜索各站点
    │   └── _filter_best_station()   # 按可用性/响应速度/章节数排序
    │
    └── download_and_scrape()
        ├── _download_chapters()      # 下载缺失章节为 CBZ
        ├── _trigger_scan_library_for()  # 触发媒体服务器扫描
        └── _scrape_metadata()        # 更新系列和书籍元数据
```

### WebSocket 实时日志流程

```
客户端连接 ws://host/ws/tasks/<task_id>/
    │
    ▼
加入 Channel Layer group
    │
    ▼
推送最近 100 条历史日志（从 Redis 读取）
    │
    ▼
任务执行中实时推送新日志
    │
    ├── {"type": "log", "level": "info", "message": "..."}
    ├── {"type": "progress", "current": 5, "total": 10}
    ├── {"type": "search_result", "platform": "...", "result": {...}}
    ├── {"type": "done", "result": {...}}
    └── {"type": "error", "message": "..."}
```

## Redis 数据库分配

| DB | 用途 | 说明 |
|----|------|------|
| 0 | Celery Broker | 任务队列 |
| 1 | Channels Layer | WebSocket 消息广播 |
| 2 | 任务日志存储 | 7 天 TTL，单任务最多 10000 条 |
