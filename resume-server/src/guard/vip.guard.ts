import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_VIP_KEY } from '@/decorator/vip.decorators';

@Injectable()
export class VipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isVip = this.reflector.getAllAndOverride<boolean>(IS_VIP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isVip) {
      const request = context.switchToHttp().getRequest();
      if (request.user.isVip) {
        return true;
      }
      throw new ForbiddenException('权限不足');
    }
    return true;
  }
}
