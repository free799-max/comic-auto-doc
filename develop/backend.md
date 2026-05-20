# 后端开发

本文档介绍 comic-auto-api 的后端开发规范和核心模块使用。

## 三层架构

后端严格遵循 **View → Service → Repository** 三层架构。

### View 层

职责：
- 参数解析
- 权限校验
- 返回格式化
- **不含业务逻辑**

```python
from drf_spectacular.utils import extend_schema
from app.services.subscription.service import ComicSubscriptionService
from utils.restful import success_response

class SubscriptionView(APIView):
    @extend_schema(
        tags=['订阅管理'],
        summary='订阅列表',
        operation_id='subscription_list',
        responses={200: SubscriptionListSchema}
    )
    def get(self, request):
        keyword = request.query_params.get('keyword')
        result = ComicSubscriptionService.list_subscriptions(keyword=keyword)
        return success_response(result)
```

### Service 层

职责：
- 业务编排
- 可被 View 和 Celery Task 复用
- 处理业务规则和数据转换

```python
class ComicSubscriptionService:
    @staticmethod
    def list_subscriptions(keyword=None):
        queryset = SubscriptionRepository.search(keyword)
        return build_paginated_result(
            queryset=queryset,
            request=request,
            serializer_class=SubscriptionSerializer
        )
```

### Repository 层

职责：
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

## 核心工具

### 日志

```python
from utils.util import record_logger

logger = record_logger(__name__)

logger.info('开始处理订阅')
logger.exception('处理失败')  # 自动记录堆栈
```

### HTTP 请求

```python
from utils.util import Request

request = Request()
response = request.get('https://example.com/api')
```

### Playwright 浏览器

```python
from utils.playwright_wrapper import PlaywrightWrapper

with PlaywrightWrapper(simulate=True) as play_wrap:
    page = play_wrap.page
    page.goto('https://example.com')
```

### 媒体服务器

```python
from utils.media_server import KomgaApi, KavitaApi
from utils.media_server.factory import get_enabled_servers

# 获取所有启用的服务器
servers = get_enabled_servers()

# 直接使用
komga = KomgaApi()
komga.scan_library()
```

### 分页

```python
from utils.pagination import build_paginated_result
from utils.restful import success_response

paginated_data = build_paginated_result(
    queryset=queryset,
    request=request,
    serializer_class=MySerializer,
)
return success_response(paginated_data)
```

### 配置管理

```python
from utils.config_manager import ConfigManager

config_mgr = ConfigManager()
cache_dir = config_mgr.get_cache_dir()
download_dir = config_mgr.get_download_dir()
```

## 爬虫开发

### 新爬虫规范

新爬虫必须继承 `CrawBase` 并实现以下方法：

```python
from crawling.base import CrawBase

class ComicCrawler(CrawBase):
    def search_comic(self, comic_name, vague=True):
        """搜索漫画"""
        pass

    def get_comic_info(self, comic_name, comic_href):
        """获取漫画详情"""
        pass

    def download_comic_chapter(self, comic_name, chapter_index, chapter_href):
        """下载章节"""
        pass

    def convert_chapter_title(self, chapter_title):
        """转换章节标题"""
        pass

    def convert_comic_status(self, status):
        """转换漫画状态"""
        pass
```

### 爬虫目录

按漫画类型放置：

```
crawling/
├── chinese/          # 国漫
│   ├── acqq.py
│   └── bakamh.py
├── manhwa/           # 韩漫
│   └── manhuadb.py
├── manga/            # 日漫
├── manhwa18/         # 成人内容
└── scrape/           # 元数据刮削
```

### 内置能力

`CrawBase` 已提供：

- `download_chapter_img()`: ThreadPoolExecutor 并发下载
- `zip_book_chapter()`: 打包为 CBZ
- `check_str_equal()`: 简繁体比较（OpenCC）
- `comic_scrape()`: 刮削接口

## Celery 任务

### 定义任务

```python
from celery import shared_task
from app.services.subscription.process_service import ComicSubscriptionProcessService

@shared_task
def process_subscription_task(subscription_id):
    """处理单个订阅"""
    service = ComicSubscriptionProcessService()
    service.process_subscription(subscription_id)
```

### 调用任务

```python
# 同步调用
process_subscription_task.delay(subscription_id)

# 异步调用（获取 task_id）
result = process_subscription_task.apply_async(args=[subscription_id])
print(result.id)
```

## API 文档规范

所有 API 接口必须添加 `@extend_schema` 装饰器：

```python
from drf_spectacular.utils import extend_schema, inline_serializer

@extend_schema(
    tags=['分组名'],              # 必填，中文
    summary='接口描述',           # 必填，中文
    operation_id='unique_id',     # 必填，英文 snake_case
    request=RequestSerializer,    # 可选
    responses={200: ResponseSchema},  # 必填
)
def get(self, request):
    pass
```

**规范要点：**
- tags 使用中文，同模块接口用相同 tag
- operation_id 全局唯一，格式 `模块_动作`
- 所有字段必须添加 `help_text` 中文说明

## 数据库迁移

```bash
# 生成迁移
python manage.py makemigrations

# 执行迁移
python manage.py migrate

# 检查
python manage.py check
```

## 开发命令

```bash
# 启动服务
daphne -b 0.0.0.0 -p 8000 comic_auto.asgi:application

# Celery Worker
celery -A comic_auto worker --loglevel=info --concurrency=4

# Celery Beat
celery -A comic_auto beat --scheduler django_celery_beat.schedulers:DatabaseScheduler

# 测试
pytest
python test/test_comic_sub.py
```
