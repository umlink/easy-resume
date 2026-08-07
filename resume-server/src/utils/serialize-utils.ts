export const prismaBigintSerialize = (obj) => {
  if (typeof obj === 'bigint') {
    return parseInt(`${obj}`); // 将BigInt值转换为字符串，'n'作为标记表示这是一个BigInt
  } else if (typeof obj === 'object' && obj !== null) {
    return JSON.parse(
      JSON.stringify(obj, (key, value) => {
        if (typeof value === 'bigint') {
          return parseInt(`${value}`);
        }
        return value;
      }),
    );
  }
  return obj; // 对于非对象类型，直接返回
};
