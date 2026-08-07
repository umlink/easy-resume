// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 生成简历分享授权码 POST /resume-api/resume/access-code/${param0} */
export async function genResumeAccessCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.genResumeAccessCodeParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data: string }>(`/resume-api/resume/access-code/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 制作简历副本 POST /resume-api/resume/copy/${param0} */
export async function copyResume(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.copyResumeParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data: number }>(`/resume-api/resume/copy/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取生成的简历数 GET /resume-api/resume/count */
export async function getResumeCount(options?: { [key: string]: any }) {
  return request<API.Response & { data: number }>('/resume-api/resume/count', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建简历 POST /resume-api/resume/create */
export async function createResume(body: API.CreateResumeDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: number }>('/resume-api/resume/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取我的简历详情 POST /resume-api/resume/data-tmp/${param0} */
export async function getResumeTmpInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getResumeTmpInfoParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data: API.ResumeDetailVO }>(`/resume-api/resume/data-tmp/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取我的简历详情 POST /resume-api/resume/info/${param0} */
export async function getResumeInfo(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getResumeInfoParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data: API.ResumeDetailVO }>(`/resume-api/resume/info/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 我的简历列表 POST /resume-api/resume/list */
export async function getResumeList(body: API.QueryResumeDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: API.ResumeListVO }>('/resume-api/resume/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 简历数据简历，只能从邮箱到小程序登录 POST /resume-api/resume/migration */
export async function dataMigration(body: API.MigrationResumeDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/resume/migration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取简历导出的授权code GET /resume-api/resume/pdf/${param0} */
export async function exportPDF(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.exportPDFParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data: string }>(`/resume-api/resume/pdf/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 简历预览 POST /resume-api/resume/preview */
export async function previewResume(body: API.PreviewResumeDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: API.ResumeItemVO }>('/resume-api/resume/preview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除我的简历 POST /resume-api/resume/remove/${param0} */
export async function removeResume(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.removeResumeParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data: string }>(`/resume-api/resume/remove/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 更新我的简历 POST /resume-api/resume/update */
export async function updateResume(body: API.UpdateResumeDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/resume/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
