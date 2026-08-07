# resume-h5

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev/)
[![UmiJS Max](https://img.shields.io/badge/UmiJS%20Max-4-7011ff.svg)](https://umijs.org/)

面向移动端的所见即所得简历编辑器 H5。基于 UmiJS Max + antd-mobile 构建，提供模块化简历编辑、AI 内容优化、多主题色切换、PDF 导出等能力，针对触屏交互优化。

## 功能特性

- **模块化简历编辑**：基础信息、工作经历、项目经历、技能特长等模块独立编排，支持拖拽排序、增删复制
- **AI 智能优化**：基于 SSE 流式输出，AI 辅助生成与润色简历内容，实时呈现优化结果
- **多主题与自定义**：内置多套主题色，支持自定义主题色、行距、字号、页面边距、头像样式
- **实时预览**：所见即所得，编辑态与预览态共用同一渲染组件，避免双视图差异
- **PDF 导出**：一键导出高质量 PDF，由后端 puppeteer 渲染保证排版一致性
- **富文本编辑**：集成 Quill，提供 `snow` / `bubble` 两种模式适配不同编辑场景
- **简历管理**：保存、复制、删除等全生命周期管理，防抖自动落库
- **移动端优先**：基于 antd-mobile 触屏组件库，操作流畅
- **响应式适配**：通过 ahooks `useResponsive` 适配 small / middle / large 三档断点
- **新手引导**：内置操作指引，降低首次使用成本

## 技术栈

| 类别       | 选型                                  |
| ---------- | ------------------------------------- |
| 框架       | UmiJS Max 4.x（React 18 + TypeScript 5） |
| UI 组件库  | antd-mobile 5                         |
| 样式方案   | Tailwind CSS 3（已禁用 preflight）+ Less |
| 富文本     | Quill 2、md-editor-rt（AI 流式渲染）  |
| 拖拽       | react-beautiful-dnd                   |
| 图标       | @icon-park/react                      |
| 工具库     | ahooks、dayjs、color、uuid            |
| API 生成   | @umijs/openapi（基于 swagger）        |

## 环境要求

- Node.js >= 18
- Yarn 1.x
- 现代浏览器（Chrome / Safari / Edge 最新版，移动端为主）

## 快速开始

```bash
git clone <repo-url>
cd resume-h5
yarn            # 安装依赖，会自动执行 max setup 初始化临时文件
yarn dev        # 启动开发服务，默认 http://localhost:8000/h5/editor
```

> 默认 `/resume-api` 代理到线上后端服务，可直接体验完整功能。如需对接本地后端，修改 `.umirc.ts` 的 `proxy` 字段。

## 常用命令

| 命令            | 说明                                                                |
| --------------- | ------------------------------------------------------------------- |
| `yarn dev`      | 启动开发服务（端口 8000，base `/h5/`）                              |
| `yarn build`    | 生产构建，产物输出到 `dist/`                                        |
| `yarn genapi`   | 拉取 swagger 重新生成 `src/api/`（见下方「API 自动生成」）          |
| `yarn upload`   | 将 `dist/` 上传到七牛云 CDN（依赖环境变量，需配置 `QINIU_AK` / `QINIU_SK`） |
| `yarn publish`  | 通过 SCP 将 `dist/index.html` 推送到目标服务器（需配置服务器访问）  |
| `yarn one-push` | `build` → `upload` → `publish` 一条龙                               |

> `upload` / `publish` / `one-push` 涉及外部依赖，二次开发者通常无需执行。

## 目录结构

```
src/
├── api/              # 自动生成（由 openapi.config.ts 拉取 swagger），请勿手改
├── app.tsx           # Umi 运行时配置：getInitialState、request 拦截器
├── context.ts        # ResumeDataContext：编辑器全局简历数据
├── constants/        # enums.ts（localStorage key、角色）、template-data.ts（默认简历模板）
├── interface/        # resume.ts：简历核心类型定义（IResumeData / IEntryItem / IContent）
├── layouts/          # 全局布局
├── models/           # global.ts：useGlobal model（VIP 信息、AI SSE、响应式断点）
├── pages/Editor/     # 简历编辑器主页面（核心业务）
├── pages/components/ # 跨页面复用组件（QuillEditor、SvgIcons、TitleIcons 等）
├── pages/hooks/      # 业务 hooks（useQueryParams 等）
└── utils/            # tools.ts（颜色反转、uuid）、url-utils.ts（query 处理）
```

## 配置说明

### API 自动生成

`src/api/` 由 `@umijs/openapi` 根据 swagger 自动生成，每次执行 `yarn genapi` 会整体覆盖，**请勿手动修改**。新增接口请先在后端 swagger 定义，再重新生成。

生成配置见 `openapi.config.ts`，默认从 `http://127.0.0.1:8088/swagger-api-json` 拉取。`src/api/index.ts` 以命名空间聚合，调用方式：

```ts
import Api from '@/api';
Api.User.getUserInfo({ ignoreInterceptErr: true });
```

### 请求与鉴权

- 响应体统一结构：`{ code, data, message, success }`，判断成功请用 `res.success`
- Token 存储在 `localStorage`，key 为 `authorization`，请求拦截器自动注入同名 header
- 后端返回 `code === 401` 时，前端清 token 并跳回首页
- 跳过全局错误提示：调用时传 `{ ignoreInterceptErr: true }`
- Blob 响应不进入错误拦截，下载类接口可直接用 `responseType: 'blob'`

### 主题色机制

主题色通过 CSS 变量 `--primary-color`（RGB 三通道逗号分隔）动态切换，Tailwind 中 `primary` / `primary-10` ~ `primary-900` 系列颜色均基于该变量，使用 `bg-primary-100` 等工具类会自动跟随主题。

计算前景对比色用 `src/utils/tools.ts` 的 `reversalColor(themeColor)`，返回 `{ luma, rgb, contrastColor }`，根据亮度自动选择深 / 浅文字色。

### AI 流式接口

AI 能力走 SSE，统一使用 `useGlobal` model 中的 `sendAiSseEvent`（`src/models/global.ts`），已封装 `EventSourcePolyfill` + token header + 关闭清理逻辑。请勿直接 `new EventSource(...)`，会丢失鉴权信息。

### 环境变量

涉及外部依赖的脚本（`upload` / `publish`）通过环境变量读取敏感信息：

| 变量名        | 用途                              |
| ------------- | --------------------------------- |
| `QINIU_AK`    | 七牛云 AccessKey（`upload.cdn.js`） |
| `QINIU_SK`    | 七牛云 SecretKey（`upload.cdn.js`） |
| `DEPLOY_HOST` | 部署目标服务器地址（`publish` 脚本） |
| `DEPLOY_PATH` | 部署目标路径（`publish` 脚本）     |

> 实际部署时请在本地配置上述变量，或使用 CI/CD 平台的 Secrets 管理，不要将真实值提交到代码仓库。

## 部署

`yarn build` 后产物在 `dist/`，包含完整的静态资源，可托管到任意静态服务器或对象存储 CDN。原项目采用「七牛 CDN 托管静态资源 + nginx 托管 HTML」的组合，开源用户可按需选择托管方案。

部署相关脚本（`upload` / `publish` / `one-push`）内置了原项目的部署路径，二次使用前需根据自身环境调整：

- `upload.cdn.js` 中的 `scope: 'fresume:${dist}'` 是七牛 bucket 名，需替换为目标 bucket
- `package.json` 中 `publish` 脚本的 SCP 目标地址需替换为己方服务器

## 代码风格

- **Prettier**：120 列宽、单引号、强制分号、对象花括号内空格、`trailingComma: 'all'`
- **ESLint**：继承 `@umijs/max/eslint`
- **导入排序**：`prettier-plugin-organize-imports` 自动排序 import
- **TypeScript**：路径别名 `@/` 指向 `src/`

提交前会自动格式化，无需手动调整。

## 贡献指南

欢迎通过 Issue 反馈问题或提交 PR。提交前请确保：

- `yarn build` 通过
- 不要修改 `src/api/` 与 `src/.umi/` 等自动生成目录
- 新增功能请同步更新 `src/interface/` 下的类型定义与 `src/constants/template-data.ts` 的默认模板

## 协议

[MIT](./LICENSE)
