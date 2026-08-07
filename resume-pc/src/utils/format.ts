// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

// 只做学习，不要使用
export const dateFormatPast = (date: any, type: string = 'default', zeroFillFlag: boolean = true) => {
  // 定义countTime变量，用于存储计算后的数据
  let countTime: any;
  // 获取当前时间戳
  let time = new Date().getTime();
  // 转换传入参数为时间戳
  let afferentTime = new Date(date).getTime();
  // 当前时间戳 - 传入时间戳
  time = Number.parseInt(`${time - afferentTime}`);
  let typeList = ['default', '-', '/', '.', '年月日', '月日', '年'];
  if (time < 0 || (typeof time === 'number' && isNaN(time)) || !date) {
    // 时间参数存在问题 此处alert仅做错误示例，实际应用以场景需求为准
    return alert(
      '请查看时间参数是否满足规则:\n1、时间参数为必填参数且为过去时间 \n2、时间参数不合法(参考date参数规则)',
    );
  } else if ((zeroFillFlag && typeof zeroFillFlag !== 'boolean') || (type && !typeList.includes(type))) {
    // 补零参数或格式参数存在问题 此处alert仅做错误示例，实际应用以场景需求为准
    return alert(
      '请查看补零参数/格式参数是否满足规则：\n1、补零参数为布尔值类型 \n2、格式参数不合法(参考type参数规则)',
    );
  } else if (time < 10000) {
    // 10秒内
    return '刚刚';
  } else if (time < 60000) {
    // 超过10秒少于1分钟内
    countTime = Math.floor(time / 1000);
    return `${countTime}秒前`;
  } else if (time < 3600000) {
    // 超过1分钟少于1小时
    countTime = Math.floor(time / 60000);
    return `${countTime}分钟前`;
  } else if (time < 86400000) {
    // 超过1小时少于24小时
    countTime = Math.floor(time / 3600000);
    return `${countTime}小时前`;
  } else if (time >= 86400000 && type === 'default') {
    // 超过二十四小时（一天）且格式参数为默认"default"
    countTime = Math.floor(time / 86400000);
    //大于等于365天
    // if (countTime >= 365) {
    //   return `${Math.floor(countTime / 365)}年前`;
    // }
    //大于等于30天
    if (countTime >= 30) {
      return `${Math.floor(countTime / 30)}个月前`;
    }
    return `${countTime}天前`;
  } else {
    // 一天（24小时）以上且格式不为"default"则按传入格式参数显示不同格式
    // 数字补零
    let Y = new Date(date).getFullYear();
    let M = new Date(date).getMonth() + 1;
    let zeroFillM = M > 9 ? M : '0' + M;
    let D = new Date(date).getDate();
    let zeroFillD = D > 9 ? D : '0' + D;
    // 传入格式为"-" "/" "."
    if (type === '-' || type === '/' || type === '.') {
      return zeroFillFlag ? Y + type + zeroFillM + type + zeroFillD : Y + type + M + type + D;
    }
    // 传入格式为"年月日"
    if (type === '年月日') {
      return zeroFillFlag
        ? Y + type[0] + zeroFillM + type[1] + zeroFillD + type[2]
        : Y + type[0] + M + type[1] + D + type[2];
    }
    // 传入格式为"月日"
    if (type === '月日') {
      return zeroFillFlag ? zeroFillM + type[0] + zeroFillD + type[1] : M + type[0] + D + type[1];
    }
    // 传入格式为"年"
    if (type === '年') {
      return Y + type;
    }
  }
  return countTime;
};
