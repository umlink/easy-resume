import { Controller, Get, Post } from '@nestjs/common';
import { VipService } from './vip.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@/decorator/user.decorators';
import { AuthUser } from '@/decorator/interface';
import { Api } from '@/decorator/api.decorator';
import { VipInfoVO } from '@/modules/vip/vo/vip.vo';

@ApiTags('Vip')
@Controller('vip')
export class VipController {
  constructor(private readonly vipService: VipService) {}

  @Get('/info')
  @Api({ summary: '获取我的会员信息', resType: VipInfoVO })
  async getVipInfo(@User() user: AuthUser) {
    return this.vipService.findValidityVip(user.id);
  }

  @Post('/')
  @Api({ summary: '生成邀请码' })
  async generateInviteCode() {}
}
