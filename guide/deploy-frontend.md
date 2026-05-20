# 前端部署

本文档介绍 comic-auto-ui（Vue 3 前端）的部署方式。

## 方式一：Nginx 静态托管（推荐生产）

### 1. 构建生产版本

```bash
cd /opt/comic-auto-ui

# 安装依赖
npm install

# 构建
npm run build
```

构建产物位于 `dist/` 目录。

### 2. Nginx 配置

```
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端静态文件
    location / {
        root /opt/comic-auto-ui/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # 缓存策略
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API 反向代理到后端
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # WebSocket 代理
    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### 3. 重载 Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 方式二：PM2 部署（开发/测试）

使用 PM2 运行 Vite preview 或 dev 模式：

### ecosystem.config.cjs

```javascript
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

### 启动

```bash
npm run build
pm2 start ecosystem.config.cjs
```

## 环境变量配置

### 开发环境

创建 `.env`：

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 生产环境

创建 `.env.production`：

```
VITE_API_BASE_URL=           # 留空使用相对路径
```

生产环境前端 API 请求使用相对路径，通过 Nginx 反向代理到后端：

```javascript
// 生产环境
const apiClient = axios.create({
  baseURL: ''  // 相对路径，如 /api/v1/...
});
```

## PWA 配置

前端已集成 Vite PWA 插件，支持：

- 自动注册 Service Worker
- 静态资源缓存
- 离线访问
- 添加到主屏幕

### 构建后验证 PWA

使用 Chrome DevTools → Lighthouse 检测 PWA 合规性。

## 前后端合一部署

### 目录结构

```
/opt/comic-auto/
├── api/                    # 后端代码
│   ├── app/
│   ├── comic_auto/
│   └── ...
├── ui/                     # 前端代码
│   ├── dist/               # 构建产物
│   └── ...
├── docker-compose.yml      # Docker 部署
└── nginx.conf              # Nginx 配置
```

### Nginx 合一配置

```
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端
    location / {
        root /opt/comic-auto/ui/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # 后端 API
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # WebSocket
    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Swagger 文档
    location /api/docs/ {
        proxy_pass http://127.0.0.1:8000;
    }
}
```

## 前端更新

```bash
cd /opt/comic-auto-ui

# 拉取最新代码
git pull origin master

# 重新构建
npm install
npm run build

# 如果使用 PM2
pm2 restart comic-ui

# 如果使用 Nginx，无需重启（静态文件已更新）
```

## 常见问题

### 路由 404

确保 Nginx 配置了 `try_files $uri $uri/ /index.html`，因为前端是 SPA。

### API 跨域

如果前后端分开域名部署，后端需配置 CORS：

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
]
```

或使用相对路径部署在同一域名下。

### 缓存未更新

强制刷新浏览器或配置 Nginx 禁用 HTML 缓存：

```
location / {
    root /opt/comic-auto-ui/dist;
    try_files $uri $uri/ /index.html;
    
    # HTML 不缓存
    location ~* \.html$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```
