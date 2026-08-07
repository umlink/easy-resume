# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

`resume-puppeteer` 是 [easy-resume](../) 简历系统的 PDF 渲染微服务。基于 Koa + Puppeteer，将简历预览页（`?print=1`）渲染为 A4 PDF，可选直出二进制流或上传七牛 OSS 后返回 URL。监听端口 `8090`。

## 常用命令

```bash
yarn install
yarn dev                  # NODE_ENV=development node src/index.js
pm2 start pm2.config.js   # 生产部署（cluster，2 实例，800M 重启）
pm2 logs pdf-genServer
pm2 restart pdf-genServer
```

无 lint、无 test 脚本（`package.json` 的 `test` 是占位）。CentOS 7.6 部署需先 `yum install chromium`。

## 架构

### 请求入口（`src/index.js`）

三条 GET 路由，全部监听 8090：

- `/file-api/dps/create-pdf` — 通用 PDF 直出，参数 `fileName/token/url` 明文，写入 Cookie `__dp_tk__`
- `/resume-api/puppeteer/pdf` — 简历 PDF 直出流，参数 `authCode`（AES 加密）
- `/resume-api/puppeteer/pdf-new` — 简历 PDF 渲染后上传七牛，返回 OSS URL

`authCode` 经 `aesDecrypt` 解出 `{ resumeId, token, margin }`，拼装预览页 URL：开发环境走 `http://localhost:8000`，生产走 `https://www.wktline.com`（由 `NODE_ENV` 切换，硬编码在 `index.js`）。

### Puppeteer 实例池（`src/poolUtils.js`）

启动时通过 `initPuppeteerPool()` 创建全局池并挂到 `global.pp`，所有渲染复用该池。关键约束：

- `max: 2, min: 2` — 池容量硬编码为 2，扩容需改这里
- `maxUses: 2048` — 单实例渲染 2048 次后销毁重建，避免内存泄漏
- `idleTimeoutMillis: 60min`、`evictionRunIntervalMillis: 3min`
- 启动参数包含 `--no-sandbox --single-process --disable-dev-shm-usage` 等，针对 CentOS 无头环境
- `pool.use(fn)` 包装 acquire/release，业务侧只管调 `global.pp.use()` 拿 browser

三个导出函数：`genPDF`（Cookie 鉴权）、`genWktPDF`（Header `authorization` 鉴权，可选 `margin`、`printBackground`）、`genIMG`（元素截图，目前未在路由中使用）。新增渲染类型应在这里加函数，复用同一个池。

### 加解密与上传（`src/tools.js`）

- `aesEncrypt/aesDecrypt` — AES-128-CBC，key/iv **硬编码在源码中**
- `uploadPDFToQiNiuOSS` — 上传至七牛 `fresume` 空间的 `resume-pdf/` 前缀，AK/SK **硬编码在源码中**

⚠️ 修改密钥或迁移到环境变量时，需同步更新调用方（`resume-server` 等）的加密逻辑，否则解密失败。

### 临时文件

PDF 上传模式下渲染结果先写 `tmp/`，上传成功后 `fs.unlink` 删除。`tmp/` 已被 `.gitignore` 排除，部署时需确保进程对该目录有写权限。

## 开发注意事项

- **进程模型**：PM2 cluster 模式下每个进程独立持有自己的 `global.pp` 池，机器 CPU 数 × 2 = 实际并发 browser 数，部署时按内存预算调 `pm2.config.js` 的 `instances` 与 `max_memory_restart`
- **渲染等待**：`waitUntil: 'networkidle0'` + 显式 `waitTime(10ms)`，简历页若依赖异步字体/图片需保证在 idle0 前加载完
- **错误兜底**：路由层 `.catch()` 吞掉异常返回 `{code: 0, message: '未知异常，请重试'}`，但 `code: 0` 同时也是成功码，调试时需看进程日志而非响应体
- **域名耦合**：`clientHost` 硬编码 `wktline.com`，本地联调其他域名需临时改 `src/index.js`
