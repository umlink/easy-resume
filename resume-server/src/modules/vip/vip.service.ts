import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { getIOSTime } from '@/utils/time-utils';
import { InviteService } from '@/modules/invite/invite.service';
import { computeExpireTime } from '@/utils/resume-utils';

@Injectable()
export class VipService {
  @Inject(InviteService)
  private inviteService: InviteService;

  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.VipCreateInput) {
    return this.prisma.vip.create({ data });
  }

  findOne(userId: number) {
    return this.prisma.vip.findFirst({
      where: {
        userId,
      },
    });
  }

  findValidityVip(userId: number) {
    return this.prisma.vip.findFirst({
      where: {
        userId,
        expireTime: {
          gt: getIOSTime(),
        },
      },
    });
  }

  async update(data: Prisma.VipUpdateInput) {
    return this.prisma.vip.update({
      where: { userId: Number(data.userId) },
      data,
    });
  }

  async subTokens(tokens: number, userId: number) {
    const data = await this.findValidityVip(userId);
    if (data.optTokens < tokens) {
      throw new BadRequestException('token数不足，可充值后继续使用');
    }
    console.log('data.optTokens - tokens:', data.optTokens - tokens);
    return this.prisma.vip.update({
      where: {
        userId,
      },
      data: {
        optTokens: data.optTokens - tokens,
      },
    });
  }

  async subCheckCount(userId: number) {
    const data = await this.findValidityVip(userId);
    if (data.checkCount === 0) {
      throw new BadRequestException('检测额度已使用完，可充值后继续使用');
    }
    return this.prisma.vip.update({
      where: {
        userId,
      },
      data: {
        checkCount: data.checkCount - 1,
      },
    });
  }

  // 添加会员时间
  async addVipTime(inviteCode: string, d: number, userId?: number) {
    let _userId = userId;
    if (!userId) {
      _userId = await this.inviteService.getUserId(inviteCode);
    }
    if (_userId) {
      const vipInfo = await this.findOne(_userId);
      if (vipInfo) {
        const expireTime = computeExpireTime(vipInfo).add(d, 'd').toDate();
        return this.update({
          userId: _userId,
          expireTime,
        });
      }
    }
    return null;
  }
}
