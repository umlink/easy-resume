import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NOT_LOGIN_KEY } from '@/decorator/auth.decorators';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@/modules/config/config.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers[this.config.get('JWT_AUTH_KEY')];

    const notLogin = this.reflector.getAllAndOverride<boolean>(NOT_LOGIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const secret = this.config.get('JWT_SECRET');
    if (notLogin) {
      // 无需登录，但存在 token 也进行解析
      if (token) {
        try {
          request['user'] = await this.jwtService.verifyAsync(token, {
            secret,
          });
        } catch {}
      }
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      request['user'] = await this.jwtService.verifyAsync(token, { secret });
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
