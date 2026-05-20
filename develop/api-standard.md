# API 接口规范

本文档定义了项目后端接口的统一响应格式标准。

## 响应格式标准

所有接口响应必须遵循以下统一格式：

```json
{
  "code": 0,
  "msg": "success",
  "data": { ... }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `code` | `number` | 状态码，`0` 表示成功，非 `0` 表示失败 |
| `msg` | `string` | 响应消息，成功时为 `"success"`，失败时为具体错误信息 |
| `data` | `any` | 响应数据，根据接口类型不同而不同 |

## 响应类型

### 1. 分页列表

用于需要分页的列表数据接口。

**响应格式：**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "page_size": 20,
    "total_pages": 5
  }
}
```

**data 字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `items` | `array` | 当前页数据列表 |
| `total` | `number` | 总记录数 |
| `page` | `number` | 当前页码（从 1 开始） |
| `page_size` | `number` | 每页记录数 |
| `total_pages` | `number` | 总页数 |

**示例接口：**
- `GET /api/v1/app/periodic-tasks/` - 定时任务列表
- `GET /api/v1/app/tasks/history/` - 任务执行历史

### 2. 非分页列表

用于不需要分页的列表数据接口。

**响应格式：**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "items": [...],
    "total": 10
  }
}
```

**示例接口：**
- `GET /api/v1/app/subscriptions/` - 订阅漫画列表
- `GET /api/v1/app/media-servers/` - 媒体服务器配置列表

### 3. 单条数据

用于返回单个对象数据的接口。

**响应格式：**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": 1,
    "name": "xxx",
    ...
  }
}
```

**示例接口：**
- `GET /api/v1/app/subscriptions/{id}/` - 订阅漫画详情
- `GET /api/v1/app/media-servers/{type}/` - 指定类型媒体服务器配置

### 4. 操作结果

用于增删改等操作接口，返回操作结果信息。

**响应格式：**

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "message": "操作成功"
  }
}
```

**示例接口：**
- `POST /api/v1/app/periodic-tasks/{id}/run/` - 立即执行定时任务
- `PUT /api/v1/app/media-servers/{type}/` - 保存媒体服务器配置
- `POST /api/v1/app/explore/subscribe/` - 添加漫画订阅

## 错误响应

当接口发生错误时，响应格式如下：

```json
{
  "code": 1001,
  "msg": "具体错误信息",
  "data": null
}
```

**常见错误码：**

| 错误码 | 说明 |
|--------|------|
| `1001` | 参数错误 |
| `1002` | 数据不存在 |
| `1003` | 权限不足 |
| `1004` | 操作失败 |
| `401` | 未授权（token 失效） |
| `500` | 服务器内部错误 |

## 后端实现

**必须使用 `utils.restful` 工具函数：**

```python
from utils.restful import success_response, error_response

# 成功响应
return success_response(data={...}, msg='success', http_status=200)

# 错误响应
return error_response(msg='错误描述', data=None, http_status=400)
```

**禁止使用 `Response()` 直接构造响应。**

## 前端处理

前端通过 `src/api/request.js` 的响应拦截器统一处理标准格式：

```javascript
request.interceptors.response.use(
  (response) => {
    const { code, msg, data } = response.data

    // 标准格式校验
    if (code !== undefined) {
      if (code !== 0) {
        return Promise.reject(new Error(msg || '请求失败'))
      }
      return data
    }

    // 兼容旧格式
    return response.data
  },
  // ... 错误处理
)
```

**使用示例：**

```javascript
// 分页列表
const result = await getSubscriptions()
console.log(result.items)   // 数据列表
console.log(result.total)   // 总记录数

// 单条数据
const detail = await getSubscriptionDetail(id)
console.log(detail.name)

// 操作结果
const res = await runTask(id)
console.log(res.message)
```

## 注意事项

1. **所有接口必须遵循统一格式**，不得随意修改响应结构
2. **错误信息必须清晰明确**，便于前端展示和调试
3. **分页参数统一使用** `page` 和 `page_size`
4. **列表数据统一使用** `items` 字段，不要使用 `result`
5. **总数统一使用** `total` 字段，不要使用 `count`
6. **单条数据直接返回**，不要包裹 `result` 层级
