// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取用户详情 GET /resume-api/user/info */
export async function getUserInfo(options?: { [key: string]: any }) {
  return request<API.Response & { data: API.UserBaseInfoVO }>('/resume-api/user/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新用户详情 POST /resume-api/user/info/update */
export async function editUserInfo(body: API.UpdateUserDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/user/info/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
