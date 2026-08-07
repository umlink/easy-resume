import { Inject, Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@/modules/config/config.service';
import { PrismaService } from '@/modules/prisma/prisma.service';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('MAIL_SERVER_HOST'),
      port: this.configService.get('MAIL_SERVER_PORT'),
      secure: this.configService.get('MAIL_SERVER_SECURE') === 'True',
      auth: {
        user: this.configService.get('MAIL_USER_EMAIL'),
        pass: this.configService.get('MAIL_AUTH_CODE'),
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: this.configService.get('MAIL_FORM_NAME'),
        address: this.configService.get('MAIL_USER_EMAIL'),
      },
      to,
      subject,
      html,
    });
  }

  delEmailCode(email: string) {
    return this.prisma.emailCode.delete({
      where: { email },
    });
  }

  getEmailCode(email: string) {
    return this.prisma.emailCode.findFirst({
      where: { email },
    });
  }

  async createCode(email: string, code: string) {
    const ret = await this.getEmailCode(email);
    if (ret) {
      return this.prisma.emailCode.update({
        where: { email },
        data: {
          code,
        },
      });
    }
    return this.prisma.emailCode.create({
      data: { email, code },
    });
  }
}
