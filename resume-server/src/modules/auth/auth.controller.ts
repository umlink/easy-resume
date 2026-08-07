import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { NotLogin } from '@/decorator/auth.decorators';
import {
  EmailCodeLoginDto,
  EmailPwdLoginDto,
  LoopLoginReqDto,
  MpCodeAutoLoginDto,
  MpCodeLoginDto,
  QueryMpQrCodeReqDto,
  ResetEmailPwdDto,
} from '@/modules/auth/dto/login.dto';
import { Api } from '@/decorator/api.decorator';
import { EmailService } from '@/modules/email/email.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LoginResVo, QueryMpQrCodeResVo } from '@/modules/auth/vo/login.vo';
import dayjs from 'dayjs';
import { genSnowUUId } from '@/utils/id.gen';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private authService: AuthService;

  @Inject(EmailService)
  private mailServer: EmailService;

  @Post('email-code')
  @NotLogin()
  @Api({
    summary: '邮箱验证码登录/注册',
    reqType: EmailCodeLoginDto,
    resType: LoginResVo,
  })
  async emailCodeLogin(
    @Body() loginDto: EmailCodeLoginDto,
  ): Promise<LoginResVo> {
    const emailCodeData = await this.mailServer.getEmailCode(loginDto.email);
    if (!emailCodeData) {
      throw new BadRequestException('验证码不存在');
    }
    if (dayjs().diff(dayjs(emailCodeData.updatedAt), 'minutes') > 5) {
      throw new BadRequestException('验证码已过期');
    }
    if (emailCodeData.code !== loginDto.code) {
      throw new BadRequestException('验证码错误');
    }
    const res = await this.authService.loginByEmailCode(
      loginDto.email,
      loginDto.code,
    );
    if (res.code) {
      await this.mailServer.sendMail({
        to: loginDto.email,
        subject: '登录密码',
        html: `<p>您的初始登录密码为: <b>${res.code}</b> ，请妥善保存，可在个人中心中修改密码</p>`,
      });
    }
    // 删除验证码
    await this.mailServer.delEmailCode(loginDto.email);
    return {
      accessToken: res.accessToken,
      isRegister: !!res.code,
    };
  }

  @Post('email-pwd')
  @NotLogin()
  @Api({
    summary: '邮箱密码登录',
    reqType: EmailPwdLoginDto,
    resType: LoginResVo,
  })
  async emailPwdLogin(@Body() loginDto: EmailPwdLoginDto) {
    const res = await this.authService.loginByEmailPwd({
      email: loginDto.email,
      password: loginDto.password,
    });
    return {
      accessToken: res.accessToken,
      isRegister: false,
    };
  }

  @Post('reset/email-pwd')
  @NotLogin()
  @Api({
    summary: '修改邮箱登录密码',
    reqType: ResetEmailPwdDto,
    resType: LoginResVo,
  })
  async resetEmailPwd(@Body() loginDto: ResetEmailPwdDto) {
    const emailCodeData = await this.mailServer.getEmailCode(loginDto.email);
    if (!emailCodeData) {
      throw new BadRequestException('验证码不存在');
    }
    if (dayjs().diff(dayjs(emailCodeData.createdAt), 'minutes') > 5) {
      throw new BadRequestException('验证码已过期');
    }
    if (emailCodeData.code !== loginDto.code) {
      throw new BadRequestException('验证码错误');
    }
    const res = await this.authService.resetEmailPwd({
      email: loginDto.email,
      password: loginDto.password,
    });
    // 删除验证码
    await this.mailServer.delEmailCode(loginDto.email);
    return {
      accessToken: res.accessToken,
      isRegister: false,
    };
  }

  @Get('wxmp/qrcode')
  @NotLogin()
  @Api({
    summary: '获取微信小程序登录二维码',
    resType: QueryMpQrCodeResVo,
  })
  async getQrCode(@Query() query: QueryMpQrCodeReqDto) {
    console.log('小程序二维码中的邀请码：', query.inviteCode);
    const verifyCode = genSnowUUId();
    const imgUrl = await this.authService.getMpQrCode(
      verifyCode,
      query.inviteCode,
    );
    return {
      imgUrl,
      verifyCode,
    };
  }

  @Get('wxmp/loop-login-status')
  @NotLogin()
  @ApiQuery({ type: LoopLoginReqDto })
  @Throttle({
    default: { limit: 20, ttl: 60000 },
    min: { limit: 60, ttl: 60000 },
    max: { limit: 120, ttl: 60000 },
  })
  @Api({ summary: '轮训登录态' })
  async loopLoginStatus(@Query() query: LoopLoginReqDto) {
    const ret = await this.authService.getMpLoginData(+query.verifyCode);
    if (ret.status === 1) {
      const token = await this.authService.mpLoginByOpenId(ret.openId);
      if (token) {
        return token;
      } else {
        throw new BadRequestException('未找到登录用户');
      }
    }
    return null;
  }

  @Post('wxmp/code-login')
  @NotLogin()
  @Api({ summary: '根据微信小程序 code 登录' })
  async mpCodeLogin(@Body() data: MpCodeLoginDto) {
    console.log(data);
    return this.authService.getMpAuthInfo(data);
  }

  @Post('wxmp/auto-login')
  @NotLogin()
  @Api({ summary: '获取微信小程序code自动登录' })
  mpCodeAutoLogin(@Body() data: MpCodeAutoLoginDto) {
    return this.authService.autoLoginByMpCode(data);
  }
}
