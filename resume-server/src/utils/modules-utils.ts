import { ConfigService } from '@/modules/config/config.service';
import winston from 'winston';
import { ThrottlerOptions } from '@nestjs/throttler';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import * as Transport from 'winston-transport';
import { OpenAPIObject } from '@nestjs/swagger';
import 'winston-daily-rotate-file';

export const throttleOptions = (
  configService: ConfigService,
): ThrottlerOptions[] => {
  return [
    {
      name: 'short',
      ttl: Number(configService.get('THROTTLE_SHORT_TTL')),
      limit: Number(configService.get('THROTTLE_SHORT_LIMIT')),
    },
    {
      name: 'medium',
      ttl: Number(configService.get('THROTTLE_MEDIUM_TTL')),
      limit: Number(configService.get('THROTTLE_MEDIUM_LIMIT')),
    },
    {
      name: 'long',
      ttl: Number(configService.get('THROTTLE_LONG_TTL')),
      limit: Number(configService.get('THROTTLE_LONG_LIMIT')),
    },
  ];
};

export const getLogTransportByLevel = (
  configService: ConfigService,
  level?: string,
): Transport => {
  const params = {
    level: undefined,
    dirname: configService.get('LOG_PATH'),
    filename: `%DATE%-${level || 'info'}.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: configService.get('LOG_MAX_SIZE'),
    maxFiles: configService.get('LOG_MAX_FILES'),
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      winston.format.printf((info) => {
        // 基础信息日志文件 过来错误日志
        if (level !== 'error' && info.level === 'error') {
          return '';
        }
        return `${info.timestamp} [${info.level}] : ${info.message} ${
          Object.keys(info).length
            ? JSON.stringify(info, null, level === 'error' ? 2 : 0)
            : ''
        } ${info['stack'] || ''}`;
      }),
    ),
  };
  if (level) {
    params.level = level;
  }
  return new winston.transports.DailyRotateFile(params);
};

export const consoleLogOption: ConsoleTransportOptions = {
  // level: "info", 可指定一种日志类型，不指定，则为全部
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
      (info) =>
        `${info.timestamp} [${info.level}] : ${info.message} ${
          Object.keys(info).length ? JSON.stringify(info, null) : ''
        }`,
    ),
  ),
};
/**
 * 返回体结构包装
 * 方便 ts 生成 api 文档，以及方便 各api 平台识别
 * resVo
 * =>
 * {
 *   code: 200,
 *   message: 'OK',
 *   data: resVo,
 *   success: true
 * }
 * */
export function addResponseWrapper(doc: OpenAPIObject) {
  for (const path of Object.keys(doc.paths)) {
    const pathItem = doc.paths[path];
    if (!pathItem) {
      continue;
    }
    for (const method of Object.keys(pathItem)) {
      const responses = doc.paths[path][method].responses;
      if (!responses) {
        continue;
      }
      for (const status of Object.keys(responses)) {
        const json = responses[status].content?.['application/json'];
        if (!json) {
          responses[status].content = {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Response',
              },
            },
          };
          continue;
        }
        const schema = json.schema;
        json.schema = {
          allOf: [
            {
              $ref: '#/components/schemas/Response',
            },
            {
              type: 'object',
              properties: {
                data: schema,
              },
              required: ['data'],
            },
          ],
        };
      }
    }
  }

  doc.components.schemas.Response = {
    type: 'object',
    properties: {
      code: {
        type: 'integer',
        description: '状态码',
        example: 200,
        format: 'int32',
      },
      message: {
        type: 'string',
        description: '提示信息',
        example: 'Ok',
      },
      success: {
        type: 'boolean',
        example: true,
      },
    },
    required: ['code', 'message', 'success'],
  };

  return doc;
}
