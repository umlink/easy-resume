// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取简历分组列表 POST /resume-api/resume-group/list */
export async function getResumeGroupList(options?: { [key: string]: any }) {
  return request<API.Response & { data: API.ResumeGroupItem[] }>('/resume-api/resume-group/list', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 更新简历分组&内容模板 POST /resume-api/resume-group/update */
export async function updateResumeGroup(body: API.UpdateResumeGroupDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/resume-group/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
