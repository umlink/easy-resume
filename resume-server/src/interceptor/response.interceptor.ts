import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { getReasonPhrase } from 'http-status-codes';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@/modules/config/config.service';
import { getReqMainInfo } from '@/utils/logger-utils';

/**
 * 格式化输出内容
 * code: 200 为成功响应
 * 成功响应返回 success: ture,方便前端判断
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  @Inject(WINSTON_MODULE_PROVIDER)
  private readonly logger: Logger;
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const code = response.statusCode;
    const message = response.statusMessage || getReasonPhrase(code);
    return next.handle().pipe(
      map((data) => {
        this.logger.info('httpResponse', {
          url: getReqMainInfo(ctx.getRequest()).url,
          // res: data,
        });
        return {
          code,
          message,
          data: data ?? null,
          success: code === 200,
        };
      }),
    );
  }
}
