import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InviteService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  createCode(data: Prisma.InviteCodeCreateInput) {
    return this.prisma.inviteCode.create({ data });
  }

  async addInviteUser(data: Prisma.InviteUserCreateInput) {
    const ret = await this.prisma.inviteUser.findFirst({
      where: { id: data.id },
    });
    // 已经被邀请过，则跳过
    if (ret?.id) {
      return;
    }
    return this.prisma.inviteUser.create({ data });
  }

  updateInviteUser(id: number, data: Prisma.InviteUserUpdateInput) {
    return this.prisma.inviteUser.update({ where: { id }, data });
  }

  getCodeByInviter(userId: number) {
    return this.prisma.inviteCode.findFirst({
      where: { userId },
      select: { code: true },
    });
  }

  async getUserId(code: string) {
    const data = await this.prisma.inviteCode.findFirst({
      where: { code },
      select: { userId: true },
    });
    return data?.userId;
  }

  getInviteInfoByCode(inviteCode: string) {
    return this.prisma.inviteUser.findFirst({
      where: { inviteCode },
      select: {
        id: true,
        inviterId: true,
        vip: true,
      },
    });
  }

  getInviterInfo(id: number) {
    return this.prisma.inviteUser.findFirst({
      where: { id },
      select: {
        inviterId: true,
        inviteCode: true,
        vip: true,
      },
    });
  }
}
