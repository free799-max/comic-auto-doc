# 快速开始

**漫画订阅自动化管理系统**，深度集成 **Komga / Kavita** 主流阅读器，轻松搭建专属私有漫画库。全程实现**一键订阅、自动下载、智能整理、实时追更**全自动化流程，告别手动操作，高效管理个人漫画资源，随时随地沉浸式阅漫。

推荐搭配使用的软件为：[Komga](https://komga.org/docs/installation/docker)（漫画管理端）+ [Komelia](https://github.com/Snd-R/Komelia/releases)（安卓应用）：

## 功能概览

| 功能 | 说明 |
|------|------|
| 🔍 探索发现 | 聚合多平台榜单，发现新漫画 |
| 📚 智能刮削 | 自动补全封面、作者、标签、简介，漫画库 |
| 📺 媒体库 | 集成 Komga / Kavita，自动完成元数据刮削 |
| 🤖 智能支持 | 可接入 OpenClaw、Hermes 等 AI 智能体 |
| 🔔 订阅追更 | 添加漫画订阅后，自动检查更新及入库      |
| 📱 移动支持 | PWA + Android App，随时随地看漫画 |

## 功能限制

| 功能 | 未激活 | 基础版 | 高级版 | 旗舰版 |
|--------|:------:|:------:|:------:|:------:|
| 漫画探索发现 | ✅ | ✅ | ✅ | ✅ |
| 媒体库刮削 | ✅ | ✅ | ✅ | ✅ |
| 站点管理 | ✅ | ✅ | ✅ | ✅ |
| 漫画追更订阅 | ✅ | ✅ | ✅ | ✅ |
| 从漫画平台同步收藏 | ✅ | ✅ | ✅ | ✅ |
| 新章节自动下载入库 | ❌ | ✅ | ✅ | ✅ |
| 云端漫画数据服务 | ❌ | ❌ | ✅ | ✅ |
| 专属下载服务器 | ❌ | ❌ | ❌ | ✅ |

各档位的详细区别见 [定价](/pricing.html)。

::: tip 高级版及以上：下载源双重保障
- **下载源自动切换**：当下载站点失效、访问异常或章节缺失时，系统会自动切换到其他可用源继续下载，追更不中断；基础版固定使用单一站点，站点出问题时只能手动等待或更换。
- **AI 识别优选画质**：下载源经过 AI 图片识别筛选，自动剔除低分辨率、大面积水印的劣质源，只保留精心挑选的高质量漫画下载源。
:::


## 快速部署

### 单 Docker 命令

所有服务合成一个容器启动，需要可以先在漫画保存目录创建cache（缓存），data（漫画数据）后面需要用到：

```bash
docker run -d \
    --name comic-auto \
    --restart unless-stopped \
    -p 8055:80 \
    -v {替换为本机的数据目录}:/var/lib/postgresql/16/main \
    -v {替换为本机的漫画保存}:/mnt/media \
    ccr.ccs.tencentyun.com/free-apps/comic-auto:v1.3.2
```

访问 `http://ip:8055` 即可开始使用。

### Docker Compose

新建 `docker-compose.yml`：

```yaml
services:
  comic-auto:
    image: ccr.ccs.tencentyun.com/free-apps/comic-auto:v1.3.2
    container_name: comic-auto
    restart: unless-stopped
    ports:
      - "8055:80"
    volumes:
      - ./data:/var/lib/postgresql/16/main   # 数据目录
      - /mnt/media:/mnt/media                # 漫画保存目录，替换为本机路径
```

启动：

```bash
docker compose up -d
```

## 与 Komga / Kavita 的目录关系

Comic Auto 负责**下载**，Komga / Kavita 负责**阅读和展示**，两者通过**同一个漫画目录**协作——这也是部署时唯一需要特别注意的地方：

```
宿主机
└── /mnt/media/                ← 漫画保存目录（宿主机上的真实目录）
    ├── cache/                 ← Comic Auto 缓存目录
    └── down/                  ← Comic Auto 下载目录
        ├── 漫画/              ← Komga / Kavita「漫画」媒体库
        └── 漫画18/            ← Komga / Kavita「漫画18」媒体库
```

关键点：

1. **同一个宿主机目录，两个容器都要挂载**。Comic Auto 挂载 `/mnt/media:/mnt/media`；Komga / Kavita 也要挂载这个目录（例如挂载到 `/data`）。
2. **Comic Auto 的「下载目录」= Komga / Kavita 的媒体库目录**。例如在系统设置里把下载目录配为 `/mnt/media/down`，Komga 里建库时就选对应的 `/data/down`。
3. 配置完成后流程全自动：Comic Auto 把新章节下载到该目录 → 自动通知媒体库扫描入库 → 自动完成元数据刮削，Komga / Kavita 里直接就能看。

如果 Komga / Kavita 也用 Docker 部署，可以写进同一个 compose 文件：

```yaml
services:
  comic-auto:
    image: ccr.ccs.tencentyun.com/free-apps/comic-auto:v1.3.2
    container_name: comic-auto
    restart: unless-stopped
    ports:
      - "8055:80"
    volumes:
      - ./data:/var/lib/postgresql/16/main
      - /mnt/media:/mnt/media

  komga:
    image: gotson/komga:latest
    container_name: komga
    restart: unless-stopped
    ports:
      - "25600:25600"
    volumes:
      - ./komga-config:/tmp
      - /mnt/media:/data        # 与 Comic Auto 挂载同一个宿主机目录
```

这时 Komga 建库时选择 `/data/down` 即可（对应 Comic Auto 容器内的 `/mnt/media/down`）。
