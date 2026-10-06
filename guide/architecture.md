# 基础配置

## 启动配置

启动之后通过地址加端口访问，会指引创建管理员账户，创建之后，需要做：

1. 导入站点
2. 系统设置里激活授权
3. 配置目录
4. 配置媒体库（Komga 或 Kavita）

## 导入站点

输入地址导入站点信息：

```
http://file.freeapps.uk/files/stations-1.2.0.json
```

![导入站点](/images/guide/import-stations.png)

## 基本配置

- **缓存目录** — 缓存海报等临时目录（配置示例：`/mnt/media/cache`）
- **下载目录** — 漫画的保存目录，对应着 Komga / Kavita 的库目录（配置示例：`/mnt/media/down`）
- **代理配置** — 部分站点需要科学访问，会自动检测站点是否需要代理
- **激活授权** — 填上密钥进行激活

![基本配置](/images/guide/basic-config.png)

## 配置媒体库

先需要在 Komga / Kavita 创建 API Key，媒体库目录对应着应用的下载目录，容器挂载需要对应上。媒体库是自动创建的，会自动创建「漫画」和「漫画18」两个媒体库。

刮削库的开启会定时刮削 Komga / Kavita 里面漫画。

### 创建 API 密钥

**Komga**：左侧菜单进入「我的账户 → API 密钥」，点击右下角 **+** 号，填写注释（如 `comic-auto`）后点击「生成」，复制生成的密钥。

![Komga 创建 API 密钥](/images/guide/komga-api-key.png)

**Kavita**：左侧菜单进入「帐户 → 身份验证密钥」，点击「+ 新的」，填写名称（如 `comic-auto`），到期保持「从不」，点击「保存」后复制生成的密钥。

![Kavita 创建授权密钥](/images/guide/kavita-api-key.png)

::: warning 注意
密钥只在创建时完整显示一次，请立即复制保存，随后填到 Comic Auto 的媒体服务器配置中。
:::

![配置媒体库](/images/guide/media-library.png)
