// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建提议 POST /resume-api/propose/create */
export async function createPropose(body: API.CreateProposeDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/propose/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
