// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 邮箱验证码登录/注册 POST /resume-api/auth/email-code */
export async function emailCodeLogin(body: API.EmailCodeLoginDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: API.LoginResVo }>('/resume-api/auth/email-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 邮箱密码登录 POST /resume-api/auth/email-pwd */
export async function emailPwdLogin(body: API.EmailPwdLoginDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: API.LoginResVo }>('/resume-api/auth/email-pwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改邮箱登录密码 POST /resume-api/auth/reset/email-pwd */
export async function resetEmailPwd(body: API.ResetEmailPwdDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: API.LoginResVo }>('/resume-api/auth/reset/email-pwd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取微信小程序code自动登录 POST /resume-api/auth/wxmp/auto-login */
export async function mpCodeAutoLogin(body: API.MpCodeAutoLoginDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/auth/wxmp/auto-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 根据微信小程序 code 登录 POST /resume-api/auth/wxmp/code-login */
export async function mpCodeLogin(body: API.MpCodeLoginDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/auth/wxmp/code-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 轮训登录态 GET /resume-api/auth/wxmp/loop-login-status */
export async function loopLoginStatus(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.loopLoginStatusParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data: string }>('/resume-api/auth/wxmp/loop-login-status', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取微信小程序登录二维码 GET /resume-api/auth/wxmp/qrcode */
export async function getQrCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getQrCodeParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data: API.QueryMpQrCodeResVo }>('/resume-api/auth/wxmp/qrcode', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
