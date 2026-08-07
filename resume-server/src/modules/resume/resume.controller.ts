import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { MigrationResumeDto, UpdateResumeDto } from './dto/update-resume.dto';
import { Api } from '@/decorator/api.decorator';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@/decorator/user.decorators';
import {
  ResumeDetailVO,
  ResumeItemVO,
  ResumeListVO,
} from '@/modules/resume/vo/resume.vo';
import {
  PreviewResumeDto,
  QueryResumeDto,
} from '@/modules/resume/dto/query-resume.dto';
import { errorHandler } from '@/utils/prisma-utils';
import { NotLogin } from '@/decorator/auth.decorators';
import { AuthUser } from '@/decorator/interface';
import { TemplateService } from '@/modules/template/template.service';
import { RolesEnums } from '@/constants/enums';
import { EmailService } from '@/modules/email/email.service';
import { FastifyRequest } from 'fastify';
import { aesEncrypt } from '@/utils/resume-utils';
import { ConfigService } from '@/modules/config/config.service';
import { Throttle } from '@nestjs/throttler';
import { VipService } from '@/modules/vip/vip.service';
import dayjs from 'dayjs';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(TemplateService)
  private templateService: TemplateService;

  @Inject(EmailService)
  private mailServer: EmailService;

  @Inject(VipService)
  private vipServer: VipService;

  @Post('/create')
  @Api({
    summary: '创建简历',
    reqType: CreateResumeDto,
    resType: Number,
  })
  async createResume(
    @Body() createResumeDto: CreateResumeDto,
    @User() user: AuthUser,
  ) {
    if (user.roles.includes(RolesEnums.User)) {
      const count = await this.resumeService.getCountByUserId(user.id);
      if (count >= 10) {
        throw new HttpException(
          '每人最多创建 10 份简历，可删除无用的简历。',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    const data = await this.resumeService.create(createResumeDto, user.id);
    await this.templateService.updateUseCount(createResumeDto.templateCode);
    return data.id;
  }

  @Post('/update')
  @Api({
    summary: '更新我的简历',
    reqType: UpdateResumeDto,
  })
  async updateResume(
    @User() user: AuthUser,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    if (updateResumeDto.dataTmp && user.roles.includes(RolesEnums.User)) {
      throw new HttpException('无权更新为内容模板', HttpStatus.BAD_REQUEST);
    }
    const resume = await this.resumeService
      .update(user.id, updateResumeDto)
      .catch(errorHandler);
    if (resume) return null;
  }

  @Post('/info/:id')
  @Api({
    summary: '获取我的简历详情',
    resType: ResumeDetailVO,
  })
  async getResumeInfo(
    @Param('id', ParseIntPipe) id: number,
    @User() user: AuthUser,
  ) {
    const resume = await this.resumeService
      .findOne({
        id,
        userId: user.id,
      })
      .catch(errorHandler);
    if (!resume) {
      throw new HttpException('未找到该简历', HttpStatus.BAD_REQUEST);
    }
    return resume;
  }

  @Post('/data-tmp/:id')
  @NotLogin()
  @Api({
    summary: '获取我的简历详情',
    resType: ResumeDetailVO,
  })
  async getResumeTmpInfo(@Param('id', ParseIntPipe) id: number) {
    const resume = await this.resumeService
      .findOne({
        id,
        dataTmp: 1,
      })
      .catch(errorHandler);
    if (!resume) {
      throw new HttpException('未找到该内容模板', HttpStatus.BAD_REQUEST);
    }
    return resume;
  }

  @Post('/copy/:id')
  @Api({
    summary: '制作简历副本',
    resType: Number,
  })
  async copyResume(
    @Param('id', ParseIntPipe) id: number,
    @User() user: AuthUser,
  ) {
    // 普通用户只能创建 10份简历
    if (user.roles.includes(RolesEnums.User)) {
      const count = await this.resumeService.getCountByUserId(user.id);
      if (count >= 10) {
        throw new HttpException(
          '每人最多创建 10 份简历，请删除无用简历。',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    try {
      const resume = await this.resumeService.findOne({
        id,
        userId: user.id,
      });
      const title = resume.title + '-副本';
      resume.content['title'] = title;
      const res = await this.resumeService.create(
        {
          title,
          content: resume.content,
          templateCode: resume.templateCode,
        },
        user.id,
      );
      await this.templateService.updateUseCount(resume.templateCode);
      return res.id;
    } catch {
      throw new HttpException('未找到该简历', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/preview')
  @NotLogin()
  @Api({
    summary: '简历预览',
    reqType: PreviewResumeDto,
    resType: ResumeItemVO,
  })
  async previewResume(@Body() body: PreviewResumeDto, @User() user: AuthUser) {
    const resume = await this.resumeService.findOne({ id: +body.id });
    if (!resume) {
      throw new HttpException('未找到该简历', HttpStatus.BAD_REQUEST);
    }
    if (user?.roles.includes(RolesEnums.SuperAdmin)) {
      return resume;
    }
    if (resume.userId === user?.id || body.code === resume.accessCode) {
      // 自己或正确的授权码都可访问
      return resume;
    }
    throw new ForbiddenException('无权查看');
  }

  @Post('/remove/:id')
  @Api({
    summary: '删除我的简历',
  })
  async removeResume(@Param('id') id: number, @User() user: AuthUser) {
    const resume = await this.resumeService.findOne({ id });
    if (!resume) {
      throw new HttpException('未找到该简历', HttpStatus.BAD_REQUEST);
    }
    if (resume.dataTmp === 1) {
      throw new HttpException('内容模板无法删除', HttpStatus.BAD_REQUEST);
    }
    return this.resumeService.remove(id, user.id).catch(errorHandler);
  }

  @Post('/access-code/:id')
  @Api({
    summary: '生成简历分享授权码',
  })
  async genResumeAccessCode(@Param('id') id: number, @User() user: AuthUser) {
    const code = Math.random().toString().slice(2, 10);
    await this.resumeService
      .update(user.id, {
        id,
        accessCode: code,
      })
      .catch(errorHandler);
    return code;
  }

  @Post('/list')
  @Api({
    summary: '我的简历列表',
    reqType: QueryResumeDto,
    resType: ResumeListVO,
  })
  getResumeList(@User() user: AuthUser, @Body() query: QueryResumeDto) {
    return this.resumeService.findAll({
      ...query,
      userId: user.id,
    });
  }

  @Get('count')
  @NotLogin()
  @Api({ summary: '获取生成的简历数', resType: Number })
  getResumeCount() {
    return this.templateService.getUseCountSum();
  }

  @Post('migration')
  @Api({
    summary: '简历数据简历，只能从邮箱到小程序登录',
    reqType: MigrationResumeDto,
  })
  async dataMigration(
    @User() user: AuthUser,
    @Body() data: MigrationResumeDto,
  ) {
    const emailCodeData = await this.mailServer.getEmailCode(data.email);
    if (!emailCodeData) {
      throw new BadRequestException('验证码不存在');
    }
    if (emailCodeData.code !== data.code) {
      throw new BadRequestException('验证码错误');
    }
    await this.mailServer.delEmailCode(data.email);
    return this.resumeService.syncDataForUpdate(user, data);
  }

  @Get('pdf/:id')
  @Throttle({ max: { limit: 1, ttl: 1000 } })
  @Api({ summary: '获取简历导出的授权code' })
  async exportPDF(
    @Req() req: FastifyRequest,
    @User() user: AuthUser,
    @Param('id') id: number,
  ) {
    // 是否开通会员
    if (this.configService.get('EXPORT_PDF_VIP_CHECK_ENABLED') === 'True') {
      const vip = await this.vipServer.findOne(user.id);
      if (!vip) {
        throw new HttpException('请先开通会员', HttpStatus.BAD_REQUEST);
      }
      // 会员是否过期
      if (dayjs(vip.expireTime).isBefore(dayjs())) {
        throw new HttpException('您的会员已过期', HttpStatus.BAD_REQUEST);
      }
    }
    if (!id) {
      throw new HttpException('简历 id 不能为空', HttpStatus.BAD_REQUEST);
    }
    const resume: any = await this.resumeService.findOne({
      id: +id,
      userId: user.id,
    });
    if (!resume) {
      throw new HttpException('未找到该简历', HttpStatus.BAD_REQUEST);
    }
    const authCode = aesEncrypt(
      JSON.stringify({
        resumeId: id,
        token: req.headers[this.configService.get('JWT_AUTH_KEY')],
        margin: resume.content.margin,
      }),
      this.configService.get('AES_KEY'),
      this.configService.get('AES_IV'),
    );
    return encodeURIComponent(authCode);
  }
}
