# Resume Puppeteer

基于 **Koa 2 + Puppeteer** 的网页 PDF 生成服务，是 [easy-resume](../) 简历系统的渲染引擎。

通过 headless Chromium 将简历预览页渲染为 A4 规格 PDF，可选择直出二进制流或上传至七牛 OSS 后返回 CDN 地址。内置 Puppeteer 实例池复用浏览器进程，降低启动开销，支持高并发渲染。

> 本仓库为开源脱敏版本，密钥应迁移到环境变量（见 [安全提示](#安全提示)）。

---

## 特性

- **实例池复用**：基于 `generic-pool` 维护 Puppeteer 实例，单实例最大复用 2048 次，空闲 60 分钟自动回收
- **三种产出模式**：通用 PDF 直出、简历 PDF 直出、简历 PDF + OSS 上传
- **参数加密**：通过 AES-128-CBC 加密 `authCode` 传递 `resumeId`、`token`、`margin`，避免 URL 明文暴露凭证
- **鉴权注入**：支持 Cookie 注入（通用）与 `Authorization` Header 注入（简历）两种模式
- **集群部署**：PM2 cluster 模式，按 CPU 数实例化进程，单进程内存超 800M 自动重启
- **后台渲染**：注入鉴权后访问 `?print=1` 预览页，等待 `networkidle0` 触发打印

---

## 技术栈

| 维度 | 选型 |
|---|---|
| HTTP 框架 | Koa 2 + koa-router + koa-json |
| 渲染引擎 | Puppeteer 11（headless Chromium） |
| 实例池 | generic-pool 3 |
| 对象存储 | qiniu SDK（七牛云 OSS） |
| 加密 | Node `crypto`（AES-128-CBC） |
| HTTP 客户端 | axios |
| 进程管理 | PM2（cluster 模式） |
| 运行时 | Node.js 14+ |

---

## 目录结构

```
resume-puppeteer/
├── src/
│   ├── index.js          # Koa 入口 + 3 个路由，监听 8090
│   ├── poolUtils.js      # Puppeteer 实例池 + genPDF/genWktPDF/genIMG
│   └── tools.js          # AES 加解密 + 七牛云上传
├── tmp/                  # PDF 临时文件目录（上传后自动清理）
├── pm2.config.js         # PM2 集群配置
└── package.json
```

---

## 接口

所有接口均为 `GET`，监听端口 `8090`。

### 1. 通用 PDF 生成

将任意 URL 渲染为 PDF，通过 Cookie 注入鉴权 token，直接返回 PDF 二进制流。

```
GET /file-api/dps/create-pdf?fileName=&token=&url=
```

**Query 参数**

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `fileName` | string | 是 | 下载文件名（中文会做 GBK 编码处理） |
| `token` | string | 是 | 写入 Cookie `__dp_tk__` 的鉴权 token |
| `url` | string | 是 | 目标页面地址 |

**响应**

- 成功：`Content-Type: application/pdf`，body 为 PDF 二进制流，`Content-Disposition: attachment;filename=xxx.pdf`
- 失败：`{ code: 0, data: '', message: '...' }`

**示例**

```bash
curl -G 'http://localhost:8090/file-api/dps/create-pdf' \
  --data-urlencode 'fileName=我的文件' \
  --data-urlencode 'token=xxx' \
  --data-urlencode 'url=https://example.com/page' \
  -o output.pdf
```

---

### 2. 简历 PDF（直出流）

通过 AES 加密的 `authCode` 解密出 `{ resumeId, token, margin }`，渲染简历预览页（`/preview/:resumeId?print=1`），直接返回 PDF buffer。

```
GET /resume-api/puppeteer/pdf?authCode=
```

**`authCode` 明文 JSON 结构**

```json
{
  "resumeId": "xxx",
  "token": "xxx",
  "margin": { "top": 0, "bottom": 0, "left": 0, "right": 0 }
}
```

**渲染细节**

- 客户端 host：dev=`http://localhost:8000`，prod=`https://www.wktline.com`
- 注入方式：`page.setExtraHTTPHeaders({ authorization: token })`
- 等待策略：`waitUntil: 'networkidle0'`，渲染前 `waitTime: 10ms`
- PDF 参数：`format: A4`、`printBackground: true`、`margin` 来自 `authCode.margin`

**响应**

- 成功：PDF 二进制流
- 失败：`{ code: 0, data: '', message: '未知异常，请重试' }`

---

### 3. 简历 PDF（上传 OSS）

渲染流程同上，渲染完成后将 PDF 上传至七牛云 OSS bucket `fresume` 的 `resume-pdf/` 目录，删除本地临时文件，返回 CDN 访问地址。

```
GET /resume-api/puppeteer/pdf-new?authCode=
```

**响应**

```json
{
  "code": 0,
  "data": "https://static.wktline.com/resume-pdf/wktline{resumeId}.pdf",
  "message": "success",
  "success": true
}
```

**上传细节**

- 本地临时文件：`tmp/{resumeId}.pdf`（上传后自动 `fs.unlink`）
- OSS key：`resume-pdf/wktline{resumeId}.pdf`
- 自定义文件名：`简历中文名.pdf`（七牛云 `PutExtra.fname`）
- 访问域名：`https://static.wktline.com/resume-pdf/`

---

## 渲染流程

```
请求 /resume-api/puppeteer/pdf-new
        │
        ▼
 AES 解密 authCode  ->  拼装预览页 URL
        │
        ▼
 从实例池获取 Puppeteer 实例（acquire）
        │
        ▼
 newPage -> 注入 authorization Header
        │
        ▼
 goto(url, waitUntil: 'networkidle0')
        │
        ▼
 page.pdf({ format: 'A4', printBackground: true, margin })
        │
        ▼
 写入 tmp/ -> 上传七牛 -> 删除本地 -> 返回 CDN URL
        │
        ▼
 release 实例回池
```

---

## 安装与运行

### 环境依赖

- **Node.js 14+**
- **Chromium / Chrome**（系统级安装）
  - CentOS 7.6：`yum install chromium`
  - Ubuntu：`apt-get install chromium-browser`
  - macOS：Puppeteer 自带的 Chromium 即可，或安装 Google Chrome
- **Yarn 1.x**

### 本地开发

```bash
yarn install
yarn dev                 # NODE_ENV=development node src/index.js
```

开发模式下，渲染目标地址指向 `http://localhost:8000`；生产模式指向 `https://www.wktline.com`。

### 生产部署

```bash
yarn install --production
pm2 start pm2.config.js
pm2 logs pdf-genServer
pm2 reload pdf-genServer      # 零停机重启
```

`pm2.config.js` 关键配置：

| 字段 | 值 | 说明 |
|---|---|---|
| `name` | `pdf-genServer` | PM2 进程名 |
| `script` | `src/index.js` | 入口文件 |
| `exec_mode` | `cluster` | 集群模式 |
| `instances` | `2` | 进程数，按机器 CPU 调整 |
| `max_memory_restart` | `800M` | 内存超限自动重启 |

---

## 配置说明

> 当前 `src/tools.js` 中仍硬编码了 AES key/iv 与七牛 AK/SK，属历史遗留。生产环境务必通过环境变量注入并轮换占位密钥。

| 配置项 | 当前位置 | 说明 |
|---|---|---|
| AES key / iv | `src/tools.js` | 解密 `authCode` 用，需与 `resume-server` 加密端一致（16 字节） |
| 七牛 AK / SK | `src/tools.js` | OSS 上传凭证，建议迁移到 `QINIU_ACCESS_KEY` / `QINIU_SECRET_KEY` |
| 七牛 bucket | `src/tools.js` | 默认 `fresume`，scope 为 `fresume:resume-pdf/` |
| 客户端 host | `src/index.js` | dev=`localhost:8000`，prod=`www.wktline.com` |
| 监听端口 | `src/index.js` | 默认 `8090` |
| 浏览器池大小 | `src/poolUtils.js` | `max: 2, min: 2`，按机器内存调整 |

### Puppeteer 启动参数

为兼容 CentOS 等无 GPU 环境已开启：

```
--no-sandbox --disable-setuid-sandbox --disable-gpu
--disable-dev-shm-usage --single-process --no-zygote
--disable-extensions --disable-popup-blocking
--enable-features=NetworkService
```

> `--single-process` 在部分 Linux 内核上稳定性较差，如遇偶发崩溃可移除该参数。

---

## 性能调优

| 调优点 | 建议值 | 说明 |
|---|---|---|
| `pool.max` / `pool.min` | 2~4 | 每实例约 150~300MB 内存，按机器容量调整 |
| `maxUses` | 2048 | 防止长期运行的内存泄漏，达到阈值后销毁重建 |
| `idleTimeoutMillis` | 3600000 | 1 小时无请求则回收空闲实例 |
| `evictionRunIntervalMillis` | 180000 | 每 3 分钟检查一次实例状态 |
| PM2 `instances` | 2 | 与 `pool.max` 配合，总并发 = `instances × pool.max` |
| `waitUntil` | `networkidle0` | 500ms 内无网络请求才触发打印，确保字体/图片加载完成 |

**典型耗时**（A4 单页简历，参考值）

- 首次渲染（冷启动）：~3s
- 池内复用：~1.2s
- 上传七牛云：~600ms

---

## 与 resume-server 的协作

1. `resume-server` 调用 `/resume-api/puppeteer/pdf-new` 前，先用 AES-128-CBC 加密 `{ resumeId, token, margin }` 得到 `authCode`
2. 用户触发导出时，`resume-server` 内部转发到 `resume-puppeteer`
3. `resume-puppeteer` 解密 `authCode`，渲染简历预览页（带 `authorization` header）
4. 渲染完成上传七牛云，返回 CDN 链接给 `resume-server`
5. `resume-server` 将 CDN 链接返回给前端

> AES key/iv 必须两端一致；建议抽取为独立 npm 包或共享配置，避免硬编码漂移。

---

## 安全提示

- **密钥不要硬编码**：`src/tools.js` 中的 AES key/iv、七牛 AK/SK 必须迁移到环境变量，并确保 `.gitignore` 已忽略 `.env*`
- **AES key 一旦变更**：所有已分发的简历授权码（`authCode`）将立即失效，需与 `resume-server` 同步轮换
- **七牛 AK/SK 一旦泄露**：在七牛控制台立即禁用并轮换；OSS bucket 建议开启防盗链
- **`authCode` 是短期凭证**：内含用户 token，过期时间由 `resume-server` 签发时控制，不要写入日志
- **`--no-sandbox` 风险**：仅在受信任的内网/隔离环境运行；公网暴露时建议改用 `--disable-setuid-sandbox` 并以非 root 用户启动
- **URL 校验**：`/file-api/dps/create-pdf` 当前未校验 `url` 参数来源，存在 SSRF 风险，建议增加白名单校验

---

## 相关仓库

- [`resume-pc`](../resume-pc) - PC 端简历编辑器
- [`resume-h5`](../resume-h5) - 移动端简历
- [`resume-mp`](../resume-mp) - 小程序端
- [`resume-server`](../resume-server) - 主业务后端（NestJS）

---

## License

MIT
