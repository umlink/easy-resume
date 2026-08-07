// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 简历全文优化，输出 stream GET /resume-api/ai/optimize/inspect */
export async function resumeInspectStreamAi(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.resumeInspectStreamAiParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data: string }>('/resume-api/ai/optimize/inspect', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 简历模块优化 POST /resume-api/ai/optimize/module-opt */
export async function resumeModuleOpt(body: API.OptModuleReqDto, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/ai/optimize/module-opt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 解析文件内容，生成简历 POST /resume-api/ai/parse/file */
export async function uploadFile(body: API.FormData, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/ai/parse/file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 简历小 K 智能 ai，根据任务 id执行任务 GET /resume-api/ai/resume/chat */
export async function resumeAiChatStream(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.resumeAiChatStreamParams,
  options?: { [key: string]: any },
) {
  return request<API.Response & { data: string }>('/resume-api/ai/resume/chat', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建一个 sse 任务 POST /resume-api/ai/task/add */
export async function newSSETask(body: API.NewSseTaskReq, options?: { [key: string]: any }) {
  return request<API.Response & { data: string }>('/resume-api/ai/task/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
