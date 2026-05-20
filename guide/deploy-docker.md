# Docker 部署

本文档介绍使用 Docker Compose 一键部署 Comic Auto 完整服务栈。

## 前置要求

- Docker >= 24.0
- Docker Compose >= 2.20

## 快速开始

### 1. 准备目录

```bash
sudo mkdir -p /opt/comic-auto
cd /opt/comic-auto
```

### 2. 创建 Docker Compose 文件

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: comic-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: comic_auto
      POSTGRES_USER: comic_user
      POSTGRES_PASSWORD: ${DB_PASSWORD:-changeme}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U comic_user -d comic_auto"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: comic-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  api:
    image: ${COMIC_IMAGE:-comic-app}:${IMAGE_TAG:-latest}
    container_name: comic-api
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://comic_user:${DB_PASSWORD:-changeme}@db:5432/comic_auto
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY:-your-secret-key-change-me}
      - DEBUG=False
      - ALLOWED_HOSTS=${ALLOWED_HOSTS:-*}
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/0
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
      - ./media:/app/media
      - ./static:/app/static
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             daphne -b 0.0.0.0 -p 8000 comic_auto.asgi:application"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v1/auth/verify/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  celery-worker:
    image: ${COMIC_IMAGE:-comic-app}:${IMAGE_TAG:-latest}
    container_name: comic-celery-worker
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://comic_user:${DB_PASSWORD:-changeme}@db:5432/comic_auto
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY:-your-secret-key-change-me}
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/0
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
      - ./media:/app/media
    depends_on:
      - db
      - redis
      - api
    command: >
      celery -A comic_auto worker --loglevel=info --concurrency=4

  celery-beat:
    image: ${COMIC_IMAGE:-comic-app}:${IMAGE_TAG:-latest}
    container_name: comic-celery-beat
    restart: unless-stopped
    environment:
      - DATABASE_URL=postgresql://comic_user:${DB_PASSWORD:-changeme}@db:5432/comic_auto
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY:-your-secret-key-change-me}
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/0
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    depends_on:
      - db
      - redis
      - api
    command: >
      celery -A comic_auto beat --scheduler django_celery_beat.schedulers:DatabaseScheduler --loglevel=info

  nginx:
    image: nginx:alpine
    container_name: comic-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./ui/dist:/usr/share/nginx/html:ro
      - ./static:/usr/share/nginx/static:ro
      - ./media:/usr/share/nginx/media:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
```

### 3. 创建 Nginx 配置

```bash
cat > nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    
    # 前端
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # 静态文件
    location /static/ {
        alias /usr/share/nginx/static/;
        expires 30d;
    }
    
    # 媒体文件
    location /media/ {
        alias /usr/share/nginx/media/;
        expires 7d;
    }
    
    # API
    location /api/ {
        proxy_pass http://api:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket
    location /ws/ {
        proxy_pass http://api:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
    
    # Swagger
    location /api/docs/ {
        proxy_pass http://api:8000;
    }
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
EOF
```

### 4. 创建环境变量文件

```bash
cat > .env << 'EOF'
# 数据库密码
DB_PASSWORD=YourStrongPassword123

# Django 密钥
SECRET_KEY=your-very-long-secret-key-here-min-50-chars

# 允许访问的域名
ALLOWED_HOSTS=your-domain.com,localhost

# 镜像配置
COMIC_IMAGE=comic-app
IMAGE_TAG=latest
EOF
```

### 5. 启动服务

```bash
docker compose up -d
```

### 6. 初始化数据

```bash
# 创建超级用户
docker compose exec api python manage.py createsuperuser

# 初始化定时任务
docker compose exec api python manage.py init_periodic_tasks
```

### 7. 查看状态

```bash
docker compose ps
docker compose logs -f api
```

## GitLab CI/CD 自动构建

项目已配置 `.gitlab-ci.yml`，支持自动构建和部署：

### CI 流程

```
git push origin master
    │
    ▼
GitLab CI 触发 Build 阶段
    │
    ├── 克隆前端仓库
    ├── 构建 Docker 镜像
    └── 标记 latest 和 commit SHA
    │
    ▼
git tag v1.x.x 触发 Push 阶段
    │
    ├── 推送镜像到 TCR 仓库
    └── 标记版本号
    │
    ▼
Deploy 阶段
    │
    └── 在部署服务器上 docker compose up -d
```

### 部署服务器配置

在部署服务器上准备：

```bash
sudo mkdir -p /opt/comic-auto
cd /opt/comic-auto

# 创建 docker-compose.yml（从仓库复制）
# 创建 .env
# 配置 GitLab Runner
```

## 日常运维

### 查看日志

```bash
# 所有服务
docker compose logs -f

# 指定服务
docker compose logs -f api
docker compose logs -f celery-worker
```

### 更新服务

```bash
# 拉取新镜像
docker compose pull

# 重启服务
docker compose up -d

# 数据库迁移
docker compose exec api python manage.py migrate

# 收集静态文件
docker compose exec api python manage.py collectstatic --noinput
```

### 备份数据库

```bash
# 手动备份
docker compose exec db pg_dump -U comic_user comic_auto > backup_$(date +%Y%m%d).sql

# 恢复备份
docker compose exec -T db psql -U comic_user comic_auto < backup_20240101.sql
```

### 清理旧镜像

```bash
# 清理悬空镜像
docker image prune -f

# 清理停止的容器
docker container prune -f
```

## 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker compose logs api

# 检查环境变量
docker compose exec api env | grep -E "DATABASE|REDIS|SECRET"

# 测试数据库连接
docker compose exec api python -c "import psycopg2; conn = psycopg2.connect('postgresql://comic_user:pass@db:5432/comic_auto'); print('OK')"
```

### 前端显示空白

```bash
# 确认构建产物存在
ls -la /opt/comic-auto/ui/dist/

# 重新构建前端
cd /path/to/comic-auto-ui
npm run build
sudo cp -r dist/* /opt/comic-auto/ui/dist/
```

### 定时任务不执行

```bash
# 检查 Beat 状态
docker compose logs celery-beat

# 检查 Worker 状态
docker compose logs celery-worker

# 查看已注册任务
docker compose exec api celery -A comic_auto inspect registered
```
