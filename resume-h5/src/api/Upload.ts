// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 单文件上传 POST /resume-api/upload/file */
export async function uploadFile(body: API.FormData, options?: { [key: string]: any }) {
  return request<API.Response & { data: API.UploadQiNiuResVo }>('/resume-api/upload/file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
