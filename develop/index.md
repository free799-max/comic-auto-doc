# 开发指南

本文档面向开发者，介绍 Comic Auto 的开发规范和最佳实践。

## 开发环境搭建

### 后端开发

```bash
cd comic-auto-api

# 安装依赖
poetry install

# 激活虚拟环境
poetry shell

# 数据库迁移
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 启动开发服务器
daphne -b 0.0.0.0 -p 8000 comic_auto.asgi:application

# 另开终端启动 Celery
celery -A comic_auto worker --loglevel=info --concurrency=4
celery -A comic_auto beat --scheduler django_celery_beat.schedulers:DatabaseScheduler --loglevel=info
```

### 前端开发

```bash
cd comic-auto-ui

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端默认运行在 `http://localhost:3000`。

## 项目规范

- **注释语言**: 中文
- **命名规范**:
  - 类: `PascalCase`
  - 函数/变量: `snake_case`
  - 常量: `UPPER_CASE`
  - 私有成员: `_leading_underscore`
- **导入顺序**: 标准库 → 第三方库 → 项目内模块
- **错误日志**: 使用 `logger.exception()` 保留堆栈
- **业务日志**: 使用 `logger.info()`

## 代码规范

### 后端

```python
from utils.util import record_logger

logger = record_logger(__name__)

# 正确
logger.info('开始处理订阅')
logger.exception('处理失败')

# 错误
print('调试信息')  # 禁止使用 print
```

### 前端

- 使用 `<script setup>` Composition API
- 组件文件使用 `PascalCase`
- 路由路径使用 `kebab-case`
- UI 组件统一使用 Naive UI（`n-` 前缀）

## 文档导航

- [API 接口规范](/develop/api-standard) - 后端接口响应格式标准
- [后端开发](/develop/backend) - Django 后端开发指南
- [前端开发](/develop/frontend) - Vue 3 前端开发指南
- [WebSocket 实时日志](/develop/websocket) - 实时任务日志系统
