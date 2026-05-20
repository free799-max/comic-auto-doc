# API 文档

Comic Auto 后端使用 drf-spectacular 自动生成 API 文档。

## 访问地址

启动后端服务后，可通过以下地址访问：

| 文档类型 | 地址 |
|----------|------|
| Swagger UI | `http://localhost:8000/api/docs/swagger/` |
| ReDoc | `http://localhost:8000/api/docs/redoc/` |
| OpenAPI Schema | `http://localhost:8000/api/docs/schema/` |

## API 路由

### 认证接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/auth/login/` | 登录（返回 access/refresh/user/abilities） |
| POST | `/api/v1/auth/refresh/` | 刷新 token |
| POST | `/api/v1/auth/verify/` | 验证 token |

### 业务接口（前缀 `/api/v1/app/`）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/stations/` | 查询站点检测结果 |
| POST | `/stations/check/` | 触发站点检测（支持 async=true） |
| GET/POST | `/subscriptions/` | 订阅列表（支持过滤和分页） |
| GET/PUT/PATCH/DELETE | `/subscriptions/<id>/` | 订阅详情 |
| POST | `/subscriptions/<id>/process/` | 手动触发订阅处理 |
| GET | `/media-servers/` | 查询所有媒体服务器配置 |
| GET/PUT/DELETE | `/media-servers/<server_type>/` | 单个配置（komga/kavita） |
| POST | `/media-servers/<server_type>/test/` | 测试连接 |
| POST | `/explore/search/` | 搜索漫画（异步任务） |
| GET | `/explore/` | 探索发现（榜单聚合） |
| GET | `/periodic-tasks/` | 定时任务列表 |
| POST | `/periodic-tasks/<id>/run/` | 手动执行定时任务 |

### WebSocket 接口

WebSocket 接口不会出现在 Swagger 文档中。

| URL | 说明 |
|-----|------|
| `ws://host/ws/tasks/<task_id>/` | 任务实时日志 |

### 代理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/app/proxy/cover/` | 图片代理（需 url 和 source 参数） |

## 文档规范

所有 API 接口必须添加 `@extend_schema` 装饰器：

```python
from drf_spectacular.utils import extend_schema, inline_serializer

@extend_schema(
    tags=['分组名'],
    summary='接口描述',
    operation_id='unique_id',
    request=RequestSerializer,
    responses={200: ResponseSchema},
)
def get(self, request):
    pass
```

## 认证方式

Swagger UI 支持 JWT Token 认证：

1. 点击 **Authorize**
2. 输入 `Bearer <your-access-token>`
3. 所有请求将自动携带认证头

## 导出 OpenAPI

```bash
# 导出 JSON
python manage.py spectacular --file openapi.json

# 导出 YAML
python manage.py spectacular --file openapi.yaml --format openapi
```
