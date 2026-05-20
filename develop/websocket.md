# WebSocket 实时日志

本文档介绍 WebSocket 实时任务日志系统的设计和使用。

## 架构组件

| 组件 | 文件 | 说明 |
|------|------|------|
| WebSocket 消费者 | `app/consumers.py` | `TaskLogConsumer`，基于 Django Channels |
| 日志存储 | `utils/task_log_storage.py` | Redis 日志存储（DB 2，TTL 7天） |
| 日志处理器 | `utils/task_log_handler.py` | 自定义 Handler，拦截并推送日志 |

## 连接流程

```
客户端连接 ws://host/ws/tasks/<task_id>/
    │
    ├── 1. 加入 Channel Layer group
    ├── 2. 推送最近 100 条历史日志（从 Redis 读取）
    ├── 3. 任务执行中实时推送新日志
    ├── 4. 任务结束时发送 done/error 事件
    └── 5. 客户端可发送 {"action": "cancel"} 取消任务
```

## 消息格式

### 日志消息

```json
{
  "type": "log",
  "level": "info",
  "message": "开始下载第 1 章...",
  "timestamp": "2024-01-01 12:00:00"
}
```

### 进度消息

```json
{
  "type": "progress",
  "current": 5,
  "total": 10,
  "extra": {
    "chapter": "第 5 章",
    "speed": "1.2 MB/s"
  }
}
```

### 搜索结果消息

```json
{
  "type": "search_result",
  "platform": "腾讯漫画",
  "crawling_type": "acqq",
  "category": "chinese",
  "result": {...},
  "timestamp": "2024-01-01 12:00:00"
}
```

### 完成消息

```json
{
  "type": "done",
  "result": {
    "downloaded": 10,
    "failed": 0,
    "time_cost": "2m 30s"
  }
}
```

### 错误消息

```json
{
  "type": "error",
  "message": "连接超时，请稍后重试"
}
```

### 取消确认

```json
{
  "type": "cancelled",
  "task_id": "abc-123-def"
}
```

## 客户端实现

### JavaScript 示例

```javascript
class TaskLogClient {
  constructor(taskId, baseUrl = '') {
    this.taskId = taskId
    this.ws = new WebSocket(`ws://${window.location.host}/ws/tasks/${taskId}/`)
    this.setupHandlers()
  }

  setupHandlers() {
    this.ws.onopen = () => {
      console.log('WebSocket 连接成功')
    }

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      this.handleMessage(msg)
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket 错误:', error)
    }

    this.ws.onclose = () => {
      console.log('WebSocket 连接关闭')
    }
  }

  handleMessage(msg) {
    switch (msg.type) {
      case 'log':
        this.onLog?.(msg.level, msg.message, msg.timestamp)
        break
      case 'progress':
        this.onProgress?.(msg.current, msg.total, msg.extra)
        break
      case 'search_result':
        this.onSearchResult?.(msg.platform, msg.result)
        break
      case 'done':
        this.onDone?.(msg.result)
        this.ws.close()
        break
      case 'error':
        this.onError?.(msg.message)
        this.ws.close()
        break
      case 'cancelled':
        this.onCancelled?.(msg.task_id)
        break
    }
  }

  cancel() {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ action: 'cancel' }))
    }
  }
}

// 使用
const client = new TaskLogClient(taskId)
client.onLog = (level, message) => {
  console.log(`[${level}] ${message}`)
}
client.onProgress = (current, total) => {
  const percent = Math.round((current / total) * 100)
  updateProgressBar(percent)
}
client.onDone = (result) => {
  showSuccess(`任务完成，下载 ${result.downloaded} 章`)
}
```

## 支持的任务类型

| 任务 | 说明 |
|------|------|
| `check_crawling_station_task` | 站点检测 |
| `refresh_explore_task` | 探索刷新 |
| `refresh_rank_task` | 榜单刷新 |
| `match_subscription_source_task` | 订阅匹配 |
| `search_comic_task` | 漫画搜索 |
| `migrate_directory_data_task` | 数据迁移 |

## 注意事项

1. WebSocket 使用 Django Session 认证，需要先登录
2. 连接 URL 中的 `task_id` 来自异步 API 的响应
3. 单任务日志在 Redis 中最多保留 10000 条，7 天 TTL
4. 前端断开连接后重新连接会收到最近 100 条历史日志
