# Android 打包

本文档介绍如何将 comic-auto-ui 打包为 Android 原生应用。

## 前置要求

- Node.js >= 18
- Android Studio >= 2023.1
- JDK 17
- Android SDK（通过 Android Studio 安装）

## 项目配置

前端已集成 Capacitor，支持 Android 打包。

### 依赖检查

```bash
cd comic-auto-ui

# 确认 Capacitor 依赖已安装
npm ls @capacitor/core @capacitor/android @capacitor/cli
```

## 打包流程

### 1. 构建 Web 应用

```bash
npm run build
```

### 2. 同步到 Android 项目

```bash
npx cap sync android
```

### 3. 打开 Android Studio

```bash
npx cap open android
```

### 4. 构建 APK

在 Android Studio 中：

1. **Build → Generate Signed App Bundle or APK**
2. 选择 **APK**
3. 创建或选择签名密钥（首次需要创建）
4. 选择 **release** 构建类型
5. 点击 **Finish**

APK 文件位于 `android/app/build/outputs/apk/release/app-release.apk`

## 快捷命令

项目已配置 npm scripts：

```bash
# 构建并同步
npm run android:sync

# 打开 Android Studio
npm run android:open

# 构建 + 同步 + 打开
npm run android:run

# 完整发布构建
npm run android:build
```

## 签名配置

### 创建签名密钥（首次）

```bash
cd android

keytool -genkey -v \
  -keystore my-release-key.keystore \
  -alias comic-auto \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### 配置签名

创建 `android/key.properties`：

```properties
storePassword=your-store-password
keyPassword=your-key-password
keyAlias=comic-auto
storeFile=my-release-key.keystore
```

::: danger 安全警告
`key.properties` 和 `my-release-key.keystore` **绝对不能提交到 Git**！
项目 `.gitignore` 已配置忽略这些文件。
:::

## 应用配置

### 修改应用信息

编辑 `android/app/src/main/res/values/strings.xml`：

```xml
<resources>
    <string name="app_name">Comic Auto</string>
    <string name="title_activity_main">Comic Auto</string>
    <string name="package_name">top.cacty.comicauto</string>
</resources>
```

### 修改应用图标

替换 `android/app/src/main/res/` 下的图标文件：

- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

## PWA + Android 混合

Capacitor 应用同时支持 PWA 能力：

- Service Worker 缓存
- 离线访问
- 推送通知（需额外配置）

### 配置 Capacitor

编辑 `capacitor.config.json`：

```json
{
  "appId": "top.cacty.comicauto",
  "appName": "Comic Auto",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#6366f1"
    }
  }
}
```

## 发布到应用商店

### Google Play

1. 注册 [Google Play 开发者账号](https://play.google.com/console)
2. 创建应用，填写信息
3. 上传 AAB（App Bundle）或 APK
4. 配置商店列表、截图、描述
5. 提交审核

### 其他渠道

- 华为应用市场
- 小米应用商店
- 直接分发 APK 文件

## 常见问题

### Gradle 构建失败

```bash
# 清理 Gradle 缓存
cd android
./gradlew clean

# 重新同步
npx cap sync android
```

### 网络请求失败

确保 `capacitor.config.json` 中配置了正确的 `server.url`（开发环境）：

```json
{
  "server": {
    "url": "http://192.168.1.100:3000"
  }
}
```

生产环境使用相对路径，通过后端 API 访问。

### WebSocket 连接问题

Android 应用中 WebSocket 使用 `wss://` 协议，确保后端支持 HTTPS 或配置正确的代理。

## 调试

### 使用 Chrome DevTools

1. 连接 Android 设备（USB 调试）
2. Chrome 地址栏访问 `chrome://inspect`
3. 找到设备上的 WebView，点击 **Inspect**

### 查看日志

```bash
# Android Studio Logcat
adb logcat | grep -i "comic"
```
