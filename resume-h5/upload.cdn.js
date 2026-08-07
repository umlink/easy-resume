const qiniu = require('qiniu');
const fs = require('fs');
const path = require('path');
const PUBLIC_PATH = path.join(__dirname, '/');

// 上传凭证
let accessKey = 'th-D-xxxxx';
let secretKey = 'xxxxxxxxxxxxxxxxxxxx';
let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const cdnPrefix = 'resume-h5/';

/**
 * 遍历文件夹递归上传
 * @param {path} src 本地路径
 * @param {string} dist oos文件夹名
 * @param {boolean} dir 是否为文件夹下文件
 */
async function addFileToOSSSync(src, dist, dir) {
  console.log('dist:', dist);
  let docs = fs.readdirSync(src);
  docs.forEach(function (doc) {
    let _src = src + '/' + doc,
      _dist = dist + '/' + doc;
    let st = fs.statSync(_src);
    // 判断是否为文件
    if (st.isFile() && dist !== 'LICENSES`') {
      const d = dir ? `${dir}/${doc}` : doc;
      putOSS(_src, cdnPrefix + d);
    }
    // 如果是目录则递归调用自身
    else if (st.isDirectory()) {
      addFileToOSSSync(_src, _dist, doc);
    }
  });
}

/**
 *单个文件上传至oss 覆盖上传
 */
async function putOSS(src, dist) {
  try {
    let options = {
      scope: `fresume:${dist}`,
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);

    let config = new qiniu.conf.Config();
    // 是否使用https域名
    config.useHttpsDomain = true;
    // 上传是否使用cdn加速
    config.useCdnDomain = true;
    let localFile = src;
    let formUploader = new qiniu.form_up.FormUploader(config);
    let putExtra = new qiniu.form_up.PutExtra();
    let key = dist;
    // 文件上传
    await formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode === 200) {
        console.log(key + '上传oss成功');
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
    });
  } catch (e) {
    console.log('上传失败'.e);
  }
}

/**
 *上传文件启动
 */

async function upFile() {
  try {
    let src = PUBLIC_PATH + '/dist';
    console.log(src);
    let docs = fs.readdirSync(src);
    await addFileToOSSSync(src, docs);
  } catch (err) {
    console.log('上传oss失败', err);
  }
}

upFile();
