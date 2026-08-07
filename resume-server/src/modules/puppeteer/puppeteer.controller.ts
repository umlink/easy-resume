import {
  Controller,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Inject,
  ParseIntPipe,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PuppeteerService } from '@/modules/puppeteer/puppeteer.service';
import { ApiTags } from '@nestjs/swagger';
import { Api } from '@/decorator/api.decorator';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ConfigService } from '@/modules/config/config.service';
import { ResumeService } from '@/modules/resume/resume.service';
import { errorHandler } from '@/utils/prisma-utils';
import { User } from '@/decorator/user.decorators';
import { AuthUser } from '@/decorator/interface';

@ApiTags('Puppeteer')
@Controller('puppeteer')
export class PuppeteerController {
  @Inject(PuppeteerService)
  private puppeteerService: PuppeteerService;
  @Inject(ConfigService)
  private configService: ConfigService;
  @Inject(ResumeService)
  private resumeService: ResumeService;

  @Get('generate-pdf')
  @Api({ summary: '生成简历-根据用户信息生成一个加密id' })
  @Header('Content-Type', 'application/pdf')
  async generateHtmlToPdf(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Query('url') url: string,
    @Query('rId', ParseIntPipe) rId: number,
    @User() user: AuthUser,
  ) {
    const resume: any = await this.resumeService
      .findOne({
        id: rId,
        userId: user.id,
      })
      .catch(errorHandler);
    if (!resume) {
      throw new HttpException('未找到该简历', HttpStatus.BAD_REQUEST);
    }
    const bff = await this.puppeteerService.genPDF({
      url,
      waitTime: 100,
      token: req.headers[this.configService.get('JWT_AUTH_KEY')] as string,
      margin: resume.content?.margin || {
        top: 40,
        bottom: 40,
        left: 30,
        right: 30,
      },
    });
    await this.resumeService.incrementExportCount(rId);
    res.send(bff);
  }
}
