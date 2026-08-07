// https://open.pay.yungouos.com/#/callback/notify
export class CallbackOrderDto {
  code: string; // 支付结果 【1：成功；0：失败】
  orderNo: string; // 系统订单号（YunGouOS系统内单号）
  outTradeNo: string; // 商户订单号;
  payNo: string; // 支付单号（第三方支付单号）
  money: string;
  mchId: string; // 支付商户号
  payChannel: string; // 支付渠道（枚举值 wxpay、alipay）
  time: string; // 支付成功时间
  attach: string; // 附加数据
  openId: string; // 用户 openId
  payBank: string; // 支付来源
  sign: string; // 签名密钥
}
