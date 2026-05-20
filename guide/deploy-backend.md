# 后端部署

本文档介绍 comic-auto-api（Django 后端）的部署方式。

## 方式一：PM2 部署（推荐开发/测试）

### 1. 进入项目目录

```bash
cd /opt/comic-auto-api
```

### 2. 安装依赖

```bash
poetry install --no-dev
```

### 3. 数据库迁移

```bash
poetry run python manage.py migrate
```

### 4. 创建超级用户

```bash
poetry run python manage.py createsuperuser
```

### 5. 初始化定时任务

```bash
poetry run python manage.py init_periodic_tasks
```

### 6. 配置 PM2

创建 `ecosystem.config.js`：

```javascript
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
        DJANGO_SETTINGS_MODULE: 'comic_auto.settings',
        PYTHONPATH: '.'
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
      out_file: './logs/celery-worker-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
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
      out_file: './logs/celery-beat-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

### 7. 创建日志目录

```bash
mkdir -p logs
```

### 8. 启动服务

```bash
pm2 start ecosystem.config.js
```

### 9. 查看状态

```bash
pm2 status
pm2 logs
```

### 10. 设置开机自启

```bash
pm2 save
pm2 startup
# 按提示执行生成的命令
```

### PM2 常用命令

```bash
# 查看状态
pm2 status
pm2 show comic-django

# 查看日志
pm2 logs
pm2 logs comic-django --lines 100
pm2 logs --err

# 重启
pm2 restart all
pm2 restart comic-django

# 停止
pm2 stop all
pm2 stop comic-django

# 重载配置
pm2 reload ecosystem.config.js

# 清空日志
pm2 flush
```

## 方式二：Gunicorn + Nginx（推荐生产）

对于生产环境，建议使用 Gunicorn 代替 Daphne（仅 HTTP 请求），或保留 Daphne 以支持 WebSocket。

### Daphne + Nginx（支持 WebSocket）

```bash
# 直接使用 Daphne（已包含在 PM2 配置中）
poetry run daphne -b 0.0.0.0 -p 8000 comic_auto.asgi:application
```

### Nginx 反向代理配置

```
upstream django_backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your-domain.com;
    
    # 静态文件
    location /static/ {
        alias /opt/comic-auto-api/static/;
        expires 30d;
    }
    
    # 媒体文件
    location /media/ {
        alias /opt/comic-auto-api/media/;
        expires 7d;
    }
    
    # WebSocket
    location /ws/ {
        proxy_pass http://django_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
    
    # API
    location /api/ {
        proxy_pass http://django_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Swagger 文档
    location /api/docs/ {
        proxy_pass http://django_backend;
        proxy_set_header Host $host;
    }
}
```

## 后端更新

```bash
cd /opt/comic-auto-api

# 拉取最新代码
git pull origin master

# 更新依赖
poetry install --no-dev

# 数据库迁移
poetry run python manage.py migrate

# 收集静态文件
poetry run python manage.py collectstatic --noinput

# 重启 PM2 服务
pm2 reload ecosystem.config.js
```

## 故障排查

### 服务无法启动

```bash
# 检查日志
pm2 logs --err

# 检查环境变量
pm2 show comic-django

# 手动测试启动
poetry run daphne -b 0.0.0.0 -p 8000 comic_auto.asgi:application
```

### 数据库连接失败

```bash
# 检查 PostgreSQL 状态
sudo systemctl status postgresql

# 测试连接
psql postgresql://user:pass@localhost:5432/comic_auto -c "SELECT 1"
```

### Redis 连接失败

```bash
# 检查 Redis 状态
sudo systemctl status redis-server
redis-cli ping
```

### Celery 任务不执行

```bash
# 检查 Worker 状态
pm2 logs comic-celery-worker

# 检查 Beat 状态
pm2 logs comic-celery-beat

# 查看任务队列
poetry run celery -A comic_auto inspect active
poetry run celery -A comic_auto inspect scheduled
```
