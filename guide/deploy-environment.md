# 环境准备

本文档介绍 Comic Auto 运行所需的系统环境和依赖安装。

## 系统要求

### 操作系统

- **推荐**: Ubuntu 22.04 LTS / Debian 12 / CentOS Stream 9
- **支持**: macOS 14+ (开发环境)
- **Windows**: 需要 WSL2 或 Docker 环境

### 硬件要求

| 组件 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CPU | 2 核 | 4 核 |
| 内存 | 4 GB | 8 GB |
| 磁盘 | 50 GB | 200 GB+（视漫画库大小） |
| 网络 | 10 Mbps | 100 Mbps |

## 依赖安装

### 1. Python 3.10+

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y python3.10 python3.10-venv python3.10-dev python3-pip

# 验证
python3 --version
```

### 2. Poetry 依赖管理

```bash
# 安装 Poetry
curl -sSL https://install.python-poetry.org | python3 -

# 添加到 PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# 验证
poetry --version
```

### 3. PostgreSQL 13+

```bash
# Ubuntu/Debian
sudo apt install -y postgresql postgresql-contrib

# 启动服务
sudo systemctl enable postgresql
sudo systemctl start postgresql

# 创建数据库和用户
sudo -u postgres psql <<EOF
CREATE DATABASE comic_auto;
CREATE USER comic_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE comic_auto TO comic_user;
ALTER DATABASE comic_auto OWNER TO comic_user;
EOF

# 验证
sudo -u postgres psql -c "\l" | grep comic_auto
```

### 4. Redis 6+

```bash
# Ubuntu/Debian
sudo apt install -y redis-server

# 启动服务
sudo systemctl enable redis-server
sudo systemctl start redis-server

# 验证
redis-cli ping
# 应返回 PONG
```

**Redis 数据库分配:**

编辑 `/etc/redis/redis.conf`（可选）：

```bash
# 默认数据库数（默认 16 个，足够使用）
databases 16

# 持久化配置（建议生产环境启用）
save 900 1
save 300 10
save 60 10000
```

### 5. Node.js 18+

```bash
# 使用 NodeSource 安装
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 验证
node --version
npm --version
```

### 6. Playwright 依赖

Playwright 需要系统级浏览器依赖：

```bash
# 安装系统依赖
sudo apt install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2
```

### 7. Nginx（推荐）

```bash
sudo apt install -y nginx

# 验证
nginx -v
```

### 8. PM2（推荐）

```bash
sudo npm install -g pm2

# 验证
pm2 --version
```

## 环境变量配置

后端项目需要配置以下环境变量：

```bash
# 数据库
DATABASE_URL=postgresql://comic_user:your_password@localhost:5432/comic_auto

# Redis
REDIS_URL=redis://localhost:6379/0

# Django
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,localhost

# 媒体服务器（可选）
KOMGA_URL=http://localhost:25600
KOMGA_USER=admin
KOMGA_PWD=password
```

创建 `.env` 文件：

```bash
cd comic-auto-api
cp .env.example .env
# 编辑 .env 填入实际配置
```

## 可选组件

### Komga 媒体服务器

```bash
# Docker 方式运行
docker run -d \
  --name komga \
  -p 25600:25600 \
  -v /your/comics:/data \
  -v komga-config:/config \
  gotson/komga:latest
```

### Kavita 媒体服务器

```bash
# Docker 方式运行
docker run -d \
  --name kavita \
  -p 5000:5000 \
  -v /your/comics:/manga \
  -v kavita-config:/kavita/config \
  jvmilazz0/kavita:latest
```

## 验证安装

运行以下命令验证所有依赖是否正常：

```bash
# Python
python3 --version
poetry --version

# 数据库
sudo -u postgres psql -c "SELECT 1"
redis-cli ping

# Node
node --version
npm --version

# Nginx
nginx -v

# PM2
pm2 --version
```

全部通过后即可进入下一步 [后端部署](/guide/deploy-backend)。
