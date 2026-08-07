// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 生成简历-根据用户信息生成一个加密id GET /resume-api/puppeteer/generate-pdf */
export async function generateHtmlToPdf(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.generateHtmlToPdfParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data: string }>('/resume-api/puppeteer/generate-pdf', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
