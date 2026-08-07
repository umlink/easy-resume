# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS backend service for "Easy简历" (Easy Resume) - a resume builder with AI features, VIP membership, WeChat Mini Program login, and a payment/order flow. Uses **Fastify** (not Express) as the HTTP adapter.

## Commands

```bash
# Dev (regenerates Prisma client, then watches)
yarn start:dev

# Build / production
yarn build                # nest build
yarn build:prisma         # prisma generate + nest build
yarn start:prod           # NODE_ENV=production node dist/main
pm2 start pm2.config.js   # cluster mode production

# Lint / format
yarn lint                 # eslint --fix on src,apps,libs,test
yarn format               # prettier --write on src,test

# Tests (jest, rootDir=src, testRegex=*.spec.ts)
yarn test
yarn test:watch
yarn test:cov
yarn test:e2e             # uses test/jest-e2e.json
npx jest src/modules/users/users.service.spec.ts   # single file
npx jest -t "test name"                             # single test by name

# Prisma (all wired to .env.development via dotenv-cli)
yarn prisma:generate
yarn migrate:dev                    # create + apply migration
yarn migrate:dev:create             # create migration only (--create-only)
yarn migrate:deploy
yarn prisma:db:push                 # push schema, no migration history
yarn prisma:db:pull                 # introspect DB -> schema
yarn prisma:studio
yarn prisma:doc                     # serve prisma docs on :8099
yarn prisma:seed
```

Prisma schema lives in `prisma/schema/` (multiple `.prisma` files via the `prismaSchemaFolder` preview feature). The base config is in `schema.prisma`; models are split per domain (`user.prisma`, `resume.prisma`, `vip.prisma`, `order.prisma`, etc.). `relationMode = "prisma"` - **no foreign keys exist at the DB level**, relations are enforced by Prisma only.

## Architecture

### App bootstrap (`src/main.ts`, `src/app.module.ts`)
- `NestFastifyApplication` via `FastifyAdapter`. Registers `@fastify/multipart` (10MB upload limit), `@fastify/helmet`, `@fastify/csrf-protection`, CORS enabled.
- Global prefix from `API_PREFIX` env (default `/resume-api`).
- `ValidationPipe` globally: `whitelist: true, transform: true` - DTOs strip unknown fields and auto-convert types.
- Swagger UI at `/swagger-api` when `API_ENABLED_SWAGGER=True`. The OpenAPI doc is post-processed by `addResponseWrapper` (`src/utils/modules-utils.ts`) so every response is wrapped in `{ code, message, data, success }`.
- `ConfigModule.register({ folder: '' })` is a **custom** dynamic module (`src/modules/config/`) - NOT `@nestjs/config`. It parses `.env.${NODE_ENV}` directly with `dotenv`. Access via `configService.get('KEY')`; keys are typed in `src/modules/config/interfaces.ts` (`EnvConfig`). Add new env vars there.

### Global pipeline (`src/providers.ts`)
Registered as `APP_GUARD`, `APP_INTERCEPTOR`, `APP_FILTER` providers - order matters:

1. **Guards** (run in order):
   - `JwtAuthGuard` - verifies JWT from `request.headers[JWT_AUTH_KEY]`. Routes default to **required auth**; opt out with `@NotLogin()`. When `@NotLogin()` is set and a token is present, it still tries to parse and attach `request.user`.
   - `RolesGuard` - checks `@RequiredRoles(...RolesEnums)` against `user.roles`.
   - `VipGuard` - checks `@RequiredVip()` against `request.user.isVip` (set by AuthService when signing JWT).
   - `ThrottlerGuard` + `ThrottlerBehindProxyGuard` - three tiers (`short`/`medium`/`long`) configured in `app.module.ts`. The behind-proxy variant pulls the tracker from `req.ips[0]` (respects `X-Forwarded-For`).

2. **Interceptors**:
   - `PostInterceptor` - forces POST responses to status 200 (instead of 201).
   - `ResponseInterceptor` - wraps controller return values into `{ code, message, data, success }`. Logs each response via Winston.
   - `ClassSerializerInterceptor` - applies `@Exclude()`/`@Expose()` class-transformer decorators.
   - `TimeoutInterceptor` - **60s** hard timeout. (Note: upload routes need separate handling.)

3. **Filter**:
   - `HttpExceptionFilter` - catches `HttpException`, returns HTTP 200 with `{ code, message, success: false, data: null, timestamp }`. **All errors are returned with status 200** - the `code` field carries the real HTTP status. Frontend dispatches on `success`/`code`, not on HTTP status.

### Decorators (`src/decorator/`)
- `@NotLogin()` - skip JWT requirement (token still parsed if present).
- `@RequiredRoles(...)` - system-level role gate (`RolesEnums`: User, Vip, Admin, SuperAdmin).
- `@RequiredPermission(...)` - fine-grained op gate (`PermissionEnums`: CREATE/READ/UPDATE/DELETE); enforced by `PermissionGuard` (not registered globally - apply manually where needed).
- `@RequiredVip()` - requires `user.isVip`.
- `@User()` - `createParamDecorator` extracting `request.user` as `AuthUser` (`{ id, username, avatar, email, roles }`).
- `@Api({ summary, reqType, resType, reqIsArray, resIsArray })` - composes `ApiOperation` + `ApiBody` + `ApiResponse` for Swagger.

### Prisma (`src/modules/prisma/`)
- `PrismaService extends PrismaClient`, registered `@Global()`. Inject anywhere with `@Inject(PrismaService)` or constructor.
- A `$use` middleware does two things: (1) auto-set `updatedAt = new Date()` on every `update`, (2) **serializes BigInt to string** in results (`bigIntSerialize`). DB IDs are `BigInt` - JSON.stringify without this middleware would throw.
- `DATABASE_LOG_LEVEL` env is a comma-separated list of Prisma log levels (`query,info,warn,error`).

### Modules (`src/modules/`)
Domain modules follow `controller.ts` / `service.ts` / `*.module.ts` / `dto/` / `vo/` layout. Notable ones:

- **`ai/`** - AI features. Multiple providers (`deepseek.service.ts`, `kimi.service.ts`, `xf.service.ts` (iFlytek), `bd.service.ts` (Baidu)) wrap different LLM SDKs. `AiService` persists chat tasks to a `aiTask` Prisma table. SSE streaming endpoints (`@Sse`) wrap `openai`-style stream responses in RxJS `Observable`s; client disconnects are caught via `Response.raw.on('close')` + `AbortController.abort()`. VIP token/check-count deductions happen inside the stream lifecycle (`vipService.subTokens` / `subCheckCount`).
- **`auth/`** - Email-code/password login, WeChat Mini Program login (`getMpQrCode`, `autoLoginByMpCode`, `getMpAuthInfo`). New MP users get a free GIFT VIP type and (if invite code present) the inviter gets bonus VIP days. JWT is signed with the full user payload including `isVip`.
- **`users/`**, **`resume/`**, **`resume-group/`**, **`template/`** - core resume domain. Resumes store content as a JSON blob matching `RESUME_NULL_TEMPLATE` (`src/constants/template.ts`).
- **`vip/`** + **`vip-type/`** - VIP membership with token/check-count consumption; `vip_type_sell_type` enum (`SELL`/`GIFT`/`PRIVATE`).
- **`order/`** - WeChat Pay orders (`PAY_TYPE.WX_PAY`, `ORDER_STATUS` enum).
- **`invite/`** - invite codes; both inviter and invitee get VIP rewards.
- **`email/`** - nodemailer-based, used for login codes.
- **`upload/`** - Qiniu Cloud (`qiniu` SDK) uploads; `UPLOAD_HOST` is the CDN origin.
- **`puppeteer/`** - server-side PDF/HTML rendering.
- **`propose/`**, **`guide/`** - feedback and onboarding guides.

### ID generation
`src/utils/id.gen.ts` exports `genSnowUUId()` - Snowflake ID via `simple-flakeid` (15-digit number). Used for `aiTask.id` and any ID assigned client-side.

### Logging
`nest-winston` with `winston-daily-rotate-file`. Two file transports (info + error) under `LOG_PATH` (default `nestjs-logs/`), plus a console transport in development only. `LoggerMiddleware` (`src/middleware/logger.middleware.ts`) logs every incoming request via Winston; registered globally in `AppModule.configure`.

### Scheduled tasks
`@nestjs/schedule` is enabled. `TaskDemoService` (`src/schedule/`) runs a daily 1am DB backup (mysqldump) - currently disabled, used as a template.

### Path alias
`@/*` -> `src/*` (configured in `tsconfig.json`). Use this consistently instead of relative imports.

### CORS / proxy assumptions
CSRF protection is enabled via `@fastify/csrf-protection`. `ThrottlerBehindProxyGuard` assumes the app runs behind a proxy that sets `X-Forwarded-For` - `req.ips` is trusted.

## Conventions

- Controllers use the `@Api({ summary, reqType, resType })` decorator instead of bare `@ApiOperation`/`@ApiBody`/`@ApiResponse`.
- DTOs in `dto/`, VOs (response shapes) in `vo/`. VOs use class-transformer decorators (`@Expose`, `@Exclude`) consumed by the global `ClassSerializerInterceptor`.
- Prisma error handling: use `errorHandler` from `src/utils/prisma-utils` in `.catch()` to map `PrismaEnum` error codes (`P2025` NoData, `P2002` Unique, `P2000` TooLong) to NestJS exceptions.
- Date handling: `dayjs` (not Moment). Auto-set `updatedAt` on Prisma updates is handled by the middleware - do not set it manually.
- BigInt IDs: never `JSON.stringify` Prisma results directly outside PrismaService; the middleware handles string conversion.
- Env access: always go through `ConfigService.get(key)` (typed via `EnvConfig`). Do not use `process.env` directly in modules - update `src/config/interfaces.ts` when adding keys.

## Env files

- `.env.development` - used by `yarn start:dev`, all `yarn prisma:*` / `yarn migrate:*` scripts (via `dotenv -e .env.development`).
- `.env.production` - used by `start:prod` / `start`.
- Both contain real secrets (DB password, JWT secret, Qiniu keys, WeChat MP secret, mail auth code). Treat as sensitive; do not commit new secrets without checking `.gitignore`.

## Tech notes / gotchas

- The repo does **not** use `@nestjs/config` - `ConfigService` here is custom. Do not confuse the two.
- `relationMode = "prisma"` means cascades and referential actions happen in JS, not SQL. Be careful with `delete` on parent rows - children won't auto-cascade at the DB level.
- All HTTP responses return status 200 (even errors). Do not introduce a guard/filter that returns non-200 without a strong reason - the frontend expects to dispatch on the `success`/`code` body fields.
- `ValidationPipe` uses `whitelist: true` - any field not in the DTO is silently dropped. Add fields to DTOs before relying on them in handlers.
- POST requests are normalized to status 200 by `PostInterceptor`. Don't write controllers that depend on returning 201.
- The 60s `TimeoutInterceptor` is global - long-running AI streams bypass it because they return an `Observable` (SSE) before the body resolves, but synchronous `await`-heavy endpoints (e.g. PDF generation) need to be aware.
- AI service files (`bd.service.ts`, `xf.service.ts`, `kimi.service.ts`, `deepseek.service.ts`) currently hard-code API keys in the constructor. This is a known smell - do not propagate the pattern to new providers; prefer `ConfigService.get`.
