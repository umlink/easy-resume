import { createCipheriv, createDecipheriv } from 'crypto';
import dayjs from 'dayjs';

const inEncode = 'utf8';
const outEncode = 'base64';

// aes-128-cbc: key 与 iv 均为 16 字节，由调用方从 ConfigService 注入
export const aesEncrypt = (data: string, key: string, iv: string) => {
  const cipher = createCipheriv('aes-128-cbc', key, iv);
  let crypto = cipher.update(data, inEncode, outEncode);
  crypto += cipher.final(outEncode);
  return crypto;
};

export const aesDecrypt = (data: string, key: string, iv: string) => {
  const encrypted = Buffer.from(data, outEncode).toString(outEncode);
  const decipher = createDecipheriv('aes-128-cbc', key, iv);
  let decrypted = decipher.update(encrypted, outEncode, inEncode);
  decrypted += decipher.final(inEncode);
  return decrypted;
};

// 已经是会员，则进行续期,非会员从当前时间开始算起
export const computeExpireTime = (vipInfo: { expireTime: Date }) => {
  let startExpireTime = dayjs();
  if (vipInfo?.expireTime && dayjs(vipInfo.expireTime).isAfter(dayjs())) {
    startExpireTime = dayjs(vipInfo.expireTime);
  }
  return startExpireTime;
};
