# 快速开始

**漫画订阅自动化管理系统**，深度集成 **Komga / Kavita** 主流阅读器，轻松搭建专属私有漫画库。全程实现**一键订阅、自动下载、智能整理、实时追更**全自动化流程，告别手动操作，高效管理个人漫画资源，随时随地沉浸式阅漫。

## 功能概览

| 功能 | 说明 |
|------|------|
| 🔍 探索发现 | 聚合多平台榜单，发现新漫画 |
| 📚 智能刮削 | 自动补全封面、作者、标签、简介，漫画库 |
| 📺 媒体库 | 集成 Komga / Kavita，自动完成元数据刮削 |
| 🤖 智能支持 | 可接入 OpenClaw、Hermes 等 AI 智能体 |
| 🔔 订阅追更 | 添加漫画订阅后，自动检查更新及入库      |
| 📱 移动支持 | PWA + Android App，随时随地看漫画 |

## 快速部署

### 方式一：单 Docker 命令

所有服务合成一个容器启动：

```bash
docker run -d \
    --name comic-app \
    --restart unless-stopped \
    -p 8055:80 \
    -v {替换为本机的数据目录}:/var/lib/postgresql/16/main \
    -v {替换为本机的漫画保存}:/mnt/media \
    comic-app:latest
```

### 方式二：Docker Compose

将数据库和应用分开启动：

```bash
# 准备目录
mkdir -p /opt/comic-auto && cd /opt/comic-auto

# 创建 docker-compose.yml 和 .env 后启动
docker compose up -d

# 创建管理员账号
docker compose exec api python manage.py createsuperuser
```

访问 `http://ip:8055` 即可开始使用。
