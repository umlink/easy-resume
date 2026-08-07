# 轻简历 resume-pc

> 一款专注于「轻量、极简、真 PDF」的在线简历制作工具，面向应届生与社招求职者。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Umi Max](https://img.shields.io/badge/UmiJS-Max-orange.svg)](https://umijs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5-1677ff.svg)](https://ant.design/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8.svg)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4-3178c6.svg)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/node-%3E%3D16-339933.svg)](https://nodejs.org/)

线上地址：<https://www.wktline.com>

---

## 目录

- [项目简介](#项目简介)
- [核心特性](#核心特性)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [核心模块](#核心模块)
- [环境变量](#环境变量)
- [API 自动生成](#api-自动生成)
- [部署与发布](#部署与发布)
- [开发约定](#开发约定)
- [浏览器兼容性](#浏览器兼容性)
- [常见问题](#常见问题)
- [贡献指南](#贡献指南)
- [许可证](#许可证)
- [作者](#作者)

---

## 项目简介

**轻简历** 致力于为求职者提供轻量化、极简、易操作的在线简历制作体验。区别于市面上面向 HR 的简历管理 SaaS，本项目聚焦「个人求职者制作一份令人满意的简历」这一核心场景：

- **真 PDF 导出**：基于 Puppeteer 服务端渲染，输出印刷级 PDF，而非图片拼接。
- **所见即所得编辑**：基于 Quill 富文本编辑器，支持字号、颜色、对齐、列表、图床上传等完整富文本能力。
- **多模板体系**：内置 30+ 套简历模板（按 `NoYYMMDD` 命名），可一键切换并保留数据。
- **AI 智能诊断**：接入 SSE 流式输出，对简历全文进行结构化诊断与优化建议。
- **多端覆盖**：同一后端服务 PC / H5 / 小程序三端，本仓库为 PC 端。

本仓库属于 `easy-resume` monorepo 的子项目，与以下仓库协同工作：

| 仓库 | 说明 |
| --- | --- |
| `resume-pc` | 本仓库，PC 端编辑器与官网 |
| `resume-h5` | 移动端 H5 |
| `resume-mp` | 微信小程序 |
| `resume-server` | NestJS 后端服务 |
| `resume-puppeteer` | PDF 导出微服务 |

## 核心特性

| 特性 | 说明 |
| --- | --- |
| 简历编辑器 | Quill 富文本 + 模块化数据结构（基本信息 / 教育背景 / 工作经历 / 技能 / 自我描述） |
| 模板系统 | 30+ 模板，按 `NoYYMMDD` 命名，统一通过 `TemplateDir` 注册管理 |
| PDF 导出 | 两种导出路径：直连 Puppeteer 服务，或经后端鉴权后转发 |
| AI 诊断 | 流式 SSE 接收优化建议，showdown 转 HTML 实时渲染 |
| 自动保存 | 1.5s 防抖保存 + 卸载 flush，避免数据丢失 |
| 主题色体系 | 基于 CSS 变量 + Tailwind 透明度变体，支持深底/浅底文字反差色自动计算 |
| VIP 体系 | 通过 feature flag 控制开关，可整体关闭回到全免费模式 |
| 分享预览 | 生成授权码，无登录态可预览简历 |
| 响应式 | 自定义断点（640 / 768 / 1024），PC / 平板 / 移动端三套布局 |

## 技术栈

| 分类 | 技术 | 版本 |
| --- | --- | --- |
| 框架 | Umi Max | `^4` |
| UI 库 | React | `^18` |
| 组件库 | Ant Design | `^5.22` |
| 样式 | Tailwind CSS | `^3` |
| 富文本 | Quill | `^2` |
| 工具库 | ahooks | `^3.7` |
| 图标 | `@icon-park/react` | `^1.4` |
| Markdown | showdown | `^2.1` |
| SSE | `event-source-polyfill` | `^1.0` |
| 颜色处理 | color | `^4.2` |
| 类型 | TypeScript | `^4` |
| 构建 | webpack 5（Umi 内置） | — |
| 包管理 | yarn | — |
| CDN | 七牛云对象存储 | — |

## 快速开始

### 环境要求

- Node.js `>= 18`
- yarn `>= 1.22`（项目使用 `.npmrc` 指向 `registry.npmmirror.com`）
- 后端服务：默认代理到 <https://www.wktline.com>，本地开发可改 `config/proxy.ts` 指向本地 `resume-server`

### 安装与启动

```bash
# 1. 安装依赖
yarn

# 2. 启动开发服务器（默认 0.0.0.0:8000）
yarn dev

# 3. 浏览器访问
open http://localhost:8000
```

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `yarn dev` | 启动开发服务器，`/resume-api` 代理到线上 |
| `yarn build` | 生产构建，输出到 `dist/` |
| `yarn genapi` | 从后端 swagger 重新生成 `src/api/` |
| `yarn format` | Prettier 全量格式化 |
| `yarn lint` | ESLint 检查 |
| `yarn upload` | 将 `dist/` 上传到七牛 CDN |
| `yarn refresh:cdn` | 刷新七牛 CDN 缓存 |
| `yarn publish` | 上传 CDN + scp `index.html` 到生产服务器 |
| `yarn build:publish` | 一键：build + upload + scp |

## 项目结构

```
resume-pc/
├── config/                      # Umi 配置
│   ├── config.ts                # 主配置（publicPath、SEO、headScripts）
│   ├── routes.ts                # 路由表
│   ├── proxy.ts                 # dev 代理（/resume-api -> wktline.com）
│   └── webpack.ts               # 生产 splitChunks、moment locale 替换
├── public/                      # 静态资源（favicon 等）
├── src/
│   ├── api/                     # OpenAPI 自动生成，禁止手改
│   ├── assets/                  # 图片、less 等静态资源
│   ├── components/              # 共享组件
│   │   ├── QuillEditor.tsx      # 通用富文本编辑器
│   │   ├── QuillResumeEditor.tsx# 简历专用富文本编辑器
│   │   ├── FloatTools.tsx       # 右下角问题反馈
│   │   ├── LoginContainer.tsx   # 登录态包装
│   │   ├── VipContainer/        # 会员校验包装组件
│   │   ├── UploadImage.tsx      # 图片上传
│   │   ├── CropImage.tsx        # 图片裁剪
│   │   └── ...
│   ├── constants/               # 常量
│   │   ├── enums.ts             # LOCALHOST_ENUMS / ROLES_ENUMS
│   │   ├── feature-flags.ts     # VIP / AI 功能开关
│   │   ├── template-data.ts     # 默认简历数据模板
│   │   ├── provincial-data.ts   # 省份字典
│   │   └── central-enterprisers-data.ts # 央企字典
│   ├── context.ts               # ResumeDataContext
│   ├── hooks/                   # 自定义 hooks
│   │   ├── useExportPDF.ts
│   │   ├── useExportPDFById.ts
│   │   ├── useScrollMove.ts     # 触底检测
│   │   └── useQueryParams.ts    # URL query 同步
│   ├── layouts/                 # 布局
│   │   ├── HeaderLayout.tsx
│   │   └── components/
│   ├── models/
│   │   └── global.ts            # 全局 model（弹窗状态、VIP 信息、SSE）
│   ├── pages/
│   │   ├── Home/                # 首页
│   │   ├── EditorOpt/           # PC 编辑器（核心）
│   │   │   ├── index.tsx
│   │   │   ├── ResumeInterface.ts # 数据模型定义
│   │   │   ├── Header.tsx
│   │   │   ├── Actions.tsx
│   │   │   └── components/      # AiOpt / Export / Setting / ThemeColor ...
│   │   ├── Mobile/EditorOpt/    # 移动端编辑器
│   │   ├── Preview/             # 只读预览（含打印模式）
│   │   ├── Template/            # 模板画廊
│   │   ├── TemplateDir/         # 30+ 模板实现，按 NoYYMMDD 命名
│   │   ├── Content/             # 内容专栏
│   │   ├── Guide/               # 求职指南
│   │   ├── Vip/                 # 会员介绍
│   │   ├── Recruitment/         # 招聘信息
│   │   ├── User/                # 用户中心
│   │   ├── Tools/               # 工具集
│   │   └── 404.tsx
│   ├── utils/                   # 工具函数
│   │   ├── tools.ts             # reversalColor / isMobile / uuid
│   │   ├── format.ts            # 日期格式化
│   │   ├── print.ts             # iframe 打印
│   │   ├── url-utils.ts         # URL query 处理
│   │   └── funs-tools.tsx
│   ├── access.ts                # 权限（isLogin）
│   └── app.tsx                  # getInitialState + request 拦截器
├── openapi.config.ts            # OpenAPI 生成配置
├── upload.cdn.js                # 七牛上传脚本
├── refresh.cdn.js               # 七牛 CDN 刷新脚本
├── tailwind.config.js
├── .env                         # 环境变量（见下文）
├── .eslintrc.js
├── .prettierrc
├── .lintstagedrc
└── package.json
```

## 核心模块

### 简历编辑器（`src/pages/EditorOpt`）

编辑器是本项目的核心模块，采用「数据驱动 + 模板渲染」架构：

- **数据模型**：`IResumeData`（见 `ResumeInterface.ts`）定义简历的完整结构，包含 `title` / `avatar` / `config` / `baseInfo` / `entryList` / `skill` / `margin` 等字段。
- **状态管理**：通过 React Context（`ResumeDataContext`）下发，避免多层级 prop drilling。
- **模板渲染**：`TemplateDir[templateCode]` 取出模板组件，所有模板接收同一份 `resumeData`，实现「一键切换模板保留数据」。
- **自动保存**：`useDebounceFn(updateData, { wait: 1500 })` 防抖保存，组件卸载时强制 flush，避免数据丢失。
- **富文本编辑**：基于 Quill，自定义字号白名单（`ft10` ~ `ft20`），工具栏支持图片上传到七牛 CDN。

### PDF 导出

提供两种导出路径，由不同 hook 封装：

| Hook | 路径 | 适用场景 |
| --- | --- | --- |
| `useExportPDF` | `${origin}/resume-api/wktline/pdf?url=...&token=...` | 直连 puppeteer 服务，需带 token |
| `useExportPDFById` | 先 `exportPDF({ id })` 拿 authCode，再请求 puppeteer | 后端鉴权转发，更安全（编辑器使用） |

导出流程：用户点击导出 -> 后端生成 authCode -> 前端用 authCode 请求 puppeteer 服务 -> puppeteer 打开 `/preview/:id?print=1` 渲染 -> 返回 PDF blob -> 前端触发下载。

### AI 智能诊断

`src/pages/EditorOpt/components/AiOpt.tsx` 实现：

1. 用户点击「AI 诊断」按钮 -> 调用 `sendAiSseEvent('/resume-api/ai/optimize/inspect?resumeId=...')`。
2. SSE 流式接收消息，逐步累积到 `messages[]`。
3. `showdown.Converter` 把 markdown 实时转 HTML，渲染到 Drawer 中的只读 Quill 编辑器。
4. 协议：`done-` 前缀为额度不足等警告消息，`done` 表示完成（触发 VIP 信息刷新）。
5. 组件卸载时主动 `eventSource.close()`，避免内存泄漏。

### 模板系统

所有模板位于 `src/pages/TemplateDir/`，按 `NoYYMMDD` 命名（如 `No240712`、`No250304`），在 `index.ts` 中通过 `TemplateMap` 注册：

```ts
const TemplateMap: Record<string, () => JSX.Element> = {
  No240712, No240713, ..., No250304,
};
```

新增模板流程：1) 复制现有模板目录 -> 2) 修改命名为新日期 -> 3) 在 `index.ts` 注册 -> 4) 后端模板字典同步配置。

### 主题色与反差色

`src/utils/tools.ts` 的 `reversalColor` 函数基于主题色 RGB 计算 luma（亮度），自动选择深底/浅底文字反差色：

- `luma > 0.5`：浅底，文字用 `#272E3B`
- `luma <= 0.5`：深底，文字用 `#f9f9f9` / `#fff`

模板组件通过 `ResumeDataContext` 拿到 `contrastColor` 与 `luma`，自动适配深色主题。

## 环境变量

项目通过 `.env` 文件管理环境变量，修改后需重启 dev server 或重新 build：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `HOST` | `0.0.0.0` | dev server 监听地址 |
| `PORT` | `8000` | dev server 端口 |
| `CDN_PREFIX` | `resume/` | 七牛 CDN 路径前缀，生产环境拼接为 `https://static.wktline.com/${CDN_PREFIX}` |
| `UMI_APP_ENABLE_VIP` | `false` | VIP 体系开关，`'false'` 关闭（隐藏会员入口、跳过额度校验） |
| `UMI_APP_ENABLE_AI` | `true` | AI 功能开关，`'false'` 关闭（隐藏 AI 入口） |

> **注意**：`VIP_ENABLED` 与 `AI_ENABLED` 正交。AI 额度校验仅在两者均为 `true` 时生效。详见 `src/constants/feature-flags.ts`。

## API 自动生成

`src/api/` 全部由 `@umijs/openapi` 自动生成，**禁止手改**。

### 重新生成

后端接口变更后执行：

```bash
yarn genapi
```

配置见 `openapi.config.ts`：

- `schemaPath`：`http://127.0.0.1:8088/swagger-api-json`（需本地启动 `resume-server`）
- `serversPath`：`./src/api`
- `isCamelCase: false`：保留后端字段命名
- `dataFields: ['code', 'data', 'message', 'success']`：统一响应结构

### 响应结构

所有接口返回 `{ code, data, message, success }`，`success` 为业务成功标识。失败时由 `app.tsx` 响应拦截器统一 `message.error`，需静默处理时给请求配置加 `ignoreInterceptErr: true`。

## 部署与发布

### 生产构建

```bash
yarn build
```

构建产物输出到 `dist/`，由 `config/webpack.ts` 配置：

- **代码分割**：`vendors`（node_modules）/ `antdesigns`（antd 单独拆出）/ `async-commons`（异步公共包）/ `commons`（同步公共包）。
- **chunk 命名**：`[contenthash:16]` 长缓存友好。
- **moment locale**：通过 `ContextReplacementPlugin` 仅保留 `zh-cn`。

### 发布流程

```bash
# 一键发布（推荐）
yarn build:publish

# 等价于
yarn build              # 1. 构建产物到 dist/
yarn upload             # 2. 上传 dist/ 到七牛 CDN（bucket: fresume，前缀 resume/）
scp -r ./dist/index.html root@43.138.253.179:/usr/share/nginx/html/  # 3. 同步 index.html 到 nginx

# 单独刷新 CDN 缓存
yarn refresh:cdn
```

### publicPath 策略

- **生产**：`https://static.wktline.com/${CDN_PREFIX}`（七牛 CDN）
- **开发**：`/`
- 通过 `runtimePublicPath` + `headScripts` 注入 `window.publicPath`，运行时动态解析。

## 开发约定

### 代码风格

| 工具 | 配置 | 说明 |
| --- | --- | --- |
| Prettier | `.prettierrc` | 120 列、单引号、尾逗号 all、2 空格 |
| ESLint | `.eslintrc.js` | 继承 `@umijs/max/eslint`，强制 `semi: always` |
| Stylelint | `.stylelintrc.js` | less / css 规范 |
| Husky | `.husky/pre-commit` | 提交前跑 `lint-staged` |
| lint-staged | `.lintstagedrc` | `*.ts?(x)` -> eslint + prettier；`*.css/less` -> stylelint + prettier |

### Tailwind 约定

- `preflight: false`：让 antd 接管基础样式，避免冲突。
- 主色用 CSS 变量：`bg-primary` -> `rgba(var(--primary-color), <alpha-value>)`。
- 透明度变体：`primary-10` ~ `primary-900` 对应 1% ~ 90%。
- **扫描范围**：仅 `pages/components/layouts` 下的 `.tsx`，其他位置（less、md）写的 Tailwind 类不生效。

### TypeScript

- `tsconfig.json` 继承 `src/.umi/tsconfig.json`（Umi 自动生成）。
- 请求类型从 `@@/plugin-request/request` 导入。
- API 类型定义在 `src/api/typings.d.ts`，由 OpenAPI 生成。

### 鉴权约定

- Token 存储在 `localStorage`，key 为 `authorization`（`LOCALHOST_ENUMS.TOKEN`）。
- `getInitialState` 启动时读取 token -> 拉取用户信息 -> 返回 `API.UserBaseInfoVO` 给 `access` 模块。
- 请求拦截器自动注入 `authorization` header。
- 401 由响应拦截器统一处理：清 token + 跳首页 + `message.warning`。

### 提交规范

项目未强制 commit message 规范，但建议遵循：

```
<type>(<scope>): <subject>

<body>
<footer>
```

`type` 推荐：`feat` / `fix` / `refactor` / `style` / `docs` / `test` / `chore` / `perf`。

## 浏览器兼容性

- Chrome / Edge `>= 90`
- Safari `>= 14`
- Firefox `>= 88`
- 不支持 IE

依赖：`EventSource`、`URL API`、`CSS var()`、`aspect-ratio` 等现代浏览器特性。

## 常见问题

### Q: 修改 `src/api/` 后下次 `yarn genapi` 会覆盖怎么办？

API 文件禁止手改。如需调整类型，修改后端 swagger spec 后重新生成。

### Q: `yarn dev` 接口报 401？

检查 `localStorage` 的 `authorization` 是否有效。可清除后重新登录，或直接访问 `/?token=xxx` 注入。

### Q: 模板新增后不显示？

确认 `src/pages/TemplateDir/index.ts` 是否注册，且后端模板字典是否同步。

### Q: AI 诊断无响应？

1. 检查 `.env` 的 `UMI_APP_ENABLE_AI` 是否为 `true`。
2. 确认后端 AI 服务可用，浏览器 Network 看 SSE 连接是否建立。
3. VIP 体系开启时检查 `checkCount` 额度。

### Q: PDF 导出空白？

- 确认 `resume-puppeteer` 服务正常。
- 检查 `/preview/:id?print=1` 是否能正常渲染（puppeteer 会先访问这个页面）。
- 浏览器拦截了 popup 也会导致下载失败，检查浏览器设置。

## 贡献指南

1. Fork 本仓库
2. 新建分支：`git checkout -b feat/your-feature`
3. 提交代码前运行 `yarn format` 确保代码风格
4. 提交 PR，描述清晰的问题背景与解决方案

> 优先关注以下方向：模板新增与优化、AI 诊断准确度提升、PDF 导出排版优化、移动端体验。

## 许可证

[MIT License](./LICENSE) © 2023 wktline

## 作者

- **wktline** / **krlin** / **kr**

如遇紧急问题，可在站内点击右下角「问题反馈」提交，或扫码添加作者微信（注明来意）。

---

> 本项目仅用于学习交流，禁止用于商业用途的二次销售。如需合作请通过线上站点联系。
