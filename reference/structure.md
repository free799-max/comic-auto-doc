# 项目目录结构

## comic-auto-api

```
comic-auto-api/
├── app/                    # 主应用
│   ├── views/              # 视图层（参数解析、权限校验）
│   │   ├── subscription.py
│   │   ├── station.py
│   │   ├── explore.py
│   │   └── ...
│   ├── services/           # 业务逻辑层
│   │   ├── subscription/
│   │   │   ├── service.py
│   │   │   └── repository.py
│   │   ├── station/
│   │   ├── explore/
│   │   └── rank/
│   ├── core/               # 核心基础设施
│   │   └── comic_context.py
│   ├── consumers.py        # WebSocket 消费者
│   └── tasks.py            # Celery 异步任务
├── comic_auto/             # Django 项目配置
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
├── crawling/               # 爬虫实现
│   ├── chinese/            # 国漫爬虫
│   │   ├── acqq.py
│   │   └── bakamh.py
│   ├── manhwa/             # 韩漫爬虫
│   ├── manga/              # 日漫爬虫
│   ├── manhwa18/           # 成人内容
│   └── scrape/             # 元数据刮削器
├── cron/                   # 定时脚本
├── utils/                  # 通用工具
│   ├── media_server/       # 媒体服务器客户端
│   │   ├── base.py
│   │   ├── komga.py
│   │   ├── kavita.py
│   │   └── factory.py
│   ├── playwright_wrapper.py
│   ├── task_log_storage.py
│   ├── task_log_handler.py
│   ├── config_manager.py
│   ├── restful.py
│   ├── pagination.py
│   └── const.py
├── config/                 # 分环境配置
│   ├── __init__.py         # 默认配置
│   ├── local.py            # 本地开发
│   └── prod.py             # 生产环境
├── docs/                   # 项目文档
│   └── ARCHITECTURE.md
├── test/                   # 测试
├── scripts/                # 脚本
├── manage.py               # Django 管理命令
├── pyproject.toml          # Poetry 配置
├── poetry.lock             # 锁定依赖
└── ecosystem.config.js     # PM2 配置（可选）
```

## comic-auto-ui

```
comic-auto-ui/
├── src/
│   ├── main.js             # 应用入口
│   ├── App.vue             # 根组件
│   ├── router/
│   │   └── index.js        # 路由配置
│   ├── api/                # API 接口
│   │   ├── request.js      # Axios 封装
│   │   ├── auth.js
│   │   ├── subscription.js
│   │   ├── explore.js
│   │   ├── periodicTask.js
│   │   └── mediaServer.js
│   ├── components/         # 公共组件
│   │   ├── layout/         # 布局组件
│   │   │   ├── Layout.vue
│   │   │   ├── Sidebar.vue
│   │   │   └── SearchBar.vue
│   │   ├── AuthImage.vue
│   │   └── PageContainer.vue
│   ├── views/              # 页面视图
│   │   ├── Dashboard.vue
│   │   ├── Subscriptions.vue
│   │   ├── Explore.vue
│   │   │   └── components/
│   │   │       ├── SourceTabs.vue
│   │   │       ├── RankTabs.vue
│   │   │       ├── ComicGrid.vue
│   │   │       └── utils/
│   │   │           └── coverProxy.js
│   │   ├── Tasks.vue
│   │   │   └── components/
│   │   │       ├── TaskList.vue
│   │   │       └── TaskHistory.vue
│   │   ├── system/
│   │   │   ├── Settings.vue
│   │   │   └── components/
│   │   │       ├── BasicSettings.vue
│   │   │       └── MediaServerSettings.vue
│   │   └── Login.vue
│   ├── utils/              # 工具函数
│   │   ├── auth.js         # Token 管理
│   │   └── image-loader.js # 图片加载
│   └── assets/             # 静态资源
├── public/                 # 公共静态文件
├── android/                # Capacitor Android 项目
├── docs/                   # 项目文档
├── index.html
├── vite.config.js          # Vite 配置
├── package.json
└── ecosystem.config.cjs    # PM2 配置
```
