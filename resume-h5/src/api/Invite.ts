// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取我的邀请码 GET /resume-api/invite/code */
export async function getInviteCode(options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/invite/code', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 生成邀请码 POST /resume-api/invite/generate-code */
export async function generateInviteCode(options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/invite/generate-code', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 获取我的邀请记录 GET /resume-api/invite/record-list */
export async function getMyInviteRecord(options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/invite/record-list', {
    method: 'GET',
    ...(options || {}),
  });
}
