import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  catchError,
  Observable,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

/**
 * http接口 10s 超时
 * 请注意其他接口如上传请单独设置超时时间
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(60000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => RequestTimeoutException);
        }
        return throwError(() => err);
      }),
    );
  }
}
