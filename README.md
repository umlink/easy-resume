<div align="center">

# 轻简历

**一款生成「真 PDF」在线简历制作平台**

PC 编辑器 · 移动 H5 · 微信小程序 · AI 智能诊断 · 服务端 Puppeteer 渲染

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A518-339933.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![Umi Max](https://img.shields.io/badge/UmiJS-Max-7011ff.svg)](https://umijs.org/)
[![Taro](https://img.shields.io/badge/Taro-4-2C9CDB.svg)](https://taro.jd.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748.svg)](https://www.prisma.io/)
[![Fastify](https://img.shields.io/badge/Fastify-4-000000.svg)](https://www.fastify.io/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-11-40B5A4.svg)](https://pptr.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8.svg)](https://tailwindcss.com/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5-1677ff.svg)](https://ant.design/)

🌐 线上地址：<https://www.wktline.com>
💬 作者微信：`kr_39hd`（备注"轻简历"）

</div>

---

## 目录

- [项目定位](#项目定位)
- [核心亮点](#核心亮点)
- [技术栈全景](#技术栈全景)
- [仓库结构](#仓库结构)
- [系统架构](#系统架构)
- [关键业务流程](#关键业务流程)
- [快速开始](#快速开始)
- [跨项目契约](#跨项目契约)
- [部署拓扑](#部署拓扑)
- [安全与运维](#安全与运维)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 项目定位

区别于市面上面向 HR 的简历管理 SaaS，**Easy 简历** 聚焦「个人求职者制作一份令人满意的简历」这一核心场景：

- **真 PDF 导出**：基于 Puppeteer 服务端渲染，输出印刷级 PDF，而非图片拼接 / 浏览器 print。
- **所见即所得编辑**：Quill 富文本 + 数据驱动模板，编辑态与预览态共用同一渲染组件。
- **AI 智能诊断**：接入 DeepSeek / Kimi / 讯飞 / 百度 4 家 LLM，SSE 流式输出优化建议。
- **多端覆盖**：同一后端服务 PC、H5、微信小程序三端，本仓库为多项目目录（**非 monorepo**）。
- **VIP 商业闭环**：会员类型 + token 额度 + 检查次数 + 邀请奖励 + 微信扫码支付。

> 适合应届生、社招求职者制作中文简历，已上线运营。

---

## 核心亮点

### 工程化

| 亮点 | 说明 |
|---|---|
| **5 端 1 后端** | PC（Umi Max）/ H5（Umi Max + antd-mobile）/ 小程序（Taro 4 + Vite）/ 后端（NestJS + Fastify）/ PDF 微服务（Koa + Puppeteer） |
| **OpenAPI 全链路自动生成** | 后端 swagger -> PC/H5/MP 三端 `src/api/`，命名空间聚合 `Api.模块.方法`，杜绝手写接口类型漂移 |
| **统一响应外壳** | 后端 `addResponseWrapper` 给所有响应套 `{ code, message, data, success }`，HTTP 永远 200，业务状态在 body |
| **BigInt ID 序列化** | Prisma 中间件自动将 BigInt 序列化为 string，前端拿到的所有 ID 都是字符串，避免 `JSON.stringify` 报错 |
| **多文件 Prisma Schema** | 启用 `prismaSchemaFolder` preview，按域拆分 `user.prisma` / `resume.prisma` / `vip.prisma` 等 |
| **无外键设计** | `relationMode = "prisma"`，关系在 JS 层维护，便于分库分表与未来迁移 |

### 业务

| 亮点 | 说明 |
|---|---|
| **30+ 简历模板** | 按 `NoYYMMDD` 命名，统一通过 `TemplateMap` 注册，一键切换保留数据 |
| **主题色体系** | 基于 CSS 变量 `--primary-color` + Tailwind 透明度变体，`reversalColor` 自动计算深底/浅底反差色 |
| **AI 流式诊断** | RxJS `Observable` 包装 LLM stream，监听 `Response.raw.on('close')` + `AbortController` 处理客户端断开 |
| **VIP 额度双轨** | `checkCount`（次数）+ `optTokens`（token），按 LLM 计费模型灵活切换 |
| **PDF 双路径** | authCode 直连 puppeteer（带 token 转发）/ 后端鉴权转发，AES-128-CBC 加密参数 |
| **微信 MP 双登录** | 静默自动登录（首页 `useLoad`）+ 场景码登录（`verifyCode-inviteCode`），新用户送 GIFT VIP |
| **1.5s 防抖自动保存** | 编辑器本地立即更新 + 防抖落库 + 卸载强制 flush，避免数据丢失 |

### 性能

| 亮点 | 说明 |
|---|---|
| **Puppeteer 实例池** | `generic-pool` 维护 headless Chromium，`max: 2 / maxUses: 2048 / idle: 60min`，单实例复用 2048 次后销毁重建 |
| **PM2 集群** | 后端 + puppeteer 服务均 cluster 模式，按 CPU 数实例化，内存超限自动重启 |
| **CDN 分发** | 七牛云 `static.wktline.com`，前端静态资源 + PDF 临时上传 + 用户图片上传统一托管 |
| **代码分割** | PC 端 webpack splitChunks：`vendors` / `antdesigns` / `async-commons` / `commons`，`[contenthash:16]` 长缓存友好 |

---

## 技术栈全景

| 分类 | 后端 `resume-server` | PC `resume-pc` | H5 `resume-h5` | 小程序 `resume-mp` | PDF 服务 `resume-puppeteer` |
|---|---|---|---|---|---|
| **框架** | NestJS 10 + Fastify 4 | Umi Max 4 + React 18 | Umi Max 4 + React 18 | Taro 4 + React 18 | Koa 2 + koa-router |
| **语言** | TypeScript 5 | TypeScript 4 | TypeScript 5 | TypeScript 5 | JavaScript (Node 14+) |
| **UI** | Swagger UI | Ant Design 5 + Tailwind 3 | antd-mobile 5 + Tailwind 3 | Less + 原生组件 | - |
| **富文本** | - | Quill 2 | Quill 2 + md-editor-rt | - | - |
| **ORM / 数据** | Prisma 5 + MySQL 8 | - | - | - | - |
| **HTTP** | Fastify | `@umijs/max` request | `@umijs/max` request | `Taro.request` | axios |
| **鉴权** | `@nestjs/jwt` + Guard 链 | `localStorage` token | `localStorage` token | `Taro.storage` token | AES authCode / Cookie |
| **AI** | DeepSeek / Kimi / 百度 / 讯飞 | EventSource Polyfill | EventSource Polyfill | - | - |
| **支付** | YunGouOS 微信 nativePay | - | - | - | - |
| **上传** | 七牛云 SDK | - | - | - | 七牛云 SDK |
| **进程** | PM2 cluster | nginx + CDN | nginx + CDN | 微信平台托管 | PM2 cluster |
| **API 生成** | Swagger spec | `@umijs/openapi` | `@umijs/openapi` | `@umijs/openapi` | - |
| **包管理** | yarn | yarn | yarn | yarn | yarn |

---

## 仓库结构

```
easy-resume/
├── resume-server/          # NestJS 后端（API + 鉴权 + AI + 支付 + Prisma）
│   ├── prisma/schema/      # 多文件 schema（user/resume/vip/order/...）
│   ├── src/modules/        # 16 个领域模块（ai/auth/order/resume/vip/...）
│   ├── docker-compose.yml  # MySQL 一键启动
│   └── pm2.config.js       # 集群部署
│
├── resume-pc/              # PC 端主站（核心编辑器 + 官网）
│   ├── src/pages/EditorOpt/      # 简历编辑器（核心）
│   ├── src/pages/TemplateDir/    # 30+ 模板（NoYYMMDD 命名）
│   ├── src/pages/Preview/        # 预览页（含 print=1 模式）
│   ├── config/                   # Umi 配置（routes/proxy/webpack）
│   └── upload.cdn.js             # 七牛 CDN 上传脚本
│
├── resume-h5/              # 移动端 H5 编辑器（独立 Umi 项目）
│   ├── src/pages/Editor/         # 移动端编辑器主页面
│   ├── src/pages/components/     # QuillEditor / SvgIcons / TitleIcons
│   └── .umirc.ts                 # 仅 /editor 路由
│
├── resume-mp/              # 微信小程序（Taro 4 + Vite）
│   ├── config/                   # Taro 构建配置（dev/prod）
│   ├── src/pages/                # index/auth/mine 三个页面
│   ├── src/request.ts            # Taro.request 封装 + 拦截器
│   └── project.config.json       # 微信开发者工具配置
│
├── resume-puppeteer/       # PDF 渲染微服务（Koa + Puppeteer）
│   ├── src/poolUtils.js          # Puppeteer 实例池 + genPDF/genWktPDF/genIMG
│   ├── src/tools.js              # AES 加解密 + 七牛上传
│   └── pm2.config.js             # cluster 2 实例 800M 重启
│
├── CLAUDE.md               # AI 协作指引（跨项目契约）
└── README.md               # 本文件
```

> **每个子项目独立 `package.json` / `yarn.lock`，互不依赖、独立部署**。共享的是同一份 git 历史与线上域名 / 账号体系。各子项目根目录都有更详细的 `CLAUDE.md` 与 `README.md`。

---

## 系统架构

```
┌────────────────────────────────────────────────────────────────────────┐
│                              用户终端                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────┐ │
│  │  PC 浏览器    │    │  移动 H5      │    │  微信小程序               │ │
│  │  resume-pc   │    │  resume-h5   │    │  resume-mp               │ │
│  │  Umi Max     │    │  Umi Max     │    │  Taro 4                  │ │
│  │  :8000       │    │  :8000/h5/   │    │  微信开发者工具            │ │
│  └──────┬───────┘    └──────┬───────┘    └────────────┬─────────────┘ │
└─────────┼───────────────────┼─────────────────────────┼───────────────┘
          │                   │                         │
          │  HTTPS + JWT      │                         │ Taro.request
          │  header:          │                         │ header: authorization
          │  authorization    │                         │
          ▼                   ▼                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                          nginx (wktline.com)                           │
│  /resume-api/*  ──────────────────►  resume-server                     │
│  /resume-api/puppeteer/*  ─────────►  resume-puppeteer (绕过 JSON 拦截) │
│  /                  ──────────────►  静态资源 (七牛 CDN)                 │
└────────────────────────────────────────────────────────────────────────┘
          │                                          │
          ▼                                          ▼
┌─────────────────────────────────┐    ┌────────────────────────────────┐
│       resume-server             │    │     resume-puppeteer           │
│       NestJS + Fastify :8088    │    │     Koa + Puppeteer :8090      │
│  ┌──────────────────────────┐   │    │  ┌──────────────────────────┐  │
│  │  Guard 链                │   │    │  │  Puppeteer 实例池         │  │
│  │  JwtAuth → Roles → Vip   │   │    │  │  max:2 / maxUses:2048    │  │
│  │  → Throttler             │   │    │  │  idle:60min              │  │
│  ├──────────────────────────┤   │    │  ├──────────────────────────┤  │
│  │  Interceptor 链          │   │    │  │  路由：                   │  │
│  │  Post → Response         │   │    │  │  /file-api/dps/create-pdf│  │
│  │  → ClassSerializer       │   │    │  │  /resume-api/puppeteer/  │  │
│  │  → Timeout(60s)          │   │    │  │     pdf                  │  │
│  ├──────────────────────────┤   │    │  │  /resume-api/puppeteer/  │  │
│  │  16 个领域模块            │   │    │  │     pdf-new (上传 OSS)   │  │
│  │  ai/auth/resume/vip/...  │   │    │  └──────────────────────────┘  │
│  └──────────────────────────┘   │    └────────────────────────────────┘
└────────────┬────────────────────┘                   │
             │                                        │ AES 解密 authCode
             │ Prisma                                 │ → 拼 /preview/:id?print=1
             ▼                                        │ → page.goto + page.pdf
┌─────────────────────────────────┐                   │
│       MySQL 8                   │◄─────── 注入 authorization header
│  relationMode = "prisma"        │           渲染 PC 端预览页
│  无 DB 外键，关系在 JS 层        │
│  BigInt ID → 中间件序列化为 str  │
└─────────────────────────────────┘
                                                  │
                                                  ▼
                                       ┌──────────────────────┐
                                       │  七牛云 OSS           │
                                       │  bucket: fresume      │
                                       │  static.wktline.com   │
                                       │  - 前端静态资源        │
                                       │  - resume-pdf/        │
                                       │  - 用户上传图片        │
                                       └──────────────────────┘
```

---

## 关键业务流程

### 1. 简历编辑与自动保存（PC / H5）

```
用户输入 ──► Quill onChange ──► 更新 ResumeDataContext
                                       │
                                       ▼
                              useDebounceFn(updateResume, 1500ms)
                                       │
                              ┌────────┴────────┐
                              ▼                 ▼
                       组件卸载 flush     1.5s 静默后落库
                              │                 │
                              └────────┬────────┘
                                       ▼
                          POST /resume/update { id, content }
                                       │
                                       ▼
                            后端 Prisma updateResume
                            （中间件自动 set updatedAt）
```

**关键点**：本地立即更新避免输入卡顿；防抖 1.5s 减少请求；卸载强制 flush 防止数据丢失；切换模块 / 失焦时传 `immediately: true` 立即落库。

### 2. PDF 导出（跨三端 + 后端 + puppeteer）

```
[前端]                    [resume-server]              [resume-puppeteer]          [七牛 OSS]
  │                             │                            │                        │
  │ 1. POST /resume/pdf/{id}    │                            │                        │
  │ ───────────────────────────►│                            │                        │
  │                             │ 2. AES-128-CBC 加密         │                        │
  │                             │    { resumeId, token,      │                        │
  │                             │      margin }              │                        │
  │ 3. 返回 authCode             │                            │                        │
  │ ◄───────────────────────────│                            │                        │
  │                             │                            │                        │
  │ 4. GET /resume-api/puppeteer/pdf?authCode=...            │                        │
  │   (responseType: blob)      │                            │                        │
  │ ─────────────────────────────────────────────────────────►│                        │
  │                             │                            │ 5. AES 解密 authCode     │
  │                             │                            │ 6. 拼 /preview/:id?print=1
  │                             │                            │ 7. page.goto + auth header
  │                             │                            │ 8. waitUntil: networkidle0
  │                             │                            │ 9. page.pdf({A4, margin})
  │ 10. PDF 二进制流              │                            │                        │
  │ ◄────────────────────────────────────────────────────────│                        │
  │                             │                            │                        │
  │ 11. 浏览器触发下载            │                            │                        │
  │   （或 Taro.saveFile +      │                            │                        │
  │    openDocument 在小程序）   │                            │                        │
  ▼                             ▼                            ▼                        │
                                                                          （pdf-new 路径）
                                                                          上传 resume-pdf/
                                                                          返回 CDN URL ◄──┘
```

**关键点**：
- 前端**直接调 puppeteer 服务**（不经过 `request()` JSON 拦截器），用 `responseType: 'blob'` / `Taro.downloadFile` 接收二进制。
- AES key/iv 在 `resume-server` 与 `resume-puppeteer` 两端**必须同步**，否则解密失败。
- 小程序流程更复杂：`Taro.downloadFile` → `saveFile` 到 `${USER_DATA_PATH}` → `openDocument` 预览 → 清理临时文件。
- `waitUntil: 'networkidle0'` 确保字体 / 图片加载完成，避免空白页。

### 3. AI 智能诊断（SSE 流式）

```
[前端 AiOpt.tsx]                 [resume-server /ai]                 [LLM Provider]
   │                                    │                                  │
   │ 1. sendAiSseEvent(                  │                                  │
   │      '/resume-api/ai/optimize/      │                                  │
   │       inspect?resumeId=...')         │                                  │
   │ ───────────────────────────────────►│                                  │
   │   EventSourcePolyfill +              │                                  │
   │   authorization header               │                                  │
   │                                    │ 2. VipGuard 校验                  │
   │                                    │    （AI_CHECK_COUNT_ENABLED）     │
   │                                    │ 3. vipService.subCheckCount()     │
   │                                    │ 4. 组装 prompt + 调 LLM SDK        │
   │                                    │ ─────────────────────────────────►│
   │                                    │                                  │
   │                                    │ 5. RxJS Observable 包装 stream    │
   │                                    │ ◄─────────────────────────────────│
   │ 6. SSE message event (chunk)        │                                  │
   │ ◄───────────────────────────────────│                                  │
   │ 7. showdown md → HTML               │                                  │
   │ 8. 写入只读 QuillResumeEditor        │                                  │
   │                                    │                                  │
   │ 9. done / done-xxx 事件              │                                  │
   │ ◄───────────────────────────────────│ 10. stream end / 错误 / 额度不足  │
   │                                    │     → vipService.subTokens()      │
   │ 10. eventSource.close()             │                                  │
   │     （组件卸载时）                   │                                  │
   ▼                                    ▼                                  ▼
```

**关键点**：
- 前端**不要直接 `new EventSource(...)`**--会丢 `authorization` header。统一用 `useGlobal` 中的 `sendAiSseEvent`。
- 协议：`done` 前缀表示完成，`done-` 前缀表示额度不足等警告。
- 60s 全局 `TimeoutInterceptor` 不影响 SSE（在 body resolve 前就返回了 Observable）。
- 客户端断开由 `Response.raw.on('close')` + `AbortController.abort()` 捕获，避免继续消耗 LLM token。

### 4. 微信小程序登录与邀请奖励

```
[小程序]                         [resume-server /auth/wxmp]
   │
   │ 首页 useLoad ──► Taro.login() 拿 code
   │                                    │
   │ POST /auth/wxmp/auto-login {code}  │
   │ ──────────────────────────────────►│
   │                                    │ code2Session 换 openid
   │                                    │ 查 user 表
   │                                    │ ┌── 已注册 ──► 签 JWT（含 isVip）
   │                                    │ │
   │                                    │ └── 未注册 ──► 创建用户 + 送 GIFT VIP
   │                                    │                 （若 inviteCode 存在）
   │                                    │                 → inviter 加 VIP 天数
   │ ◄──────────────────────────────────│ 返回 token
   │ Taro.setStorageSync('TOKEN', ...)  │
   ▼                                    ▼

[显式登录 - 扫码进入]
   │ scene = verifyCode-inviteCode
   │ POST /auth/wxmp/code-login
   │      { code, verifyCode, inviteCode }
   │ ──────────────────────────────────►│ 同上 + 邀请奖励
   │ ◄──────────────────────────────────│ token
   │ Taro.switchTab('/pages/index/index')
   ▼
```

### 5. 微信支付与 VIP 生效

```
[前端 VipContainer]              [resume-server /order]            [YunGouOS]
   │                                    │                              │
   │ 1. 选择会员类型                     │                              │
   │ 2. POST /order/create-order        │                              │
   │    { vipTypeId }                   │                              │
   │ ───────────────────────────────────►│                              │
   │                                    │ 3. 调 YunGouOS nativePay      │
   │                                    │ ─────────────────────────────►│
   │                                    │ ◄─────────────────────────────│ 支付二维码 URL
   │ 4. 返回 qrcode URL                  │                              │
   │ ◄──────────────────────────────────│                              │
   │ 5. 展示二维码 + 轮询订单状态          │                              │
   │                                    │                              │
   │                              用户扫码支付                          │
   │                                    │ ◄────────────────────────────│ 异步回调
   │                                    │ POST /order/notice-callback  │
   │                                    │ （@NotLogin 放开）             │
   │                                    │                              │
   │                                    │ 6. 验签 + 落库订单              │
   │                                    │ 7. 续期 VIP                   │
   │                                    │ 8. 邀请人加 VIP 天数            │
   │                                    │                              │
   │ 9. 轮询发现订单已支付                │                              │
   │    refreshUserInfo()                │                              │
   │    显示新 VIP 状态                   │                              │
   ▼                                    ▼                              ▼
```

---

## 快速开始

### 环境要求

- **Node.js** ≥ 18（推荐 20 LTS）
- **Yarn** 1.x
- **MySQL** 8（或用 `resume-server/docker-compose.yml` 一键启动）
- **Chromium / Chrome**（PDF 服务需要，CentOS `yum install chromium`，macOS 用 Puppeteer 自带即可）
- **微信开发者工具**（仅小程序开发需要）

### 一、启动后端

```bash
cd resume-server
yarn install
cp .env.example .env.development          # 填入数据库、JWT、AI 等密钥

# 数据库
docker-compose up -d nest-mysql           # 或使用已有 MySQL
yarn prisma:generate
yarn migrate:deploy
yarn prisma:seed                           # 初始化角色基础数据

# 启动
yarn start:dev                             # http://localhost:8088
# Swagger: http://localhost:8088/swagger-api
```

### 二、启动 PC 端

```bash
cd resume-pc
yarn install
yarn genapi                                # 从后端 swagger 生成 src/api/
yarn dev                                   # http://localhost:8000
```

> dev 模式 `/resume-api` 代理到 `https://www.wktline.com`，如需对接本地后端改 `config/proxy.ts`。

### 三、启动 H5 端

```bash
cd resume-h5
yarn install                               # 自动 max setup
yarn dev                                   # http://localhost:8000/h5/editor
```

### 四、启动小程序

```bash
cd resume-mp
yarn install
cp .env.example .env.development           # 填 TARO_APP_BASE_URL 与 TARO_APP_ID
yarn dev:weapp                             # 产物到 ./dist
# 打开微信开发者工具 -> 导入 resume-mp 目录 -> 自动读取 project.config.json
```

### 五、启动 PDF 服务

```bash
cd resume-puppeteer
yarn install
yarn dev                                   # http://localhost:8090
# 生产：pm2 start pm2.config.js
```

### 验证联通

1. PC 端 `http://localhost:8000` 注册 / 登录 -> 创建简历 -> 编辑保存。
2. 点击「导出 PDF」-> 若下载到 PDF，则 PC + 后端 + puppeteer 链路打通。
3. 点击「AI 诊断」-> 若 SSE 流式输出，则 AI 链路打通。
4. 小程序 `yarn dev:weapp` -> 微信开发者工具扫码登录 -> 看到 VIP 状态，则 MP 链路打通。

---

## 跨项目契约

以下契约跨子项目一致，理解后可避免 90% 的"看起来对、跑起来错"问题：

### 1. 统一响应结构

```ts
{ code: number, message: string, data: T | null, success: boolean }
```

- 所有 HTTP 状态码均为 **200**（含错误），业务状态在 body 的 `code` / `success`。
- 判断成功用 `success`，**不要**用 `code === 0`。
- 后端 `HttpExceptionFilter` 把异常包成 `{ code, message, success: false, data: null, timestamp }`，HTTP 仍 200。

### 2. 鉴权

| 端 | Header key | Token 存储 |
|---|---|---|
| PC / H5 | `authorization` | `localStorage['authorization']` |
| MP | `authorization` | `Taro.storage['TOKEN']` |
| puppeteer（简历 PDF） | `authorization`（注入到 page header） | authCode 内嵌 |
| puppeteer（通用 PDF） | Cookie `__dp_tk__` | URL query 传 token |

- JWT 无 `Bearer ` 前缀，直接是 token 字符串。
- JWT payload 含 `isVip`，由 `VipGuard` 用于会员校验，**前端无需额外请求**就能拿到 VIP 状态。

### 3. OpenAPI 自动生成

- PC / H5 / MP 的 `src/api/` 全部由 `@umijs/openapi` 从后端 swagger 自动生成，**禁止手改**。
- 后端启动后跑 `yarn genapi`，从 `http://127.0.0.1:8088/swagger-api-json` 拉取并覆盖。
- 改后端 DTO 字段后必须重跑 `yarn genapi`，否则前端类型对不上。
- 后端 swagger 由 `addResponseWrapper` 后处理，给所有响应统一套上 `{ code, message, data, success }` 外壳。

### 4. ID 与日期

- 所有 DB ID 是 `BigInt`，由 Prisma 中间件序列化为 **string**。前端拿到的 ID 都是字符串。
- 日期统一 `dayjs`，**不要**引入 Moment。
- `updatedAt` 由 Prisma 中间件自动设置，**不要**手动赋值。

### 5. 路径别名

所有子项目都用 `@/*` 指向 `src/*`。新代码用 `@/`，不要混入相对路径。

### 6. 主题色机制（PC / H5）

- 主题色通过 CSS 变量 `--primary-color`（RGB 三通道逗号分隔）动态切换。
- Tailwind 中 `primary` / `primary-10` ~ `primary-900` 系列基于该变量，写 `bg-primary-100` 自动跟随主题。
- 前景对比色用 `utils/tools.ts` 的 `reversalColor(themeColor)`，根据 luma 自动选择深 / 浅文字色。
- Tailwind `preflight: false`（让 antd / antd-mobile 接管基础样式），**不要重新开启**。

---

## 部署拓扑

### 生产环境

| 服务 | 部署方式 | 域名 / 端口 |
|---|---|---|
| nginx | 反向代理 + 静态 HTML 托管 | `wktline.com:443` |
| resume-server | PM2 cluster | `:8088`（内部），nginx 转发 `/resume-api/*` |
| resume-puppeteer | PM2 cluster 2 实例 | `:8090`（内部），nginx 转发 `/resume-api/puppeteer/*` |
| MySQL 8 | systemd / Docker | `:3306`（内部） |
| 七牛云 OSS | CDN | `static.wktline.com` |
| PC 静态资源 | 七牛 `resume/` 前缀 | `static.wktline.com/resume/` |
| H5 静态资源 | 七牛 `resume-h5/` 前缀 | `static.wktline.com/resume-h5/` |
| PDF 临时文件 | 七牛 `resume-pdf/` 前缀 | `static.wktline.com/resume-pdf/` |
| 用户上传图片 | 七牛 `resume/` 前缀 | `static.wktline.com/resume/` |
| 微信小程序 | 微信平台 | 微信审核后发布 |

### 发布流程

```bash
# PC 端发布（典型）
cd resume-pc
yarn build:publish                          # build -> upload CDN -> scp index.html

# H5 端发布
cd resume-h5
yarn one-push                               # build -> upload CDN -> scp index.html

# 后端发布
cd resume-server
yarn build:prisma
pm2 restart resume-server                   # 集群零停机 reload

# PDF 服务发布
cd resume-puppeteer
git pull
pm2 reload pdf-genServer                    # 零停机重启
```

> ⚠️ `yarn upload` / `yarn publish` / `yarn one-push` / `pm2 restart` 都属于**不可逆线上操作**，必须由维护者明确发起。

---

## 安全与运维

### 已知安全债（已迁移，二次开发无需处理）

| 位置 | 历史问题 | 当前状态 |
| --- | --- | --- |
| `resume-pc/upload.cdn.js` `refresh.cdn.js` | 曾硬编码七牛 AK/SK + CDN URL | ✅ 已迁到 `QINIU_AK` / `QINIU_SK` / `QINIU_BUCKET` / `CDN_HOST` / `CDN_PREFIX` 环境变量 |
| `resume-puppeteer/src/tools.js` `index.js` | 曾硬编码 AES key/iv + 七牛 AK/SK + 生产域名 | ✅ 已迁到 `AES_KEY` / `AES_IV` / `QINIU_ACCESS_KEY` / `QINIU_SECRET_KEY` / `CLIENT_HOST_PROD` / `CDN_HOST` / `PDF_PREFIX` 环境变量 |
| `resume-server/src/modules/ai/*.service.ts` | 曾构造函数硬编码 LLM API key | ✅ 4 家 provider 全部迁到 `ConfigService.get('AI_*_API_KEY')` |
| `.env.*` 真实文件 | 含真实 DB 密码 / JWT secret / 微信 MP secret / 邮箱授权码 | ✅ 已 gitignore，不会提交；模板见各子项目 `.env.example` |
| `prisma/sql/` 临时 dump | 曾含真实用户邮箱 / 姓名 / 明文密码 | ✅ 已删除，`.gitignore` 加 `**/prisma/sql/*.sql` 防止后续误提交 |

### 运维监控

- **日志**：后端 `nest-winston` + `winston-daily-rotate-file`，按日轮转，info 与 error 分离，存 `nestjs-logs/`。
- **PM2**：`pm2 logs` / `pm2 monit` / `pm2 reload` 零停机重启。
- **Prisma Studio**：`yarn prisma:studio` 可视化数据。
- **Prisma 文档**：`yarn prisma:doc` -> `http://localhost:8099`。
- **Swagger**：`http://localhost:8088/swagger-api`（`API_ENABLED_SWAGGER=True` 时）。

### 安全建议

- 首次部署务必轮换 `.env.example` 中所有占位项对应的真实密钥。
- `JWT_SECRET` / `MD5_SALT` / `AES_KEY` / `AES_IV` 一旦泄露需立即轮换；其中 `AES_KEY` 变更会导致已分发的简历授权码失效。
- AI provider 的 API key 一旦泄露会被盗刷额度，发现异常立即在对应平台禁用并轮换。
- `relationMode = "prisma"` 下，删除父行不会级联删除子行，需手动处理。
- `resume-puppeteer` 的 `/file-api/dps/create-pdf` 当前未校验 `url` 参数来源，存在 SSRF 风险，公网暴露时建议加白名单。

---

## 贡献指南

1. Fork 本仓库
2. 新建分支：`git checkout -b feat/your-feature`
3. 子项目内提交前运行对应 lint / build：
   - `resume-server`: `yarn lint && yarn build`
   - `resume-pc` / `resume-h5`: `yarn format && yarn build`
   - `resume-mp`: `yarn build:weapp`
   - `resume-puppeteer`: 无 lint，直接 `yarn dev` 自测
4. 跨项目改动（如改后端 DTO 同时改前端 `src/api/`）需在 PR 描述里点明影响面，并跑通两端的 `yarn genapi` + `yarn build`
5. 提交 PR，描述清晰的问题背景与解决方案

> 优先关注以下方向：模板新增与优化、AI 诊断准确度提升、PDF 导出排版优化、移动端体验、SSRF / 密钥硬编码等安全债清理。

### 协作偏好

- 用中文交流，回复简洁直接，不写"最佳实践"式空话。
- 修改代码前先读懂现有实现；看起来奇怪的代码多半有历史原因（防抖落库、CSS 变量主题色、BigInt 序列化等），**先问而不是先删**。
- 涉及子项目的具体命令、目录结构、易踩坑点，**优先查该子项目的 `CLAUDE.md`**。
- `src/api/` / `src/.umi/` 等自动生成目录**禁止手改**。

---

## 许可证

[MIT License](./LICENSE) © 2023-2026 wktline

## 作者

- **wktline** / **krlin** / **kr**

如遇紧急问题，可在站内点击右下角「问题反馈」提交，或扫码添加作者微信（注明来意）。

---

> 本项目仅用于学习交流，禁止用于商业用途的二次销售。如需合作请通过线上站点联系。
