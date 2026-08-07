import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TemplateService } from './template.service';
import { NotLogin } from '@/decorator/auth.decorators';
import { Api } from '@/decorator/api.decorator';
import {
  TemplateItemVO,
  TemplateListVo,
} from '@/modules/template/vo/template.vo';
import { ApiTags } from '@nestjs/swagger';
import { TemplateQueryDto } from '@/modules/template/dto/query-template.dto';
import { RequiredRoles } from '@/decorator/roles.decorator';
import { RolesEnums } from '@/constants/enums';
import { CreateTemplateDto } from '@/modules/template/dto/create-template.dto';
import { User } from '@/decorator/user.decorators';
import { AuthUser } from '@/decorator/interface';
import { errorHandler } from '@/utils/prisma-utils';
import { UpdateTemplateDto } from '@/modules/template/dto/update-template.dto';

@ApiTags('Template')
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post('/list')
  @NotLogin()
  @Api({
    summary: '获取所有建立模板列表',
    reqType: TemplateQueryDto,
    resType: TemplateListVo,
  })
  getTemplateList(@Body() query: TemplateQueryDto) {
    return this.templateService.findAll(query);
  }

  @Post('/tags')
  @NotLogin()
  @Api({
    summary: '获取简历模板标签',
    resType: Array,
  })
  async getTemplateTags() {
    const list = await this.templateService.findTags();
    return [...new Set([].concat(...list.map((item) => item.tags)))];
  }

  @Post('/info/:code')
  @NotLogin()
  @Api({ summary: '简历模板详情', resType: TemplateItemVO })
  getTemplateInfo(@Param('code') code: string) {
    return this.templateService.findOne(code);
  }

  @Post('/create')
  @RequiredRoles(RolesEnums.Admin, RolesEnums.SuperAdmin)
  @Api({ summary: '创建简历模板', reqType: CreateTemplateDto })
  async createTemplate(
    @Body() data: CreateTemplateDto,
    @User() user: AuthUser,
  ) {
    await this.templateService.create(data, user.id).catch(errorHandler);
    return null;
  }

  @Post('/update/:code')
  @RequiredRoles(RolesEnums.Admin, RolesEnums.SuperAdmin)
  @Api({ summary: '更新简历模板', reqType: UpdateTemplateDto })
  async updateTemplate(
    @Body() data: UpdateTemplateDto,
    @Param('code') code: string,
  ) {
    await this.templateService.update(code, data).catch(errorHandler);
    return null;
  }

  @Get('/refresh-data')
  @NotLogin()
  @RequiredRoles(RolesEnums.Admin, RolesEnums.SuperAdmin)
  // @Api({ summary: '刷新数据' })
  async refreshTemplate() {
    const titleModeMap: Record<string, string> = {
      No240712: 'ET1',
      No240713: 'ET1',
      No240714: 'ET5',
      No240715: 'ET1',
      No240716: 'ET3',
      No240720: 'ET3',
      No240721: 'ET5',
      No240725: 'ET5',
      No240727: 'ET2',
      No240816: 'ET4',
      No240817: 'ET1',
    };
    const list: any = await this.templateService.refreshFindAll();
    list.forEach((item) => {
      const config = item.content.config;
      item.content.config = {
        ...config,
        entryTitleMode: config.entryTitleMode || titleModeMap[item.code],
        entryTitleTheme: config.entryTitleTheme ?? true,
        entryTitleSize: config.entryTitleSize || 16,
      };
      this.templateService.refreshUpdate(item).then((res) => {
        console.log(res);
      });
    });
  }
}
