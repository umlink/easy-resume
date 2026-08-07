// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 发送邮箱验证码 POST /resume-api/email/send-code */
export async function sendEmailCode(body: API.SendMailCodeDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/email/send-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
