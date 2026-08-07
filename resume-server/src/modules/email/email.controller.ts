import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { Api } from '@/decorator/api.decorator';
import { ApiTags } from '@nestjs/swagger';
import { SendMailCodeDto } from '@/modules/email/dto/create-email.dto';
import { NotLogin } from '@/decorator/auth.decorators';
import { EmailCode } from '@/constants/content-kv';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  @Inject(EmailService)
  private readonly mailService: EmailService;

  @Post('/send-code')
  @NotLogin()
  @Api({
    summary: '发送邮箱验证码',
    reqType: SendMailCodeDto,
    resType: String,
  })
  async sendEmailCode(@Body() data: SendMailCodeDto) {
    const code = Math.random().toString().slice(2, 8);
    await this.mailService
      .sendMail({
        to: data.email,
        subject: EmailCode[data.type].title,
        html: `<p>${EmailCode[data.type].description} <b>${code}</b> ，有效时间 5 分钟</p>`,
      })
      .catch(() => {
        throw new HttpException('发送失败，请重试', HttpStatus.GATEWAY_TIMEOUT);
      });
    // 设置到缓存中 5分钟过去
    // await this.cache.set(data.email, code, 1000 * 60 * 5);
    await this.mailService.createCode(data.email, code);
    return '发送成功';
  }
}
