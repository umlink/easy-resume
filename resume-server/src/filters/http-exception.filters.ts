import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getReasonPhrase } from 'http-status-codes';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { getReqMainInfo } from '@/utils/logger-utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_MODULE_PROVIDER)
  private readonly logger: Logger;

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const code = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const errMsg =
      typeof exceptionResponse === 'object'
        ? exceptionResponse.message
        : exception.message;
    const message = errMsg || getReasonPhrase(code) || 'Server error';
    // 日志打印
    this.logger.error(`httpRequestError`, {
      stack: exception.stack,
      req: getReqMainInfo(ctx.getRequest<FastifyRequest>()),
      msg: message,
    });
    response.status(200).send({
      code,
      message: message,
      success: false,
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
}
