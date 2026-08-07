import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { Api } from '@/decorator/api.decorator';
import { User } from '@/decorator/user.decorators';
import { AuthUser } from '@/decorator/interface';
import { CreateProposeDto } from '@/modules/propose/dto/create-propose.dto';
import { ProposeService } from '@/modules/propose/propose.service';
import { EmailService } from '@/modules/email/email.service';
import { Throttle } from '@nestjs/throttler';
import { ConfigService } from '@/modules/config/config.service';

@ApiTags('Propose')
@Controller('propose')
export class ProposeController {
  @Inject(ProposeService)
  private proposeService: ProposeService;
  @Inject(EmailService)
  private mailService: EmailService;
  @Inject(ConfigService)
  private configService: ConfigService;

  @Post('/create')
  @Throttle({ max: { limit: 1, ttl: 60000 } })
  @Api({
    summary: '创建提议',
    reqType: CreateProposeDto,
  })
  async createPropose(
    @Body() createProposeDto: CreateProposeDto,
    @User() user: AuthUser,
  ) {
    await this.proposeService.create({
      email: user.email,
      message: createProposeDto.message,
    });
    // 异步发送，不关心是否成功
    this.mailService.sendMail({
      to: this.configService.get('MAIL_FEEDBACK_TO'),
      subject: '用户提议反馈',
      html: `<p>${createProposeDto.message}</p>`,
    });
    return '提交成功';
  }
}
