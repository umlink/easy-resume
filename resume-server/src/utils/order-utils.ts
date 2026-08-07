import { Md5 } from 'ts-md5';

export const PaySignUtil = (params: Record<string, any>, key: string) => {
  const paramsArr = Object.keys(params);
  paramsArr.sort();
  const stringArr = [];
  paramsArr.map((key) => {
    stringArr.push(key + '=' + params[key]);
  });
  // 最后加上 商户Key
  stringArr.push('key=' + key);
  const string = stringArr.join('&');
  return Md5.hashStr(string).toString().toUpperCase();
};
