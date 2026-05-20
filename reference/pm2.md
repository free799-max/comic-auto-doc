# PM2 使用指南

本文档介绍 PM2 进程管理器的使用方法。

## 配置文件

### 后端配置

```javascript
// comic-auto-api/ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'comic-django',
      script: 'poetry',
      args: 'run daphne -b 0.0.0.0 -p 8000 comic_auto.asgi:application',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        DJANGO_SETTINGS_MODULE: 'comic_auto.settings'
      },
      error_file: './logs/django-error.log',
      out_file: './logs/django-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'comic-celery-worker',
      script: 'poetry',
      args: 'run celery -A comic_auto worker --loglevel=info --concurrency=4',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        DJANGO_SETTINGS_MODULE: 'comic_auto.settings'
      },
      error_file: './logs/celery-worker-error.log',
      out_file: './logs/celery-worker-out.log'
    },
    {
      name: 'comic-celery-beat',
      script: 'poetry',
      args: 'run celery -A comic_auto beat --scheduler django_celery_beat.schedulers:DatabaseScheduler --loglevel=info',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        DJANGO_SETTINGS_MODULE: 'comic_auto.settings'
      },
      error_file: './logs/celery-beat-error.log',
      out_file: './logs/celery-beat-out.log'
    }
  ]
};
```

### 前端配置

```javascript
// comic-auto-ui/ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'comic-ui',
      script: 'npm',
      args: 'run preview -- --host 0.0.0.0 --port 3000',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 3000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ]
};
```

## 常用命令

### 启动

```bash
# 启动所有服务
pm2 start ecosystem.config.js

# 启动单个服务
pm2 start ecosystem.config.js --only comic-django
```

### 停止

```bash
# 停止所有
pm2 stop all

# 停止单个
pm2 stop comic-django
```

### 重启

```bash
# 重启所有
pm2 restart all

# 重启单个
pm2 restart comic-django

# 重载配置
pm2 reload ecosystem.config.js
```

### 删除

```bash
pm2 delete all
pm2 delete comic-django
```

### 查看状态

```bash
# 列表
pm2 status

# 详情
pm2 show comic-django

# 实时监控
pm2 monit
```

### 日志

```bash
# 所有日志
pm2 logs

# 单个服务
pm2 logs comic-django
pm2 logs comic-celery-worker
pm2 logs comic-celery-beat

# 指定行数
pm2 logs comic-django --lines 100

# 仅错误
pm2 logs --err

# 清空
pm2 flush
```

### 开机自启

```bash
# 保存当前进程
pm2 save

# 生成启动脚本
pm2 startup

# 按提示执行生成的命令
# 例如：sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u username --hp /home/username

# 取消
pm2 unstartup systemd
```

## 配置调整

| 参数 | 说明 | 示例 |
|------|------|------|
| `concurrency` | Celery Worker 并发数 | `--concurrency=4` |
| `max_memory_restart` | 内存限制自动重启 | `'2G'` |
| `port` | Django 端口 | `-p 8000` |
| `log_date_format` | 日志时间格式 | `'YYYY-MM-DD HH:mm:ss Z'` |

修改配置后执行：

```bash
pm2 reload ecosystem.config.js
```

## 注意事项

1. 确保 Redis 已启动（Celery 依赖）
2. 确保数据库已迁移
3. 首次启动前初始化定时任务：`python manage.py init_periodic_tasks`
4. 日志自动轮转，避免磁盘占满
5. 生产环境建议 Gunicorn + Nginx 代替 Daphne 直接暴露
