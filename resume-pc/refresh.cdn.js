const qiniu = require('qiniu');

// 七牛凭证从环境变量读取（参考 .env.example 中的 QINIU_AK / QINIU_SK）
const accessKey = process.env.QINIU_AK;
const secretKey = process.env.QINIU_SK;
if (!accessKey || !secretKey) {
  throw new Error('QINIU_AK / QINIU_SK 环境变量缺失，请在 .env 中配置');
}
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// CDN host 与资源前缀，从环境变量拼装，避免硬编码生产域名
const cdnHost = process.env.CDN_HOST || 'https://static.example.com';
const cdnPrefix = process.env.CDN_PREFIX || 'resume/';
const prefix = `${cdnHost}/${cdnPrefix}`;

const urlsToRefresh = [
  `${prefix}umi.js`,
  `${prefix}umi.js.gz`,
  `${prefix}umi.css`,
  `${prefix}umi.css.gz`,
];

async function refresh() {
  try {
    let cdnManager = new qiniu.cdn.CdnManager(mac);
    cdnManager.refreshUrls(urlsToRefresh, (err, resBody, respInfo) => {
      console.log(err);
      console.log(respInfo);
    });
  } catch (err) {
    console.log('刷新CDN失败', err);
  }
}

refresh();
