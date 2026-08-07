# Easy 简历 NestJS 服务端

简历编辑 / AI 优化 / VIP 会员 / 微信小程序登录 / 微信支付 的后端服务，基于 NestJS + Fastify + Prisma + MySQL。

> 本仓库为开源脱敏版本，所有密钥已迁移到环境变量。

## 功能概览

- **简历管理**：多份简历、模板、分组、分享授权码、PDF 导出
- **AI 能力**（接入多家 LLM，按需切换）
  - DeepSeek：简历全文优化（SSE 流式）、模块优化、PDF 解析生成简历
  - Kimi（Moonshot）、百度千帆、讯飞星火：可扩展的 provider，按需启用
- **会员体系**：VIP 类型（SELL/GIFT/PRIVATE）、检测次数 + token 额度扣减、邀请奖励
- **登录方式**：邮箱验证码、邮箱密码、微信小程序（扫码登录 + 自动登录）
- **支付**：YunGouOS 微信nativePay 扫码支付 + 异步回调
- **基础设施**：JWT 鉴权、RBAC + 数据级权限、三档限流、Winston 日志轮转、定时任务

## 技术栈

| 维度 | 选型 |
|---|---|
| 框架 | NestJS 10（Fastify 适配器，非 Express） |
| ORM | Prisma 5（`prismaSchemaFolder` 多文件 schema，`relationMode = "prisma"` 无外键） |
| DB | MySQL 8 |
| 鉴权 | `@nestjs/jwt` + 自定义 Guard 链 |
| 验证 | `class-validator` + `class-transformer` |
| 日志 | `nest-winston` + `winston-daily-rotate-file` |
| 定时 | `@nestjs/schedule` |
| 文档 | `@nestjs/swagger`（OpenAPI） |
| AI SDK | `openai`（DeepSeek/Kimi 兼容）、`@baiducloud/qianfan`、`spark-nodejs` |
| 上传 | 七牛云 SDK |
| PDF | `puppeteer` + `pdf-parse` |

## 快速开始

### 环境要求

- Node.js 18+（`package.json` `engines.node` 已声明）
- Yarn 1.x
- MySQL 8（或通过 `docker-compose up -d nest-mysql` 启动）
- （可选）Docker，用于 `docker-compose` 部署

### 安装

```bash
yarn install
cp .env.example .env.development
# 按实际填写 .env.development 中的密钥
```

### 数据库初始化

```bash
yarn prisma:generate         # 生成 Prisma Client
yarn migrate:deploy          # 应用已有 migration
# 或开发期新建 migration:
# yarn migrate:dev --name your_migration_name
yarn prisma:seed             # 初始化 role 基础数据
```

### 启动

```bash
yarn start:dev               # 开发模式（热重载）
yarn start:prod              # 生产模式（NODE_ENV=production）
pm2 start pm2.config.js      # 集群部署
```

启动后访问 `http://localhost:<SERVER_PORT>/swagger-api` 查看 API 文档（`API_ENABLED_SWAGGER=True` 时）。

## 环境变量

参考 `.env.example`，分组说明：

| 分组 | 关键变量 | 说明 |
|---|---|---|
| 服务 | `SERVER_PORT` / `SERVER_HOST` / `API_PREFIX` / `API_ENABLED_SWAGGER` | 监听地址、路由前缀、Swagger 开关 |
| 鉴权 | `JWT_SECRET` / `JWT_AUTH_KEY` / `JWT_EXPIRES_IN` / `MD5_SALT` | JWT 与密码哈希盐 |
| 数据库 | `DATABASE_URL` / `DATABASE_LOG_LEVEL` | Prisma 数据源；日志级别逗号分隔 |
| 邮件 | `MAIL_SERVER_*` / `MAIL_USER_EMAIL` / `MAIL_AUTH_CODE` / `MAIL_FEEDBACK_TO` | SMTP 配置；反馈接收邮箱 |
| 上传 | `UPLOAD_QI_NIU_*` / `UPLOAD_HOST` / `UPLOAD_MAX_SIZE` | 七牛云 AK/SK、CDN 域名 |
| 微信小程序 | `MP_APP_ID` / `MP_APP_SECRET` | 扫码登录 |
| AI | `AI_DEEPSEEK_*` / `AI_KIMI_*` / `AI_BAIDU_*` / `AI_XF_*` | 4 家 LLM，按需启用，未启用的可不填 |
| 支付 | `PAY_MCH_ID` / `PAY_SIGN_KEY` | YunGouOS 商户号 + 签名密钥 |
| AES | `AES_KEY` / `AES_IV` | 简历分享授权码加密（16 字节） |
| 默认用户 | `DEFAULT_USER_AVATAR` / `DEFAULT_USER_PASSWORD` | 小程序新用户默认头像与密码 |
| 功能开关 | `EXPORT_PDF_VIP_CHECK_ENABLED` / `AI_CHECK_COUNT_ENABLED` / `AI_TOKENS_ENABLED` | 见下文 |

### 功能开关

3 个开关均为 `True`/`False` 字符串，关闭时跳过对应会员拦截：

| 开关 | 控制接口 | 拦截行为 |
|---|---|---|
| `EXPORT_PDF_VIP_CHECK_ENABLED` | `GET /resume/pdf/:id` | VIP 状态 + 过期检查 |
| `AI_CHECK_COUNT_ENABLED` | `SSE /ai/optimize/inspect` | `checkCount` 扣减 + 不足拦截 |
| `AI_TOKENS_ENABLED` | `SSE /ai/resume/chat` | `optTokens` 扣减 + 不足拦截 |

## 常用脚本

```bash
yarn build                # nest build
yarn build:prisma         # prisma generate + nest build
yarn lint                 # eslint --fix
yarn format               # prettier --write

yarn test                 # jest 单测
yarn test:watch
yarn test:cov
yarn test:e2e             # e2e（test/jest-e2e.json）
npx jest path/to/file.spec.ts         # 单文件
npx jest -t "test name"               # 单测用例

yarn prisma:studio        # Prisma Studio 可视化
yarn prisma:db:push       # 推送 schema 到 DB（不走 migration）
yarn prisma:db:pull       # 反向工程 DB -> schema
yarn prisma:doc           # 启动 Prisma 文档站点 :8099
```

## 架构说明

### 请求生命周期

```
请求 → LoggerMiddleware → JwtAuthGuard → RolesGuard → VipGuard → ThrottlerGuard
     → PostInterceptor → ResponseInterceptor → ClassSerializerInterceptor → TimeoutInterceptor(60s)
     → Controller
     → HttpExceptionFilter（异常一律 HTTP 200 + { code, message, success: false, data: null }）
```

**关键约定**：所有响应（包括错误）的 HTTP 状态码均为 200，业务状态在响应体 `code`/`success` 字段中。前端按 `success` 派发，不要按 HTTP 状态判断。

### 自定义配置模块

`src/modules/config/` 是项目自定义的动态模块（**非** `@nestjs/config`）：

- 直接用 `dotenv` 解析 `.env.${NODE_ENV}`
- 通过 `ConfigService.get(key)` 读取，键名在 `src/modules/config/interfaces.ts` 中强类型化
- 新增环境变量必须同步更新 `interfaces.ts`

### Prisma

- schema 按域拆分在 `prisma/schema/*.prisma`（`prismaSchemaFolder` preview 特性）
- `relationMode = "prisma"`：**数据库层无外键**，关系由 Prisma 在 JS 层维护
- `PrismaService` 注册 `$use` 中间件：
  - 自动设置 `updatedAt = new Date()` 于每次 `update`
  - `BigInt` 自动序列化为字符串（避免 `JSON.stringify` 报错）

### 鉴权与权限

| 装饰器 | 作用 | 守卫 |
|---|---|---|
| `@NotLogin()` | 跳过 JWT 必需（token 存在仍解析） | `JwtAuthGuard` |
| `@RequiredRoles(...RolesEnums)` | 系统级角色（USER/VIP/ADMIN/SUPER_ADMIN） | `RolesGuard` |
| `@RequiredVip()` | VIP 专属接口 | `VipGuard` |
| `@RequiredPermission(...PermissionEnums)` | 数据级操作（CREATE/READ/UPDATE/DELETE），需手动注册 | `PermissionGuard` |

`@User()` 装饰器从 `request.user` 提取 `{ id, username, avatar, email, roles }`。

### AI 模块

- 多 provider：`deepseek.service.ts`（主用）、`kimi.service.ts`、`bd.service.ts`、`xf.service.ts`
- 全部通过 `ConfigService` 注入 API key，未配置的 provider 不会影响应用启动
- SSE 流式接口：用 RxJS `Observable` 包装 SDK stream，监听 `Response.raw.on('close')` + `AbortController` 处理客户端断开
- VIP 额度（`checkCount` / `optTokens`）在 stream 消费前扣减，由 `AI_CHECK_COUNT_ENABLED` / `AI_TOKENS_ENABLED` 控制是否启用

### 支付流程

1. `POST /order/create-order`：下单 + 调 YunGouOS `nativePay` 拿支付二维码
2. 用户扫码支付
3. YunGouOS 回调 `POST /order/notice-callback`（`@NotLogin()`）：落库会员信息、续期、邀请奖励

### 路径别名

`@/*` → `src/*`（`tsconfig.json` paths 配置）。

## 模块结构

```
src/
├── main.ts                    # Fastify bootstrap
├── app.module.ts              # 全局模块注册
├── providers.ts               # APP_GUARD / APP_INTERCEPTOR / APP_FILTER 注册
├── constants/                 # 枚举、模板、缓存 key
├── decorator/                 # @NotLogin / @RequiredRoles / @RequiredVip / @User / @Api
├── guard/                     # JwtAuthGuard / RolesGuard / VipGuard / PermissionGuard / ThrottlerBehindProxyGuard
├── interceptor/              # Post / Response / ClassSerializer / Timeout
├── filter/                    # HttpExceptionFilter
├── middleware/                # LoggerMiddleware
├── schedule/                  # 定时任务（DB 备份示例）
├── utils/                     # 工具函数（AES、snowflake ID、Prisma 错误映射等）
└── modules/
    ├── ai/                    # AI provider 与 controller
    ├── auth/                  # 邮箱 + 微信小程序登录
    ├── config/                # 自定义 ConfigModule
    ├── email/                 # 邮件验证码
    ├── guide/                 # 引导
    ├── invite/                # 邀请码
    ├── order/                 # 订单 + 支付回调
    ├── propose/               # 用户反馈
    ├── prisma/                # PrismaService
    ├── puppeteer/             # PDF 渲染
    ├── resume/                # 简历核心
    ├── resume-group/          # 简历分组
    ├── roles/                 # 角色
    ├── template/              # 模板
    ├── upload/                # 七牛云上传
    ├── users/                 # 用户
    ├── vip/                   # 会员
    └── vip-type/              # 会员类型
```

## 文档与调试

- **Swagger**：`/swagger-api`（`API_ENABLED_SWAGGER=True`）
- **Prisma Studio**：`yarn prisma:studio`
- **Prisma 文档**：`yarn prisma:doc` → `http://localhost:8099`
- **日志**：`nestjs-logs/`（按日轮转，info 与 error 分离）

## 部署

```bash
# PM2 集群
yarn build:prisma
pm2 start pm2.config.js

# Docker
docker-compose up -d
```

`pm2.config.js` 默认 cluster 模式，按 CPU 核数启动实例，500MB 内存自动重启。

## 安全注意事项

- `.env.*` 已在 `.gitignore` 中忽略；切勿提交真实密钥
- 首次部署务必轮换 `.env.example` 中所有占位项对应的真实密钥
- `JWT_SECRET` / `MD5_SALT` / `AES_KEY` / `AES_IV` 一旦泄露需立即轮换；其中 `AES_KEY` 变更会导致已分发的简历授权码失效
- `relationMode = "prisma"` 下，删除父行不会级联删除子行，需手动处理
- AI provider 的 API key 一旦泄露会被盗刷额度，发现异常立即在对应平台禁用并轮换

## License

MIT
