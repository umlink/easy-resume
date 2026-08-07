// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建会员类型 POST /resume-api/vip-type/create */
export async function createVipType(body: API.CreateVipTypeDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/vip-type/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取所有会员类型-只返回售卖类型 GET /resume-api/vip-type/list */
export async function getVipTypeList(options?: { [key: string]: any }) {
  return request<API.Response & { data: API.VipTypeItemVo[] }>('/resume-api/vip-type/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新会员类型 POST /resume-api/vip-type/update/${param0} */
export async function updateVipType(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateVipTypeParams,
  body: API.UpdateVipTypeDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data: string }>(`/resume-api/vip-type/update/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
