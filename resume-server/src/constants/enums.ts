export enum RolesEnums {
  User = 'USER',
  Vip = 'VIP',
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
}

/**
 * 其它更细粒度的权限控制
 */
export enum PermissionEnums {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

/**
 * https://prisma.nodejs.cn/orm/reference/error-reference#%E9%94%99%E8%AF%AF%E4%BB%A3%E7%A0%81
 * 处理错误码
 */
export enum PrismaEnum {
  NoData = 'P2025',
  Unique = 'P2002',
  TooLong = 'P2000',
}

export enum SellTypeEnum {
  SELL = 'SELL',
  GIFT = 'GIFT',
  PRIVATE = 'PRIVATE',
}

// 订单状态枚举
export enum ORDER_STATUS {
  NO_PAY, // 未支付
  PAID, // 已支付
  TIMEOUT, // 支付超时
  REFUND, // 已退款
}

// 订单支付类型枚举
export enum PAY_TYPE {
  WX_PAY = 'wxpay',
}
