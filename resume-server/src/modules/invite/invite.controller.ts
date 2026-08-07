import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Inject, Post } from '@nestjs/common';
import { Api } from '@/decorator/api.decorator';
import { InviteService } from '@/modules/invite/invite.service';
import { User } from '@/decorator/user.decorators';
import { AuthUser } from '@/decorator/interface';
import { genSnowUUId } from '@/utils/id.gen';

@ApiTags('Invite')
@Controller('invite')
export class InviteController {
  @Inject(InviteService)
  inviteService: InviteService;

  @Post('generate-code')
  @Api({ summary: '生成邀请码' })
  async generateInviteCode(@User() user: AuthUser) {
    const data = await this.inviteService.createCode({
      userId: user.id,
      code: `${genSnowUUId()}`,
    });
    return data?.code;
  }

  @Get('code')
  @Api({ summary: '获取我的邀请码' })
  async getInviteCode(@User() user: AuthUser) {
    const data = await this.inviteService.getCodeByInviter(user.id);
    return data?.code;
  }

  @Get('record-list')
  @Api({ summary: '获取我的邀请记录' })
  async getMyInviteRecord(@User() user: AuthUser) {
    // 邀请用户信息，邀请时间，是否是会员
    console.log(user);
  }
}
