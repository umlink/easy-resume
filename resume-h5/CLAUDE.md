# CLAUDE.md

本项目 `resume-h5` 是面向移动端的简历编辑器 H5，基于 UmiJS Max。文档面向 AI 协作助手，目标是让 Claude 快速理解项目约定、避开易踩坑点。

## 技术栈

- **框架**：UmiJS Max 4.x（React 18 + TypeScript 5）
- **UI**：antd-mobile 5 + Tailwind CSS 3（已禁用 `preflight`，避免与 antd-mobile 默认样式冲突，不要重新开启）
- **富文本**：Quill 2（`src/pages/components/QuillEditor.tsx`）、md-editor-rt（用于 AI SSE 流式渲染）
- **拖拽**：react-beautiful-dnd（简历模块排序）
- **图标**：`@icon-park/react`
- **工具库**：ahooks、dayjs（已配置中文 + relativeTime）、color、uuid

## 常用命令

```bash
yarn dev          # 本地开发，默认端口 8000，base 为 /h5/
yarn build        # 生产构建，产物输出到 dist/
yarn genapi       # 拉取 127.0.0.1:8088 的 swagger 重新生成 src/api（见 openapi.config.ts）
yarn upload       # 将 dist/ 上传到七牛云 CDN（upload.cdn.js）
yarn publish      # scp dist/index.html 到服务器的 nginx 目录
yarn one-push     # build → upload → publish 一条龙
```

> `yarn genapi` 依赖本地后端服务在 `127.0.0.1:8088` 暴露 swagger 接口；端口或地址变更需同步修改 `openapi.config.ts`。

## 路由与部署

- 仅 `/editor` 一个路由（`.umirc.ts`），其余页面（如 `src/pages/Mine`、`src/pages/index.tsx`）当前未挂载，新增页面需要同步在 `.umirc.ts` 的 `routes` 中声明。
- 生产环境 `base: '/h5/'`、`publicPath: 'https://static.wktline.com/resume-h5/'`。所有静态资源走七牛 CDN，HTML 走 nginx。
- 后端代理：`/resume-api` → `https://www.wktline.com`（含 puppeteer pdf 接口）。本地调试如需切换环境，改 `.umirc.ts` 的 `proxy`，不要提交本地代理地址。

## 目录结构与职责

```
src/
├── api/              # ⚠️ 自动生成，禁止手改（genapi 会整体覆盖）
├── app.tsx           # Umi 运行时配置：getInitialState、request 拦截器
├── context.ts        # ResumeDataContext：编辑器全局简历数据
├── constants/        # enums.ts（localStorage key、角色）、template-data.ts（默认简历模板）
├── interface/resume.ts  # 简历核心类型定义（IResumeData / IEntryItem / IContent）
├── layouts/          # 全局布局
├── models/global.ts  # useGlobal model：VIP 信息、AI SSE、用户信息刷新、响应式断点
├── pages/Editor/     # 简历编辑器主页面（核心业务）
├── pages/components/ # 跨页面复用组件（QuillEditor、SvgIcons、TitleIcons 等）
└── utils/            # tools.ts（颜色反转、uuid）、url-utils.ts（query 处理）
```

## 核心约定（易踩坑点）

### 1. `src/api/` 严禁手改
所有 API 函数由 `@umijs/openapi` 根据 swagger 自动生成，每次 `yarn genapi` 会整体覆盖。新增接口请先在后端 swagger 定义，再重新生成。`src/api/index.ts` 以命名空间聚合（`Api.User.getUserInfo`），调用时统一用 `Api.模块.方法`。

### 2. 请求拦截与鉴权
- Token 存 `localStorage`，key 为 `'authorization'`（见 `constants/enums.ts` 的 `LOCALHOST_ENUMS.TOKEN`）。
- `app.tsx` 的 `requestInterceptors` 自动注入同名 header；后端校验失败返回 `code === 401` 时，前端会清 token 并跳回 `/`。
- 响应体统一字段：`{ code, data, message, success }`。判断接口成功用 `res.success`，不要用 `code === 0`。
- 跳过全局错误提示：调用时传 `{ ignoreInterceptErr: true }`（见 `getInitialState` 中获取用户信息的写法）。
- blob 响应不会进入错误拦截分支，下载类接口可直接用 `responseType: 'blob'`。

### 3. 简历数据流
- 全局简历状态通过 `ResumeDataContext`（`src/context.ts`）下发，不要在子组件里再发请求拉同一份数据。
- 编辑器采用「本地立即更新 + 防抖 1.5s 落库」策略（`useDebounceFn(updateData, { wait: 1500 })`）。需要立即落库时传 `immediately: true`，例如失焦、切换模块。
- 简历数据结构见 `interface/resume.ts`，新增字段需同步更新 `constants/template-data.ts` 的默认模板，否则旧数据迁移会缺字段。

### 4. 主题色机制
- 主题色不是固定的，而是通过 CSS 变量 `--primary-color`（RGB 三通道逗号分隔）动态切换。
- Tailwind 中 `primary` / `primary-10` ~ `primary-900` 系列颜色都基于该变量（见 `tailwind.config.js`），所以写 `bg-primary-100` 会自动跟随主题。
- 计算前景对比色用 `utils/tools.ts` 的 `reversalColor(themeColor)`，返回 `{ luma, rgb, contrastColor }`，根据亮度选择深/浅文字色。

### 5. AI 流式接口
- AI 能力走 SSE，统一用 `useGlobal` 中的 `sendAiSseEvent`（`models/global.ts`），它已封装 `EventSourcePolyfill` + token header + 关闭清理逻辑。
- 不要直接 `new EventSource(...)`，会丢 token。

### 6. 响应式断点
`models/global.ts` 中通过 `configResponsive` 扩展了断点：`small: 640`、`middle: 768`、`large: 1024`。使用 `useGlobal().responsive` 获取，不要自己写媒体查询。

### 7. 富文本编辑器模式
`QuillEditor` 支持 `snow`（默认）与 `bubble` 两种模式，通过 `editMode` 切换。简历内容块在编辑态和预览态共用同一组件，模式切换通过 context 下发，不要在子组件本地维护一份 mode。

## 代码风格

- **Prettier**：120 列宽、单引号、强制分号、对象花括号内空格、`trailingComma: 'all'`（见 `.prettierrc`）。提交前会自动格式化。
- **ESLint**：继承 `@umijs/max/eslint`，关闭了 `no-redeclare`（TS 已覆盖）。`src/api/*.ts` 与 `openapi.config.ts` 已在 `ignorePatterns`，不要给生成代码加 lint 注释。
- **导入排序**：`prettier-plugin-organize-imports` 会自动排序 import，不要手动调整顺序。
- **TypeScript**：`tsconfig.json` 继承自 `src/.umi/tsconfig.json`（Umi 自动生成），路径别名 `@/` 指向 `src/`。

## 提交与发布

- Git 分支：`main` 为主分支。
- **不要直接部署到生产**：`yarn one-push` 会构建并 scp 到线上 nginx，属于不可逆操作。任何发布动作必须由用户明确发起，AI 协作时仅准备好代码与构建验证，不要主动执行 `upload` / `publish` / `one-push`。
- 构建产物 `dist/` 与 `src/.umi/` 已在 `.gitignore`，不要提交。

## 协作偏好

- 用中文交流，回复简洁直接，不写空洞的"最佳实践"段落。
- 修改代码前先读懂现有实现；遇到看起来奇怪的地方，多半是有历史原因（如防抖落库、CSS 变量主题色），先问而不是先删。
- 涉及自动生成的 `src/api/`、`.umi/` 目录，不要手动编辑，指引到对应配置文件（`openapi.config.ts`、`.umirc.ts`）。
- 不要在没有用户明确指令时执行 `git commit`、`git push`、`yarn publish`、`yarn one-push`。
