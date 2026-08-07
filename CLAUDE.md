# CLAUDE.md

本文件为 `easy-resume` 仓库根目录的 AI 协作指引。仓库下有 5 个独立子项目，每个子项目**各自**带有更详细的 `CLAUDE.md`，进入对应目录工作前请先读那份。

## 项目概述

"Easy简历" / "轻简历" 是一个面向中文用户的简历制作 SaaS。线上域名 `wktline.com`，主要功能：PC 端所见即所得简历编辑器、AI 简历诊断（SSE 流式）、VIP 会员体系、微信小程序登录、微信支付、PDF 导出（Puppeteer 服务端渲染）、邀请奖励、模板画廊。

> 仓库为多项目目录（**非 yarn workspace，非 monorepo**）：每个子项目独立 `package.json` / `yarn.lock`，互不依赖、独立部署。共享的是同一份 git 历史与线上域名/账号体系。

## 子项目布局

| 目录 | 角色 | 技术栈 | 端口 / 入口 | 详细文档 |
|---|---|---|---|---|
| `resume-server/` | 后端 API 服务 | NestJS + Fastify + Prisma + MySQL | `:8088`，前缀 `/resume-api`，Swagger `/swagger-api` | `resume-server/CLAUDE.md` |
| `resume-pc/` | PC 端主站（核心编辑器） | Umi Max 4 + React 18 + Ant Design 5 + Tailwind 3 + Quill 2 | `:8000`，路由 `/editor/:rId` | `resume-pc/CLAUDE.md` |
| `resume-h5/` | 移动端 H5 编辑器 | UmiJS Max + antd-mobile 5 + Tailwind 3 | `:8000`，base `/h5/`，仅 `/editor` 路由 | `resume-h5/CLAUDE.md` |
| `resume-mp/` | 微信小程序 | Taro 4 + React 18 + Vite | 编译产物 `dist/`，由微信开发者工具加载 | `resume-mp/CLAUDE.md` |
| `resume-puppeteer/` | PDF 渲染微服务 | Koa + Puppeteer + 七牛 OSS | `:8090`，三条 GET 路由 | `resume-puppeteer/CLAUDE.md` |

包管理器统一为 **yarn**（每个子项目各自 `yarn install`）。Node ≥ 18。无根目录 `package.json`，无 workspace 配置——执行命令前先 `cd` 进对应子目录。

## 跨项目契约（所有前端 + 后端共享）

理解这些契约能避免 90% 的"看起来对、跑起来错"的问题：

### 1. 统一响应结构

所有后端接口（含错误）HTTP 状态码都是 **200**，真实状态在 body 里：

```ts
{ code: number, message: string, data: T | null, success: boolean }
```

- 判断成功用 `success`（或 `code === 200`），**不要**用 `code === 0`。
- 后端 `HttpExceptionFilter` 把异常包成 `{ code, message, success: false, data: null, timestamp }` 但 HTTP 仍返回 200。前端拦截器按 `success` 分流，错误统一走 `message.error`（PC/H5）或 toast（MP）。
- 跳过全局错误提示：PC/H5 给请求传 `{ ignoreInterceptErr: true }`；MP 在 `request.ts` 调用处自行处理。

### 2. 鉴权

- Header key：字面量 `'authorization'`（PC/H5/MP 全一致）。
- 值：JWT 字符串，无 `Bearer ` 前缀。
- 存储：
  - PC / H5：`localStorage['authorization']`（PC `src/constants/enums.ts` 的 `LOCALHOST_ENUMS.TOKEN`）
  - MP：`Taro.setStorageSync('TOKEN', ...)`（key 字面量 `'TOKEN'`）
- 后端 `JwtAuthGuard` 默认所有路由需登录，`@NotLogin()` 显式放开。JWT payload 含 `isVip`，由 `VipGuard` 用于会员校验，**前端无需额外请求**就能拿到 VIP 状态。

### 3. OpenAPI 自动生成

PC / H5 / MP 的 `src/api/` 都是 `@umijs/openapi` 从后端 swagger 自动生成的，**禁止手改**：

- 后端启动后跑 `yarn genapi`，从 `http://127.0.0.1:8088/swagger-api-json` 拉取并覆盖 `src/api/`。
- 后端 swagger 由 `addResponseWrapper`（`resume-server/src/utils/modules-utils.ts`）后处理，给所有响应统一套上 `{ code, message, data, success }` 外壳，所以前端生成的类型已经是包装后的形态。
- 改后端 DTO 字段后必须重跑 `yarn genapi`，否则前端类型对不上。

### 4. PDF 导出链路（跨三端）

```
前端 → POST /resume/pdf/{id}      → 后端返回 authCode（AES-128-CBC 加密，含 resumeId+token+margin）
前端 → GET  /resume-api/puppeteer/pdf?authCode=...
                                  → puppeteer 服务解密 → 拼预览页 URL（?print=1）→ 渲染 A4 PDF → 直出二进制流
```

- `/resume-api/puppeteer/pdf` 路由在 `resume-puppeteer/src/index.js`，由前端**直接调用 puppeteer 服务**（不经过 `request()` JSON 拦截器），用 `responseType: 'blob'` / `Taro.downloadFile` 接收二进制。
- AES key/iv 硬编码在 `resume-puppeteer/src/tools.js`，加密侧在后端 `resume-server`。**两侧必须同步修改**，否则解密失败。
- 另有 `/resume-api/puppeteer/pdf-new` 路由：渲染后上传七牛 OSS 返回 URL，目前 PC 端未默认走这条。
- 小程序下载 PDF 流程更复杂（拿 authCode → `Taro.downloadFile` → `saveFile` → `openDocument` → 清理临时文件），见 `resume-mp/CLAUDE.md` 的"PDF 下载链路"一节。

### 5. AI SSE 流式接口

- 后端 `/ai/optimize/*` 用 `@Sse` 返回 RxJS `Observable`，流式输出 LLM 文本。VIP 额度（token / 检查次数）在流生命周期内扣减。
- 前端**不要直接 `new EventSource(...)`**——会丢 `authorization` header。PC/H5 用 `useGlobal` 里的 `sendAiSseEvent`（已封装 `EventSourcePolyfill` + token header + 关闭清理）。
- 协议约定：`done` 前缀表示完成，`done-` 前缀表示额度不足等警告。
- 60s 全局 `TimeoutInterceptor` 不影响 SSE（在 body resolve 前就返回了 Observable），但同步阻塞型接口要注意。

### 6. VIP 体系与功能开关

- 后端：`VipGuard` + `@RequiredVip()` 装饰器 + `vip_type_sell_type` 枚举（`SELL`/`GIFT`/`PRIVATE`）。
- PC 端 feature flag：`UMI_APP_ENABLE_VIP` / `UMI_APP_ENABLE_AI`（`resume-pc/src/constants/feature-flags.ts`）。当前 `.env` 关闭 VIP（`UMI_APP_ENABLE_VIP=false`），意味着 PDF 导出与 AI 诊断对所有登录用户开放，由后端自行决定计费。
- 改 feature flag 后需重启 dev server / 重新 build。

### 7. 微信小程序登录

两条路径，都在后端 `/auth/wxmp/*`：

- `auto-login`：`{code}` 静默登录，每次进首页执行，token 存 storage。
- `code-login`：`{code, verifyCode, inviteCode}` 显式登录，`verifyCode` + `inviteCode` 从二维码 scene 参数按 `-` 切分得到。新用户首次登录赠送 GIFT VIP，邀请人加 VIP 天数。

## 共享基础设施

- **域名**：生产 `wktline.com`；PC dev 代理 `/resume-api` → `https://www.wktline.com`（`resume-pc/config/proxy.ts`）。本地后端 `:8088`，puppeteer `:8090`，PC/H5 dev `:8000`。
- **CDN**：七牛云 bucket `fresume`，前缀分布：`resume/`（PC 静态资源）、`resume-h5/`（H5 静态资源）、`resume-pdf/`（PDF 临时上传）、`resume/` 通用图片上传。
- **CDN 域名**：`static.wktline.com`，PC/H5 `publicPath` 指向它。
- **数据库**：MySQL，Prisma `relationMode = "prisma"`（**无 DB 级外键**，级联在 JS 层完成）。所有 ID 是 `BigInt`，由 Prisma 中间件序列化为 string——前端拿到的 ID 都是字符串。
- **ID 生成**：Snowflake（`simple-flakeid`，15 位数字），用于 `aiTask.id` 等客户端可生成的 ID。

## 通用协作约定

以下约定跨子项目一致，未单独列出的请看对应子项目的 `CLAUDE.md`：

- **`src/api/` 全部自动生成**（PC/H5/MP），任何手改都会被下次 `yarn genapi` 覆盖。要改字段去后端 swagger。
- **不要在未明确指示时执行发布动作**：`yarn upload` / `yarn publish` / `yarn one-push` / `yarn refresh:cdn` / `pm2 restart` 都属于不可逆线上操作，必须由用户明确发起。
- **路径别名**：所有子项目都用 `@/*` 指向 `src/*`（后端、PC、H5、MP 均如此）。新代码用 `@/`，不要混入相对路径。
- **TypeScript 严格模式**：`noUnusedLocals` / `noUnusedParameters` / `strictNullChecks` 在 MP 已开启，其他端按各自 tsconfig。出现未使用变量可能直接构建失败。
- **日期**：统一 `dayjs`，不要引入 Moment。
- **样式**：PC/H5/MP 都用 Tailwind + Less，PC/H5 的 `preflight: false`（让 antd / antd-mobile 接管基础样式），**不要重新开启**。Tailwind 类只在 `.tsx` 里写，扫描不到 `.less` / `.md` 里的类。
- **富文本**：Quill 2，自定义字号白名单 `ft10/ft12/ft14/ft16/ft18/ft20`（PC/H5 共用）。

## 已知安全债（不要传播，迁移时优先处理）

- `resume-pc/upload.cdn.js` / `refresh.cdn.js`：硬编码七牛 AK/SK。
- `resume-puppeteer/src/tools.js`：硬编码 AES key/iv + 七牛 AK/SK。
- `resume-server/src/modules/ai/bd.service.ts` / `xf.service.ts` / `kimi.service.ts` / `deepseek.service.ts`：构造函数硬编码 LLM API key。
- `.env.*` 文件含真实 DB 密码 / JWT secret / 微信 MP secret / 邮箱授权码——已 gitignore，不要提交新 secret 时漏配。

新增 provider / 新增上传渠道时，**优先用 `ConfigService.get` 或环境变量**，不要继续硬编码模式。

## 协作偏好

- 用中文交流，回复简洁直接，不写"最佳实践"式空话。
- 修改代码前先读懂现有实现；看起来奇怪的代码多半有历史原因（防抖落库、CSS 变量主题色、BigInt 序列化等），**先问而不是先删**。
- 跨项目改动（如改后端 DTO 同时改前端 `src/api/`）需要在 PR 描述里点明影响面，并跑通两端的 `yarn genapi` + `yarn build`。
- 涉及子项目的具体命令、目录结构、易踩坑点，**优先查该子项目的 `CLAUDE.md`**，本文件只负责跨项目视角。
