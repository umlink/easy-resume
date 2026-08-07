# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

`qresume-mp` 是 **轻简历** 的微信小程序端，基于 **Taro 4.0.4 + React 18 + TypeScript + Vite** 构建。功能包括：浏览简历模板、微信静默登录、查看会员状态、下载/预览用户在 PC 站创建的简历。简历的编辑/制作只在 PC 端进行，小程序仅用于浏览和下载。

> 本仓库为开源版本：生产域名 / 微信 AppID / 静态资源 CDN 已替换为占位符，需通过环境变量自行配置（见下文「环境变量」一节）。

本仓库与同级的 `../resume-h5`（独立的 Taro H5 项目）不是 monorepo，互不依赖。

## 常用命令

包管理器为 **yarn**（已提交 `yarn.lock`）。

```bash
yarn install                       # 安装依赖

# 开发模式（watch），按目标平台选择：
yarn dev:weapp                     # 微信小程序（主目标）
yarn dev:h5                        # H5 / 浏览器
yarn dev:swan | alipay | tt | qq | jd | rn | harmony-hybrid

# 生产构建（一次性，不带 watch）：
yarn build:weapp                   # 产物输出到 ./dist
yarn build:h5
# （平台矩阵同 dev:*）
```

`package.json` **未定义 test / lint / format 脚本**。仓库内有 `.eslintrc`（继承 `taro/react`），需手动调用：`npx eslint src/`。`tsconfig.json` 开启了 `noUnusedLocals`、`noUnusedParameters`、`strictNullChecks` —— 出现未使用变量会导致 Taro 构建时的 TS 编译失败。

### 微信开发者工具联调流程
1. 复制 `.env.example` 为 `.env.development`（或直接修改已存在的 `.env.*`），填入你自己的 `TARO_APP_BASE_URL` 和 `TARO_APP_ID`。
2. 执行 `yarn dev:weapp`，产物输出到 `./dist`。
3. 打开微信开发者工具，导入项目（读取 `project.config.json`，其中 `miniprogramRoot: ./dist`，`appid` 默认为 `touristappid` -- 微信开发者工具内置的测试 AppID，可替换为你自己的）。
4. 开发者工具会编译 `dist`；`--watch` 重新构建后会在开发者工具中热刷新。

## 环境变量

通过 Taro 的 env 文件机制注入（`.env.development` / `.env.test` / `.env.production`）。模板见 `.env.example`。

| 变量 | 必填 | 用途 |
|---|---|---|
| `TARO_APP_BASE_URL` | 是 | 后端 API 基础地址，结尾不要加斜杠。例如 `https://your-domain.com/resume-api`。在 `src/request.ts` 中读取并导出为 `baseUrl`。 |
| `TARO_APP_ID` | 否 | 微信小程序 AppID。也可直接改 `project.config.json` 中的 `appid` 字段。 |

## 架构说明

### Taro 配置链路
- `config/index.ts` 是核心的 `defineConfig<'vite'>` 导出。会根据 `NODE_ENV` 合并 `config/dev.ts` 或 `config/prod.ts`。编译器为 **Vite**（不是 Webpack）—— `babel.config.js`（`compiler: 'vite'`）和 `config/index.ts`（`compiler: 'vite'`）两处都要保持一致。
- `designWidth: 750` —— 在样式中直接写 `px`，Taro 会自动转换为小程序的 `rpx` 和 H5 的 `rem`/`vw`。不要在 Less 中混入原始 `rpx`。
- `framework: 'react'`，`tsconfig.json` 中 `jsx: 'react-jsx'`（自动运行时）—— 无需 `import React`。
- 路径别名：`@/*` -> `./src/*`（在 `tsconfig.json` 的 `paths` 中声明，Taro 的 Vite 配置会通过 `TsconfigPathsPlugin` 接入）。注意：现有代码大多使用相对路径，两种方式都可用。

### App 入口与路由
- `src/app.config.ts` 是 Taro 的应用配置。已注册的页面：
  - `pages/index/index` —— 首页；自定义导航；加载时静默自动登录。
  - `pages/auth/index` —— 显式登录页；从进入场景的 `scene` 参数中解析 `verifyCode`/`inviteCode`（按 `-` 切分）。
  - `pages/mine/index` —— 个人中心 + 简历列表；自定义导航；`enableShareAppMessage: true`。
- TabBar 含两个入口：`index`（首页）和 `mine`（我的）。TabBar 图标位于 `src/static/`。
- **`pages/template/index` 和 `pages/editor/index` 均未在 `app.config.ts` 中注册**，但 `src/pages/template/index.tsx` 作为占位文件存在（仅渲染 `<View>11</View>`），且 `TemplateList.tsx` 在点击模板图时调用了 `Taro.navigateTo({url: '/pages/editor/index'})`，目前点击模板图会静默失败。在动手"修复"任一处之前先与用户确认，这些可能是未完成的占位逻辑。

### 网络层（`src/request.ts`）
所有 HTTP 请求都通过 `src/request.ts` 的默认导出函数：
- Base URL：`process.env.TARO_APP_BASE_URL`（见「环境变量」一节），从 `src/request.ts` 同时导出为 `baseUrl`，供 `ResumeItem.tsx` 拼 PDF 下载 URL 复用。
- 全局 Taro 拦截器会为每个请求注入 `authorization: Taro.getStorageSync('TOKEN')`。`request()` 函数在调用时也会再读一次 token，因此更新 storage 后立即生效。
- 响应结构：`{ code, data, success, message }`（`ResponseDto<T>`）。调用方约定用 `ret.success`（而非 `ret.code`）判断成功 —— 请保持这一约定。
- `method` 默认 `GET`。`data`（请求体）和 `params`（原意是 query string）都会被合并进 `Taro.request` 的 `data` 字段：GET 时成为 query string，POST 时成为 JSON body。两者不要同时传。

### 登录流程
1. **静默自动登录**（`pages/index/index.tsx` -> `useLoad(onLogin)`）：调用 `Taro.login()` 获取微信 `code`，POST 到 `/auth/wxmp/auto-login`，将返回的 token 存入 storage key `TOKEN`。每次进入首页都会执行。
2. **显式登录**（`pages/auth/index.tsx`）：用户通过携带 `scene`（形如 `verifyCode-inviteCode`）的二维码进入；`Taro.login()` 的 code 连同 `verifyCode` + `inviteCode` 一起 POST 到 `/auth/wxmp/code-login`。成功后切换到 tab `/pages/index/index`。

新增需要鉴权的页面时，拦截器已自动附上 token，直接 `request(...)` 即可。

### 后端接口（均位于 `${TARO_APP_BASE_URL}` 下）
- `POST /auth/wxmp/auto-login` `{code}` -> 返回 token 字符串
- `POST /auth/wxmp/code-login` `{code, verifyCode, inviteCode}` -> 返回 token 字符串
- `POST /template/list` `{pageNum, pageSize}` -> `{list: TemplateItemVO[]}`
- `GET /user/info` -> `{username, avatar, ...}`
- `GET /vip/info` -> 会员信息（含 `userId`、`expireTime`）
- `POST /resume/list`，`params: {pageNum, pageSize}` -> `{list: ResumeItemVO[]}`
- `GET /resume/pdf/{id}` -> 返回用于下载 PDF 的 `authCode` 字符串
- `GET /puppeteer/pdf?authCode=...`（直接通过 `Taro.downloadFile` 调用，**不走 `request()`**，URL 由 `baseUrl` + 路径拼接）-> PDF 二进制流

### PDF 下载链路（`pages/mine/components/ResumeItem.tsx`）
下载流程不直观，容易改坏：
1. `Taro.showLoading` -> 请求 `/resume/pdf/{id}` 拿到 `authCode`。
2. `Taro.downloadFile` 用 authCode 拼出的 URL 下载 PDF 到临时路径（**不走 `request()`**，绕过 JSON 拦截器）。
3. `Taro.getFileSystemManager().saveFile` 把临时文件保存到 `${USER_DATA_PATH}/${title}.pdf`，以保留中文文件名。
4. `Taro.openDocument({fileType: 'pdf', showMenu: true})` 打开预览，并显示"用其他应用打开"菜单。
5. 成功后通过 `removeSavedFile` 同时删除临时文件和已保存文件，避免占用用户存储空间。`loading` 状态上提到父组件 `ResumeList`，确保同一时间只有一个下载在进行。

### 样式
- 仅使用 Less（`package.json` 中 `templateInfo.css: "Less"`）。
- 每个页面有同名的 `.less` 文件与 `.tsx` 同级。页面级 class 命名遵循 `page-<name>` / `<name>-container` 约定，请保持。
- CSS Modules 在 `mini` 和 `h5` 的 postcss 配置中均为 **关闭** 状态 —— 不要 `import styles from './x.module.less'`。

### `types/global.d.ts`
为资源导入（`.png`、`.less` 等）声明了 ambient module，并扩展了 `NodeJS.ProcessEnv`（增加 `TARO_ENV`、`TARO_APP_ID`）。若要在 TS 中导入新的资源类型，在此文件中补充声明。

## 本仓库特有约定

- **无需 `import React`。** 已开启 `jsx: react-jsx`，ESLint 也设置了 `react/react-in-jsx-scope: off`。新文件不要写 `import React from 'react'`。
- **成功判断用 `ret.success`，而非 `ret.code`。** 多处调用方直接把 `res` 断言为 `any` —— 请沿用周围代码的风格，除非用户明确要求，不要中途引入严格类型。
- **Token 的 storage key 是字面量 `'TOKEN'`。** 若要重命名，需同时更新 `request.ts` 和两个登录页中的调用点。
- **页面配置文件**：`pages/auth/index.config.js` 是 JS（不是 TS）—— 脚手架遗留的怪癖。`definePageConfig` 是 Taro 的编译时宏，JS / TS 均可。
- **`Taro.previewImage` / `Taro.navigateTo`** 在 `TemplateList.tsx` 中已被注释 / 指向未注册路由（`/pages/editor/index`）。不要假设模板列表点击是可用的。

## 不在本仓库中的内容
- 没有单元/集成测试，没有 CI 配置，没有 Storybook。
- 没有状态管理库（无 Redux/Zustand/MobX）—— 状态用本地 `useState` 加 props 传递。
- 没有 i18n 层 —— UI 文案为硬编码简体中文。
- 同级的 `../resume-h5` 是独立的 Taro H5 项目，有自己的 `package.json`；除非用户明确要求，不要在当前仓库会话中改动它。
