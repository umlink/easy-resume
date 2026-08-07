// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 生成邀请码 POST /resume-api/vip */
export async function generateInviteCode(options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/vip', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取我的会员信息 GET /resume-api/vip/info */
export async function getVipInfo(options?: { [key: string]: any }) {
  return request<API.Response & { data: API.VipInfoVO }>('/resume-api/vip/info', {
    method: 'GET',
    ...(options || {}),
  });
}
