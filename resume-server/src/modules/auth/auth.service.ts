import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RolesEnums } from '@/constants/enums';
import { Md5 } from 'ts-md5';
import { ConfigService } from '@/modules/config/config.service';
import { Prisma, vip_type_sell_type } from '@prisma/client';
import { VipService } from '@/modules/vip/vip.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '@/modules/prisma/prisma.service';
import {
  MpCodeAutoLoginDto,
  MpCodeLoginDto,
} from '@/modules/auth/dto/login.dto';
import { VipTypeService } from '@/modules/vip-type/vip-type.service';
import dayjs from 'dayjs';
import randomString from 'randomstring';
import { InviteService } from '@/modules/invite/invite.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  @Inject(UsersService)
  private usersService: UsersService;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(ConfigService)
  private configService: ConfigService;
  @Inject(VipService)
  private vipService: VipService;
  @Inject(HttpService)
  private httpService: HttpService;
  @Inject(PrismaService)
  private readonly prisma: PrismaService;
  @Inject(InviteService)
  private inviteService: InviteService;

  private giftVip: {
    id: bigint;
    title: string;
    duration: number;
    checkCount: number;
    optTokens: number;
    description: string;
    disabled: number;
  };

  constructor(private vipTypeServer: VipTypeService) {
    this.vipTypeServer.findByType(vip_type_sell_type.GIFT).then((vip) => {
      this.giftVip = vip;
    });
  }

  async loginByEmailCode(email: string, code: string) {
    let user = await this.usersService.getUserByEmail({
      email,
    });
    let pwd: string;
    if (!user) {
      user = await this.usersService.registerByEmail({
        username: email,
        email,
        password: Md5.hashStr(code + this.configService.get('MD5_SALT')),
        roles: [RolesEnums.User],
      });
      pwd = code;
    }
    const vip = await this.vipService.findValidityVip(user.id);
    return {
      user,
      accessToken: this.jwtService.sign({
        ...user,
        isVip: +Boolean(vip),
      }),
      code: pwd,
    };
  }

  async loginByEmailPwd(where: Prisma.UserWhereInput) {
    const user = await this.usersService.getUserByEmail(where);
    if (!user) {
      throw new BadRequestException('密码错误或邮箱不存在');
    }
    return {
      accessToken: this.jwtService.sign(user),
    };
  }

  async resetEmailPwd(data: { email: string; password: string }) {
    const user = await this.usersService.updateUserByEmail(data.email, {
      password: data.password,
    });
    if (!user) {
      throw new BadRequestException('该用户不存在');
    }
    return {
      accessToken: this.jwtService.sign(user),
    };
  }

  async getMiniAccessToken() {
    const { data } = await firstValueFrom(
      this.httpService.get('https://api.weixin.qq.com/cgi-bin/token', {
        params: {
          grant_type: 'client_credential',
          appid: this.configService.get('MP_APP_ID'),
          secret: this.configService.get('MP_APP_SECRET'),
        },
      }),
    );
    return data.access_token;
  }

  async getMpQrCode(verifyCode: number | bigint, inviteCode?: string) {
    const token = await this.getMiniAccessToken();
    //env_version 正式版为 "release"，体验版为 "trial"，开发版为 "develop",
    const isDev = process.env.NODE_ENV === 'development';
    const env_version = isDev ? 'trial' : 'release';
    const _inviteCode = inviteCode ? '-' + inviteCode : '';

    const res = await firstValueFrom(
      this.httpService.post(
        'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + token,
        {
          page: 'pages/auth/index',
          scene: `${verifyCode}${_inviteCode}`,
          check_path: false,
          env_version,
        },
        { responseType: 'arraybuffer' },
      ),
    );
    const base64Data = Buffer.from(res.data).toString('base64');
    // 插入一条登录态记录
    await this.prisma.mpLoginStatus.create({
      data: {
        id: verifyCode,
        openId: '',
      },
    });
    return `data:image/png;base64,${base64Data}`;
  }

  async getMpLoginData(id: number) {
    return this.prisma.mpLoginStatus.findUnique({
      where: { id },
      select: {
        id: true,
        openId: true,
        status: true,
      },
    });
  }

  async autoLoginByMpCode(d: MpCodeAutoLoginDto) {
    const { data } = await firstValueFrom(
      this.httpService.get<{ session_key: string; openid: string }>(
        'https://api.weixin.qq.com/sns/jscode2session',
        {
          params: {
            js_code: d.code,
            appid: this.configService.get('MP_APP_ID'),
            secret: this.configService.get('MP_APP_SECRET'),
            grant_type: 'authorization_code',
          },
        },
      ),
    );
    this.logger.log(`自动登录 openId: ${data.openid}`);
    // 有 openid，则已注册登录过
    const user = await this.usersService.getUserByOpenId({
      mpOpenId: data.openid,
    });
    if (user) {
      return this.jwtService.sign(user);
    } else {
      return null;
    }
  }

  async getMpAuthInfo(d: MpCodeLoginDto) {
    const { data } = await firstValueFrom(
      this.httpService.get<{ session_key: string; openid: string }>(
        'https://api.weixin.qq.com/sns/jscode2session',
        {
          params: {
            js_code: d.code,
            appid: this.configService.get('MP_APP_ID'),
            secret: this.configService.get('MP_APP_SECRET'),
            grant_type: 'authorization_code',
          },
        },
      ),
    );
    this.logger.log('检查用户是否注册过');
    let user = await this.usersService.getUserByOpenId({
      mpOpenId: data.openid,
    });
    this.logger.log(user);
    if (!user) {
      // 添加一个普通用户
      user = await this.usersService.addUser({
        avatar: this.configService.get('DEFAULT_USER_AVATAR'),
        username: `长江一号-${randomString.generate(7)}`,
        password: this.configService.get('DEFAULT_USER_PASSWORD'),
        mpOpenId: data.openid,
        roles: [RolesEnums.User],
      });
      const promiseList: Promise<any>[] = [
        this.vipService.create({
          userId: user.id,
          vipTypeId: this.giftVip.id,
          optTokens: this.giftVip.optTokens,
          checkCount: this.giftVip.checkCount,
          startTime: new Date(),
          expireTime: dayjs().add(this.giftVip.duration, 'd').toDate(),
        }),
      ];
      // 有邀请码，且为新用户，则为邀请者添加 1 天会员
      this.logger.log(`邀请码：${d.inviteCode}`);
      if (d.inviteCode) {
        // 邀请码所属用户 id
        const inviterId = await this.inviteService.getUserId(d.inviteCode);
        this.logger.log(`邀请者 id：${inviterId}`);
        promiseList.push(
          this.vipService.addVipTime(
            d.inviteCode,
            Number(this.configService.get('VIP_GIFT_MIN_DAY')),
          ),
          this.inviteService.addInviteUser({
            id: user.id,
            inviterId: Number(inviterId),
            inviteCode: d.inviteCode,
          }),
        );
      }
      await Promise.all(promiseList).catch((err) => {
        throw new BadGatewayException(err, '服务异常');
      });
    }
    // 更新状态表，记录 openid,用于 loop 查询
    await this.prisma.mpLoginStatus.update({
      where: { id: +d.verifyCode },
      data: {
        openId: data.openid,
        status: 1,
      },
    });
    return this.jwtService.sign(user);
  }

  async clearMpLoginTmpData(id: number) {
    return this.prisma.mpLoginStatus.delete({ where: { id } });
  }

  async mpLoginByOpenId(mpOpenId: string) {
    const user = await this.usersService.getUserByOpenId({
      mpOpenId,
    });
    if (user) {
      return this.jwtService.sign(user);
    }
    return null;
  }
}
