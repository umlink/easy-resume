// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建简历模板 POST /resume-api/template/create */
export async function createTemplate(body: API.CreateTemplateDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/template/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 简历模板详情 POST /resume-api/template/info/${param0} */
export async function getTemplateInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getTemplateInfoParams,
  options?: { [key: string]: any },
) {
  const { code: param0, ...queryParams } = params;
  return request<API.Response & { data: API.TemplateItemVO }>(`/resume-api/template/info/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取所有建立模板列表 POST /resume-api/template/list */
export async function getTemplateList(body: API.TemplateQueryDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: API.TemplateListVo }>('/resume-api/template/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /resume-api/template/refresh-data */
export async function refreshTemplate(options?: { [key: string]: any }) {
  return request<number>('/resume-api/template/refresh-data', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取简历模板标签 POST /resume-api/template/tags */
export async function getTemplateTags(options?: { [key: string]: any }) {
  return request<API.Response & { data: any[] }>('/resume-api/template/tags', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 更新简历模板 POST /resume-api/template/update/${param0} */
export async function updateTemplate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateTemplateParams,
  body: API.UpdateTemplateDto,
  options?: { [key: string]: any },
) {
  const { code: param0, ...queryParams } = params;
  return request<API.Response & { data: string }>(`/resume-api/template/update/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
