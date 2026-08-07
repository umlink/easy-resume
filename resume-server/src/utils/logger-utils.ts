import { FastifyRequest } from 'fastify';

export const getReqMainInfo: (req: FastifyRequest) => {
  [prop: string]: any;
} = (req) => {
  const { query, headers, url, originalUrl, method, body, connection } = req;

  // 获取 IP
  const xRealIp = headers['X-Real-IP'];
  const xForwardedFor = headers['X-Forwarded-For'];
  const { ip: cIp } = req;
  const { remoteAddress } = connection || {};
  const ip = xRealIp || xForwardedFor || cIp || remoteAddress;

  return {
    url: originalUrl || url,
    host: headers.host,
    ip,
    method,
    query,
    body,
  };
};
