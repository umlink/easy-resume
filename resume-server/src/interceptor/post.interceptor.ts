import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest, FastifyReply } from 'fastify';
/**
 * 针对 post 请求默认响应 201 的问题处理
 * */
@Injectable()
export class PostInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest['raw']>();
    const response = context.switchToHttp().getResponse<FastifyReply['raw']>();
    if (request.method === 'POST') {
      if (response.statusCode === 201)
        context.switchToHttp().getResponse().status(HttpStatus.OK);
    }
    return next.handle();
  }
}
