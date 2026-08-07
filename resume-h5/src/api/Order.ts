// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 生成会员订单 POST /resume-api/order/create-order */
export async function createVipOrder(body: API.CreateOrderDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: API.CreateOrderVO }>('/resume-api/order/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 支付结果回调 POST /resume-api/order/notice-callback */
export async function noticeCallback(options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/order/notice-callback', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 查询订单状态 GET /resume-api/order/status/${param0} */
export async function searchOrderStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchOrderStatusParams,
  options?: { [key: string]: any },
) {
  const { orderId: param0, ...queryParams } = params;
  return request<API.Response & { data: string }>(`/resume-api/order/status/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
