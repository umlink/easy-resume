# 轻简历 (resume-pc)

在线简历制作工具（PC 端）。技术栈：Umi Max 4 + React 18 + Ant Design 5 + Tailwind 3 + Quill 2。线上地址 [wktline.com](https://www.wktline.com)。仓库与 H5 (`resume-h5`)、小程序 (`resume-mp`)、Puppeteer 服务 (`resume-puppeteer`)、后端 (`resume-server`) 同属 `easy-resume` monorepo。

## 命令

- `yarn dev` — 启动 dev server（默认 `0.0.0.0:8000`，见 `.env`）。`/resume-api` 代理到 `https://www.wktline.com`，见 `config/proxy.ts`。
- `yarn build` — `max build` 生产构建。
- `yarn genapi` — 从 `http://127.0.0.1:8088/swagger-api-json` 重新生成 `src/api/`（配置见 `openapi.config.ts`）。后端接口变更后再跑。
- `yarn format` — `prettier --write .`。
- `yarn upload` — 把 `dist/` 上传到七牛 CDN（`upload.cdn.js`，bucket=`fresume`，前缀 `resume/`）。
- `yarn refresh:cdn` — 刷新七牛 CDN 缓存（`refresh.cdn.js`）。
- `yarn publish` / `yarn build:publish` — 上传静态资源 + scp `index.html` 到 `43.138.253.179`。

## 目录结构

- `config/` — Umi 配置拆分：`config.ts`（主）、`routes.ts`、`proxy.ts`、`webpack.ts`（生产环境 splitChunks、moment locale 替换）。
- `src/api/` — OpenAPI 自动生成，**禁止手改**。改后端 spec 后跑 `yarn genapi`。`index.ts` 聚合 14 个模块 (Auth/User/Vip/Email/VipType/Invite/Resume/Template/Upload/Puppeteer/Propose/Guide/ResumeGroup/Order/Ai)。
- `src/pages/EditorOpt/` — PC 端简历编辑器（核心功能）。
  - `index.tsx` — 拉取简历、`useDebounceFn` 1.5s 自动保存、卸载时 flush。
  - `ResumeInterface.ts` — `IResumeData` 数据模型（`content` 含 `title/avatar/config/baseInfo/entryList/skill/margin`）。
  - `Actions.tsx`、`Header.tsx` — 工具栏与顶栏。
  - `components/` — `AiOpt.tsx`（AI 诊断）、`Export.tsx`（PDF 导出）、`Setting.tsx`、`ThemeColor.tsx`、`Template.tsx`、`Margin.tsx`、`LineSpace.tsx`、`ContentMode.tsx`、`HeaderPhoto.tsx`、`Skill.tsx`、`CopyData.tsx` 等。
- `src/pages/Mobile/EditorOpt/` — 移动端编辑器变体。
- `src/pages/Preview/` — 只读预览页 `/preview/:id`，支持 `?print=1` 进入打印模式，非会员显示水印。
- `src/pages/TemplateDir/` — 简历模板目录，按 `NoYYMMDD` 命名（如 `No240712`~`No250304`），`index.ts` 用 `TemplateMap` 注册。
- `src/pages/Template/` — 模板画廊。
- `src/pages/Home/`、`Content/`、`Guide/`、`Vip/`、`Recruitment/`、`User/`、`Tools/` — 其他业务页面。
- `src/components/` — 共享组件：
  - `QuillEditor.tsx`、`QuillResumeEditor.tsx` — 基于 Quill 的富文本编辑器，自定义字号白名单 `ft10/ft12/ft14/ft16/ft18/ft20`，工具栏图床上传走 `uploadFile`。
  - `UploadImage.tsx`、`CropImage.tsx`、`DivInput.tsx`、`FloatTools.tsx`（右下角问题反馈）、`EmailSyncData.tsx`。
  - `LoginContainer.tsx`、`MpLogin.tsx`、`ResetPassword.tsx`、`AccessAdmin.tsx`。
  - `VipContainer/` — 会员校验包装组件（`index.tsx`、`VipByModal.tsx`、`VipTypeItem.tsx`、`PayDesc.tsx`、`VipInfo.tsx` 等）。
  - `IconsSVG/`、`SvgIcons/`、`CommonIcons/` — 图标资源。
- `src/hooks/` — `useExportPDF`（直接走 puppeteer url）、`useExportPDFById`（先拿 authCode 再请求 puppeteer）、`useScrollMove`（触底回调，节流 100ms）、`useQueryParams`（基于 `query-string` + `replaceUrlByQuery` 同步 URL）。
- `src/models/global.ts` — umi model `useGlobal`：全局弹窗状态（登录/支付/改密/同步邮箱）、VIP 信息、`sendAiSseEvent`（封装 `EventSourcePolyfill` + JWT header）、`refreshUserInfo`、`responsive`（自定义断点 640/768/1024）。
- `src/context.ts` — `ResumeDataContext`，编辑器/预览页共享的简历上下文（`resumeData`、`readOnly`、`contrastColor`、`luma`、`editMode`、`editContentTitleId` 及更新函数）。
- `src/utils/` — `tools.ts`（`reversalColor` 计算主题色亮度/反差色、`getHexColorByAlpha`、`isMobile`、`generateRandomID`）、`format.ts`（日期格式化，含 `dateFormatPast`）、`print.ts`（`Print` 类，iframe 打印）、`url-utils.ts`（`addQuery`、`getQueryByKey`、`getQueryObject`、`replaceUrlByQuery`）、`funs-tools.tsx`。
- `src/constants/` — `enums.ts`（`LOCALHOST_ENUMS.TOKEN='authorization'`、`ROLES_ENUMS`）、`feature-flags.ts`（`VIP_ENABLED`、`AI_ENABLED`）、`template-data.ts`（默认简历模板）、`index.ts`（`PROJECT_TITLE`、`themeColor`、`subThemeColor`、`MD5_SALT`）、`provincial-data.ts`、`central-enterprisers-data.ts`、`invite-website-dasta.ts`。
- `src/access.ts` — 仅 `isLogin`（基于 `initialState.id`）。
- `src/app.tsx` — `getInitialState`：从 URL `?token=` 或 localStorage 读取 token → 拉取用户信息 → 写回 token。`request` 配置：20s 超时、JWT 注入 header `authorization`、401 清 token 跳首页、非 blob 响应默认 `message.error`（除非 `ignoreInterceptErr: true`）。
- `src/layouts/HeaderLayout.tsx` — 顶层布局，含 `Header` 与 `FloatTools`，首页之外的内容区限宽 1110px。

## 路由

定义于 `config/routes.ts`，顶层 layout 为 `HeaderLayout`：

- `/` — 首页（`layout: false`）
- `/template`、`/content/:key`、`/vip`、`/guide`（含 `:id` 详情、`/edit`）、`/recruitment`、`/user`
- `/tools` — 独立页（不在 HeaderLayout 下）
- `/editor/:rId` — PC 编辑器
- `/preview/:id` — 预览（支持 `?print=1`、`?code=` 分享授权码）
- `/mobile/editor/:rId` — 移动端编辑器
- `/test` — 测试页
- `/*` — 404

## 约定

- **Prettier**（`.prettierrc`）：120 列、单引号、尾逗号 all、2 空格、`proseWrap: never`，插件 `organize-imports` + `packagejson` + `tailwindcss`。提交前跑 `yarn format`，`.husky/pre-commit` 跑 `lint-staged`。
- **lint-staged**（`.lintstagedrc`）：`*.ts?(x)` → `max lint --fix --eslint-only` + prettier；`*.css/less` → `max lint --fix --stylelint-only` + prettier。
- **ESLint**（`.eslintrc.js`）：继承 `@umijs/max/eslint`，强制 `semi: always`、`object-curly-spacing: always`，关闭 `no-redeclare`。`openapi.config.ts` 与 `src/api/*.ts` 被 ignore（生成文件）。
- **Tailwind**（`tailwind.config.js`）：`preflight: false`（让 antd 接管基础样式）。`content` 只扫 `pages/components/layouts` 下的 tsx。主色用 CSS 变量：`bg-primary` → `rgba(var(--primary-color), <alpha-value>)`，`primary-10`~`primary-900` 是 1%~90% 透明度变体。自定义 `boxShadow.rl` 与 `aspectRatio`。**不要在 .tsx 之外（如 .less、.md）写 Tailwind 类**，扫描不到。
- **TypeScript**：`tsconfig.json` 仅 `extends: ./src/.umi/tsconfig.json`（umi 生成）。请求类型从 `@@/plugin-request/request` 导入。
- **API 调用**：统一从 `@/api` 默认导入，命名空间形式 `Api.Resume.getResumeInfo(...)`。响应结构 `{ code, data, message, success }`（见 `openapi.config.ts` `dataFields`）。失败默认弹 `message.error`，需要静默时给请求配置加 `ignoreInterceptErr: true`（参考 `app.tsx` 中 `getUserInfo`）。
- **鉴权**：token 存 localStorage `authorization`（`LOCALHOST_ENUMS.TOKEN`）。`getInitialState` 读取 → 拉取用户信息 → 返回 `API.UserBaseInfoVO` 给 `access`。401 由响应拦截器处理：清 token + 跳 `/`。
- **publicPath**：生产环境为 `https://static.wktline.com/${CDN_PREFIX}`（`CDN_PREFIX` 来自 `.env`，当前 `resume/`），dev 为 `/`。`window.publicPath` 在 `headScripts` 中同步注入，运行时通过 `runtimePublicPath` 解析。

## 功能开关 (Feature Flags)

`src/constants/feature-flags.ts` 通过 `.env` 的 `UMI_APP_*` 环境变量控制：

- `VIP_ENABLED` = `UMI_APP_ENABLE_VIP !== 'false'`。关闭后：隐藏所有会员入口（`VipContainer` 返回 null、`/vip` 导航不渲染）、跳过 PDF 导出 + AI 功能的额度校验。当前 `.env` 设为 `false`。
- `AI_ENABLED` = `UMI_APP_ENABLE_AI !== 'false'`。关闭后：`AiOpt`/`AiOptBtn` 返回 null、AI 接口不会触发。当前 `.env` 设为 `true`。
- 二者正交。AI 额度校验仅在 `AI_ENABLED && VIP_ENABLED` 同时为 true 时生效。
- 修改 `.env` 后需重启 dev server 或重新 build。

## 关键流程

- **编辑器自动保存**：`EditorOpt/index.tsx` 用 `useUpdateEffect` 监听 `resumeData` → `useDebounceFn(updateData, { wait: 1500 })` → `updateResume` API。组件卸载时再 flush 一次。
- **模板渲染**：`TemplateDir[templateCode]` 取出模板组件，通过 `ResumeDataContext` 注入 `resumeData`、`readOnly`、`contrastColor`（由 `reversalColor(themeColor)` 计算 luma 决定深底/浅底文字色）。
- **PDF 导出**：
  - `useExportPDF`：直接 `${origin}/resume-api/wktline/pdf?url=...&margin=...&fileName=...&token=...`，blob 下载。
  - `useExportPDFById`：先 `exportPDF({ id })` 拿 `authCode`，再 `${origin}/resume-api/puppeteer/pdf?authCode=${code}` 下载。`Export.tsx` 用的是后者。
- **AI 诊断**：`AiOpt.tsx` 调 `sendAiSseEvent('/resume-api/ai/optimize/inspect?resumeId=...')`，SSE 流式接收消息，`showdown` 把 markdown 转 HTML 写入 `QuillResumeEditor` 只读 Drawer。`done-` 前缀是额度不足等警告，`done` 是完成。组件卸载时 `eventSourceRef.current?.close()`。
- **预览分享**：`/preview/:id` 调 `previewResume({ id, code })`，`code` 是分享授权码（`genResumeAccessCode` 生成）。

## 注意事项

- `src/api/` 全部自动生成，**任何手改都会被下次 `yarn genapi` 覆盖**。要改字段就去改后端 swagger spec。
- `upload.cdn.js` 与 `refresh.cdn.js` 里硬编码了七牛 AK/SK（已泄露在仓库里），属于历史遗留安全风险，建议尽快迁移到环境变量或 CI secret。**不要在新代码里继续这种模式。**
- `.env` 当前关闭了 VIP 体系，意味着 PDF 导出和 AI 诊断对所有登录用户开放，后端自行决定是否计费。
- `dist/` 已被 gitignore，但仓库里曾提交过 `dist/` 目录（40+ 子目录），如果清理需要单独处理。
- `package.json` `author: badman`，实际维护者为 wktline / krlin / kr。
- Node 要求 `>=18`，pnpm `>=7`，但实际用 yarn（`.npmrc` 设了 npmmirror 镜像）。
- 仓库中 `dev-optAI` 是 AI 简历优化方向的活跃分支（参考 `src/pages/EditorOpt/components/AiOpt.tsx`）。
