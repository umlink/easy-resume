import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from '@/modules/order/dto/create-order.dto';
import { genSnowUUId } from '@/utils/id.gen';
import { Api } from '@/decorator/api.decorator';
import { VipTypeService } from '@/modules/vip-type/vip-type.service';
import { User } from '@/decorator/user.decorators';
import { AuthUser } from '@/decorator/interface';
import { ORDER_STATUS, PAY_TYPE } from '@/constants/enums';
import { VipService } from '@/modules/vip/vip.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@/modules/config/config.service';
import { CallbackOrderDto } from '@/modules/order/dto/callback-order.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import dayjs from 'dayjs';
import { firstValueFrom } from 'rxjs';
import { PaySignUtil } from '@/utils/order-utils';
import { CreateOrderVO } from '@/modules/order/vo/order.vo';
import { ApiTags } from '@nestjs/swagger';
import { NotLogin } from '@/decorator/auth.decorators';
import { InviteService } from '@/modules/invite/invite.service';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  @Inject(OrderService)
  private orderService: OrderService;

  @Inject(VipTypeService)
  private vipTypeService: VipTypeService;

  @Inject(VipService)
  private vipService: VipService;

  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(InviteService)
  private inviteService: InviteService;

  constructor() {}

  @Post('/create-order')
  @Api({
    summary: '生成会员订单',
    reqType: CreateOrderDto,
    resType: CreateOrderVO,
  })
  async createVipOrder(
    @Body() createOrderDto: CreateOrderDto,
    @User() user: AuthUser,
  ) {
    const vipType = await this.vipTypeService.findById(
      createOrderDto.vipTypeId,
    );
    if (!vipType) {
      throw new BadRequestException('该会员类型不存在');
    }
    const orderNo = `D${genSnowUUId()}`;
    try {
      const ret = await this.orderService.create({
        payType: PAY_TYPE.WX_PAY,
        price: vipType.price,
        userId: user.id,
        id: orderNo,
        status: ORDER_STATUS.NO_PAY,
        vipTypeId: createOrderDto.vipTypeId,
      });
      /**
       * 生成支付链接，返回订单号和支付二维码
       * 二维码由第三方系统支持
       * */
      let params: Record<string, any> = {
        out_trade_no: orderNo, // 订单号
        total_fee: vipType.price, // 价格
        mch_id: this.configService.get('PAY_MCH_ID'), // 商户号
        body: `轻简历-${vipType.title}`, // 购买的商品或服务
      };
      params = {
        ...params,
        sign: PaySignUtil(params, this.configService.get('PAY_SIGN_KEY')),
        type: 2, // 支付链接类型 1、返回微信原生的支付连接需要自行生成二维码；2、直接返回付款二维码地址，页面上展示即可。不填默认1
        attach: orderNo, // 附加数据，原路返回, 生成随机数，检查回调
        notify_url: `${this.configService.get('SERVER_DOMAIN')}${this.configService.get('API_PREFIX')}/order/notice-callback`,
      };
      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://api.pay.yungouos.com/api/pay/wxpay/nativePay',
          params,
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );
      return {
        orderId: ret.id,
        payImgUrl: data?.data,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  @Get('/status/:orderId')
  @Api({ summary: '查询订单状态' })
  async searchOrderStatus(@Param('orderId') orderId: string) {
    const order = await this.orderService.findOne(orderId);
    if (!order) {
      throw new BadRequestException('订单不存在');
    }
    // 过滤已支付订单，且更新时间超过 5 分钟，视为非法
    if (
      order.status === ORDER_STATUS.PAID &&
      dayjs().diff(dayjs(order.updatedAt), 'm') > 5
    ) {
      throw new BadRequestException('非法操作，该订单已被使用');
    }
    return order.status;
  }

  @Post('/notice-callback')
  @Api({ summary: '支付结果回调' })
  @NotLogin()
  async noticeCallback(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const body = req.body as CallbackOrderDto;
    const orderId = body.outTradeNo;
    if (!orderId) {
      throw new BadRequestException('订单号不能为空');
    }
    const order = await this.orderService.findOne(orderId);
    if (!order) {
      throw new BadRequestException('订单不存在');
    }
    // 已支付则直接返回成功
    if (order.status === ORDER_STATUS.PAID) {
      return res.send('SUCCESS');
    }
    const userId = Number(order.userId);
    // 如果支付成功，会员信息落库
    const [vipInfo, vipType, inviteInfo] = await Promise.all([
      this.vipService.findOne(userId),
      this.vipTypeService.findById(order.vipTypeId),
      this.inviteService.getInviterInfo(userId),
    ]);
    await this.orderService.updateOrderAndVip(
      body,
      order,
      vipInfo,
      inviteInfo,
      vipType,
    );
    // 直接返回大写 SUCCESS 则为成功
    return res.send('SUCCESS');
  }
}
