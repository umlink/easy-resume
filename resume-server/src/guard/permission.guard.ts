import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionEnums } from '@/constants/enums';
import { PERMISSION_KEY } from '@/decorator/permission.decorator';

/**
 * 数据级操作管控
 * 如：增删改查导出等等
 * */
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<
      PermissionEnums[]
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPermission) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredPermission.some((permission) =>
      user.permission?.includes(permission),
    );
  }
}
