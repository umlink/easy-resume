// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 创建指南 POST /resume-api/guide/create */
export async function createGuide(body: API.CreateGuidDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/guide/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除指南 POST /resume-api/guide/delete/${param0} */
export async function deleteGuide(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteGuideParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data: string }>(`/resume-api/guide/delete/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取指南详情 POST /resume-api/guide/detail/${param0} */
export async function getGuideDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGuideDetailParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Response & { data: API.GuideDetailDto }>(`/resume-api/guide/detail/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取所有草稿指南 POST /resume-api/guide/draft-list */
export async function getDraftGuideList(body: API.GuideQueryDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: API.GuideListVO }>('/resume-api/guide/draft-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取所有指南 POST /resume-api/guide/list */
export async function getGuideList(body: API.GuideQueryDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: API.GuideListVO }>('/resume-api/guide/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新指南 POST /resume-api/guide/update */
export async function updateGuide(body: API.UpdateGuideDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/guide/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
