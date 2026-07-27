---
name: deploy
description: 构建并部署 Comic Auto 文档站点到 38.76.203.67
---

执行以下步骤发布站点到服务器 38.76.203.67，域名 comic.freeapps.uk：

1. 在本地构建项目：`npm run docs:build`
2. 将构建产物上传到服务器：`scp -r .vitepress/dist/* root@38.76.203.67:/var/www/comic/`
3. 验证站点可访问：`curl -sI https://comic.freeapps.uk`

如果构建或上传失败，报告错误并停止。如果验证返回 200 OK，告知用户部署成功。
