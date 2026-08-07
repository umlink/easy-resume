import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserBaseInfoVO } from '@/modules/users/vo/user.vo';
import { User } from '@/decorator/user.decorators';
import { AuthUser } from '@/decorator/interface';
import { Api } from '@/decorator/api.decorator';
import { errorHandler } from '@/utils/prisma-utils';
import { VipService } from '@/modules/vip/vip.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from '@/modules/users/dto/update-user.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmailService } from '@/modules/email/email.service';

@ApiTags('User')
@Controller('user')
export class UsersController {
  @Inject(UsersService)
  private readonly userService: UsersService;
  @Inject(VipService)
  private readonly vipServer: VipService;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(CACHE_MANAGER)
  private cache: Cache;
  @Inject(EmailService)
  private readonly mailService: EmailService;

  @Get('/info')
  @Api({ summary: '获取用户详情', resType: UserBaseInfoVO })
  async getUserInfo(@User() user: AuthUser) {
    const ret = await this.userService.getUserById(user.id).catch(errorHandler);
    const vip = await this.vipServer.findValidityVip(user.id);
    const isVip = +Boolean(vip);
    return {
      ...ret,
      isVip,
      accessToken: this.jwtService.sign({
        id: ret.id,
        username: ret.username,
        email: ret.email,
        avatar: ret.avatar,
        roles: ret.roles,
        isVip,
      }),
    };
  }

  @Post('info/update')
  @Api({ summary: '更新用户详情', reqType: UpdateUserDto })
  async editUserInfo(@Body() data: UpdateUserDto, @User() user: AuthUser) {
    const ret = await this.userService.getUserById(user.id);
    if (!ret) {
      throw new ForbiddenException('当前登录信息异常');
    }
    // 邮箱修改需验证码
    if (ret.email !== data.email) {
      if (!data.accessCode) {
        throw new BadRequestException('邮箱变更需提供校验码');
      }
      const emailInfo = await this.mailService.getEmailCode(data.email);
      if (!emailInfo?.code) {
        throw new BadRequestException('验证码不存在或已过期');
      }
      if (emailInfo.code !== data.accessCode) {
        throw new BadRequestException('验证码错误');
      }
    }
    delete data.accessCode;
    await this.userService.updateUser(user.id, data).catch(errorHandler);
    return null;
  }
}
