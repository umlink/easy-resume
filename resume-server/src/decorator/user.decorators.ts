import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from './interface';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
