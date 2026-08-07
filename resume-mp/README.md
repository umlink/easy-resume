# 轻简历 · 微信小程序端

> 基于 Taro 4 + React 18 + TypeScript + Vite 构建的简历管理与下载小程序。配套 PC 站编辑简历，小程序随时浏览、下载 PDF。

[![Taro](https://img.shields.io/badge/Taro-4.0.4-2C9CDB?logo=taro&logoColor=white)](https://taro.jd.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ 功能特性

- 🏠 **首页展示** — 产品介绍、简历模板列表浏览
- 🔐 **微信登录** — 静默自动登录 + 扫码场景码登录（支持邀请码）
- 👤 **个人中心** — 用户信息、会员状态展示
- 📄 **简历下载** — 在线预览 / 下载简历 PDF，自动清理临时文件
- 🎨 **多端构建** — 一套代码支持微信 / 支付宝 / 字节 / 百度 / H5 / RN 等 10+ 平台

## 🛠 技术栈

| 分类 | 技术 |
|---|---|
| 框架 | Taro 4.0.4（React 18 + 自动运行时） |
| 语言 | TypeScript 5.4 |
| 构建 | Vite 4 |
| 样式 | Less |
| 网络 | Taro.request + 自定义拦截器（无第三方 HTTP 库） |
| 状态 | React hooks + props 透传（无 Redux/Zustand） |

## 📁 项目结构

```
resume-mp/
├── config/                  # Taro 构建配置（dev / prod / index）
├── src/
│   ├── app.config.ts        # 应用配置：页面注册、TabBar、窗口样式
│   ├── app.ts               # 应用入口
│   ├── request.ts           # 网络请求封装 + 全局拦截器
│   ├── pages/
│   │   ├── index/           # 首页（含模板列表 TemplateList）
│   │   ├── auth/            # 显式登录页（场景码解析）
│   │   ├── mine/            # 个人中心
│   │   │   └── components/  # BaseInfo / ResumeList / ResumeItem
│   │   └── template/        # 占位页面
│   ├── static/              # TabBar 图标等静态资源
│   └── index.html           # H5 端 HTML 模板
├── types/global.d.ts        # 资源模块与 process.env 类型声明
├── .env.example             # 环境变量模板
└── project.config.json      # 微信开发者工具项目配置
```

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) ≥ 18
- [Yarn](https://yarnpkg.com/) 1.x
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 最新稳定版
- 一个已认证的微信小程序 AppID（开发阶段也可使用 `touristappid`）

### 安装

```bash
git clone <your-repo-url>.git
cd resume-mp
yarn install
```

### 配置环境变量

复制模板并填入你自己的配置：

```bash
cp .env.example .env.development
```

```dotenv
# .env.development
TARO_APP_BASE_URL=https://your-domain.com/resume-api
TARO_APP_ID=wxyourappid
```

> `TARO_APP_BASE_URL` 是后端 API 的基础地址，结尾不要加斜杠。所有接口请求都会基于此地址拼接。

### 开发联调

```bash
yarn dev:weapp
```

构建产物输出到 `./dist`。打开微信开发者工具 → 导入项目 → 选择 `resume-mp` 目录（会自动读取 `project.config.json` 中的 `miniprogramRoot: ./dist`）。`--watch` 模式下保存源码即可在开发者工具中热刷新。

## 📜 可用脚本

| 脚本 | 用途 |
|---|---|
| `yarn dev:weapp` | 微信小程序开发模式（watch） |
| `yarn dev:h5` | H5 开发模式（watch） |
| `yarn dev:alipay` \| `swan` \| `tt` \| `qq` \| `jd` \| `rn` \| `harmony-hybrid` | 对应平台开发模式 |
| `yarn build:weapp` | 微信小程序生产构建（输出到 `./dist`） |
| `yarn build:h5` | H5 生产构建 |
| `yarn build:<platform>` | 其他平台生产构建 |

> ⚠️ 本项目未预置 `test` / `lint` / `format` 脚本。如需代码检查，可手动执行 `npx eslint src/`。

## 🔑 环境变量

通过 Taro 的 env 文件机制按环境注入（`.env.development` / `.env.test` / `.env.production`）。

| 变量 | 必填 | 说明 |
|---|---|---|
| `TARO_APP_BASE_URL` | ✅ | 后端 API 基础地址，例如 `https://your-domain.com/resume-api`。在 `src/request.ts` 中读取，并 `export` 为 `baseUrl` 供下载场景复用。 |
| `TARO_APP_ID` | ❌ | 微信小程序 AppID。也可直接改 `project.config.json` 中的 `appid` 字段。 |

## 📡 后端接口约定

小程序默认调用以下接口（位于 `${TARO_APP_BASE_URL}` 下）。如果你要自建后端，请保持接口路径与响应结构一致。

| 方法 | 路径 | 入参 | 出参 |
|---|---|---|---|
| POST | `/auth/wxmp/auto-login` | `{ code }` | token 字符串 |
| POST | `/auth/wxmp/code-login` | `{ code, verifyCode, inviteCode }` | token 字符串 |
| POST | `/template/list` | `{ pageNum, pageSize }` | `{ list: TemplateItemVO[] }` |
| GET | `/user/info` | — | `{ username, avatar, ... }` |
| GET | `/vip/info` | — | 会员信息（含 `userId`、`expireTime`） |
| POST | `/resume/list` | `params: { pageNum, pageSize }` | `{ list: ResumeItemVO[] }` |
| GET | `/resume/pdf/{id}` | — | 用于下载 PDF 的 `authCode` |
| GET | `/puppeteer/pdf?authCode=...` | — | PDF 二进制流（不走 `request()`，由 `Taro.downloadFile` 直接调用） |

统一响应结构：

```ts
type ResponseDto<T> = {
  code: number;
  data: T;
  success: boolean;
  message: string;
};
```

调用方约定用 `ret.success` 判断成功（而非 `ret.code`）。

## 🏗 架构概览

```
┌─────────────────────────────────────────────────────┐
│                    微信小程序                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  首页     │  │  登录页   │  │   个人中心        │  │
│  │ (auto-   │  │ (scene码 │  │  ┌────────────┐  │  │
│  │  login)  │  │  解析)   │  │  │ 简历列表    │  │  │
│  │          │  │          │  │  └────────────┘  │  │
│  └────┬─────┘  └────┬─────┘  │  ┌────────────┐  │  │
│       │             │        │  │ 简历下载    │  │  │
│       │             │        │  │ (PDF 流程)  │  │  │
│       │             │        │  └────────────┘  │  │
│       └──────┬──────┘        └────────┬──────────┘  │
│              │                        │              │
│              ▼                        ▼              │
│       ┌──────────────────────────────────────┐      │
│       │   src/request.ts (Taro.request 封装)  │      │
│       │   - 全局拦截器注入 TOKEN              │      │
│       │   - 统一 ResponseDto<T> 响应         │      │
│       └──────────────┬───────────────────────┘      │
└──────────────────────┼──────────────────────────────┘
                       │ HTTPS
                       ▼
              ┌─────────────────┐
              │   你的后端服务    │
              │  (resume-api)   │
              └─────────────────┘
```

### 🔑 登录流程

1. **静默自动登录**（首页 `useLoad`）：`Taro.login()` 拿微信 `code` → POST `/auth/wxmp/auto-login` → 存 `TOKEN` 到本地存储。每次进首页都会触发。
2. **显式登录**（`pages/auth`）：用户通过携带 `scene`（形如 `verifyCode-inviteCode`）的二维码进入 → `Taro.login()` 的 code 连同场景码参数一起 POST `/auth/wxmp/code-login` → 成功后跳转首页 tab。

### 📄 PDF 下载流程

下载流程涉及临时文件管理，详见 [`CLAUDE.md` · PDF 下载链路](./CLAUDE.md#pdf-下载链路pagesminecomponentsresumeitemtsx)。要点：

1. 请求 `/resume/pdf/{id}` 拿到一次性 `authCode`
2. `Taro.downloadFile` 下载 PDF 到临时路径
3. `FileSystemManager.saveFile` 保存到 `${USER_DATA_PATH}/${title}.pdf`（保留中文文件名）
4. `Taro.openDocument` 调起系统预览
5. 成功后清理临时文件 + 已保存文件，避免占用用户存储

## 📦 部署

### 微信小程序

```bash
yarn build:weapp
```

打开微信开发者工具 → 上传 → 在微信公众平台提审。

### H5

```bash
yarn build:h5
```

将 `dist/` 目录部署到任意静态资源服务器或 CDN。

## 🤝 贡献

欢迎提 Issue 与 PR。提交前请确保：

- `yarn build:weapp` 能正常构建（`tsconfig.json` 启用了 `noUnusedLocals` / `noUnusedParameters` / `strictNullChecks`，未使用的变量会导致编译失败）
- 新增页面已在 `src/app.config.ts` 中注册
- 涉及接口的改动需要同步更新 `CLAUDE.md` 中的「后端接口」一节

## 📄 License

[MIT](LICENSE) © 轻简历

## 🙏 致谢

- [Taro](https://taro.jd.com/) — 跨端开发框架
- [React](https://react.dev/) — UI 库
- [Vite](https://vitejs.dev/) — 下一代前端构建工具

---

> 💡 **提示**：本仓库为开源版本，已移除生产环境域名、微信 AppID 与静态资源 CDN 等敏感信息，使用前请按「[配置环境变量](#配置环境变量)」一节完成自有配置。详细的代码架构与开发约定请参考 [CLAUDE.md](./CLAUDE.md)。
