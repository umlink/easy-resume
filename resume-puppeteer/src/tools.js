const crypto = require("crypto");
const qiniu = require("qiniu");

// 启动时校验环境变量，缺失立即报错
const AES_KEY = process.env.AES_KEY;
const AES_IV = process.env.AES_IV;
if (!AES_KEY || !AES_IV) {
  throw new Error(
    "AES_KEY / AES_IV 环境变量缺失，请在 .env 中配置（须与 resume-server 端一致，16 字节）"
  );
}

const inEncode = "utf8";
const outEncode = "base64";
// The key length is dependent on the algorithm.
// In this case for aes256, it is 32 bytes.
const aesEncrypt = (data) => {
  const cipher = crypto.createCipheriv("aes-128-cbc", AES_KEY, AES_IV);
  let crypto = cipher.update(data, inEncode, outEncode);
  crypto += cipher.final(outEncode);
  return crypto;
};

const aesDecrypt = (data) => {
  const encrypted = Buffer.from(data, outEncode).toString(outEncode);
  const decipher = crypto.createDecipheriv("aes-128-cbc", AES_KEY, AES_IV);
  let decrypted = decipher.update(encrypted, outEncode, inEncode);
  decrypted += decipher.final(inEncode);
  return decrypted;
};

const accessKey = process.env.QINIU_ACCESS_KEY;
const secretKey = process.env.QINIU_SECRET_KEY;
const bucket = process.env.QINIU_BUCKET || "fresume";
if (!accessKey || !secretKey) {
  throw new Error(
    "QINIU_ACCESS_KEY / QINIU_SECRET_KEY 环境变量缺失，请在 .env 中配置"
  );
}
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

async function uploadPDFToQiNiuOSS(src, key, fname) {
  try {
    let options = {
      scope: `${bucket}:resume-pdf/${key}`,
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);

    let config = new qiniu.conf.Config();
    // 是否使用https域名
    config.useHttpsDomain = true;
    let localFile = src;
    let formUploader = new qiniu.form_up.FormUploader(config);
    let putExtra = new qiniu.form_up.PutExtra();
    putExtra.fname = fname;
    // 文件上传
    return await formUploader
      .putFile(
        uploadToken,
        `resume-pdf/${key}`,
        localFile,
        putExtra,
        function (respErr, respBody, respInfo) {
          if (respErr) {
            return Promise.reject(respErr);
          }
          if (respInfo.statusCode === 200) {
            return Promise.resolve(respInfo);
          } else {
            return Promise.reject(respBody);
          }
        },
      )
      .catch((e) => {
        console.log(e);
      });
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports = { aesEncrypt, aesDecrypt, uploadPDFToQiNiuOSS };
