import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CallbackOrderDto } from '@/modules/order/dto/callback-order.dto';
import { ORDER_STATUS } from '@/constants/enums';
import { VipService } from '@/modules/vip/vip.service';
import { ConfigService } from '@/modules/config/config.service';
import { computeExpireTime } from '@/utils/resume-utils';
import { InviteService } from '@/modules/invite/invite.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  @Inject(ConfigService)
  private configService: ConfigService;
  @Inject(PrismaService)
  private readonly prisma: PrismaService;
  @Inject(VipService)
  private vipServer: VipService;
  @Inject(InviteService)
  private inviteService: InviteService;

  async create(createOrderDto: Prisma.orderCreateInput) {
    return this.prisma.order.create({ data: createOrderDto });
  }

  async findOne(id: string) {
    return this.prisma.order.findFirst({ where: { id } });
  }

  async update(id: string, updateOrderDto: Prisma.orderUpdateInput) {
    return this.prisma.order.update({ where: { id }, data: updateOrderDto });
  }

  async updateOrderAndVip(
    data: CallbackOrderDto,
    order: any,
    vipInfo: any,
    inviteInfo: { vip: number; inviterId: bigint; inviteCode: string },
    vipType: any,
  ) {
    const userId: number = Number(order.userId);
    const expireTime = computeExpireTime(vipInfo)
      .add(vipType.duration, 'd')
      .toDate();

    const transactionList: Prisma.PrismaPromise<any>[] = [
      this.prisma.order.update({
        where: { id: data.outTradeNo },
        data: {
          orderNo: data.orderNo,
          payNo: data.payNo,
          payBank: data.payBank,
          payChannel: data.payChannel,
          openId: data.openId,
          status: ORDER_STATUS.PAID,
        },
      }),
    ];
    if (vipInfo) {
      transactionList.push(
        this.prisma.vip.update({
          where: { userId },
          data: {
            expireTime,
            vipTypeId: vipType.id,
            optTokens: vipType.optTokens + vipInfo.optTokens,
            checkCount: vipType.checkCount + vipInfo.checkCount,
          },
        }),
      );
    } else {
      transactionList.push(
        this.prisma.vip.create({
          data: {
            userId,
            vipTypeId: vipType.id,
            optTokens: vipType.optTokens,
            checkCount: vipType.checkCount,
            startTime: new Date(),
            expireTime,
          },
        }),
      );
    }
    this.logger.log(
      `检查用户是否注册过: ${inviteInfo?.inviteCode}-${inviteInfo?.vip}`,
    );
    // 存在邀请信息，并且没有购买过会员，第一次购买，赠送邀请人权益
    if (inviteInfo && !inviteInfo.vip) {
      await this.vipServer.addVipTime(
        inviteInfo.inviteCode,
        Number(this.configService.get('VIP_GIFT_MAX_DAY')),
        Number(inviteInfo.inviterId),
      );
      // 更新邀请信息，用户已购买过会员
      await this.inviteService.updateInviteUser(order.userId, { vip: 1 });
    }

    return await this.prisma.$transaction(transactionList).catch(() => {
      throw new ServiceUnavailableException('系统异常');
    });
  }
}
