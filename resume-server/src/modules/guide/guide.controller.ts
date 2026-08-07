import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { GuideService } from '@/modules/guide/guide.service';
import { Api } from '@/decorator/api.decorator';
import { RequiredRoles } from '@/decorator/roles.decorator';
import { RolesEnums } from '@/constants/enums';
import { CreateGuidDto } from '@/modules/guide/dto/create-guide.dto';
import { UpdateGuideDto } from '@/modules/guide/dto/update-guide.dto';
import { GuideDetailDto, GuideListVO } from '@/modules/guide/vo/guide.vo';
import { GuideQueryDto } from '@/modules/guide/dto/query-guide.dto';
import { genSnowUUId } from '@/utils/id.gen';
import { NotLogin } from '@/decorator/auth.decorators';
import { User } from '@/decorator/user.decorators';
import { AuthUser } from '@/decorator/interface';

@ApiTags('Guide')
@Controller('guide')
export class GuideController {
  @Inject(GuideService)
  private guideService: GuideService;

  @Post('/create')
  @RequiredRoles(RolesEnums.SuperAdmin)
  @Api({ summary: '创建指南', reqType: CreateGuidDto })
  async createGuide(@Body() data: CreateGuidDto) {
    const ret = await this.guideService.create({
      ...data,
      id: genSnowUUId(),
    });
    return ret.id;
  }

  @Post('/update')
  @RequiredRoles(RolesEnums.SuperAdmin)
  @Api({ summary: '更新指南', reqType: UpdateGuideDto })
  updateGuide(@Body() data: UpdateGuideDto) {
    return this.guideService.update(data.id, data);
  }

  @Post('/list')
  @NotLogin()
  @Api({
    summary: '获取所有指南',
    reqType: GuideQueryDto,
    resType: GuideListVO,
  })
  getGuideList(@Body() query: GuideQueryDto) {
    return this.guideService.findAll(query, 1);
  }

  @Post('/draft-list')
  @RequiredRoles(RolesEnums.SuperAdmin)
  @Api({
    summary: '获取所有草稿指南',
    reqType: GuideQueryDto,
    resType: GuideListVO,
  })
  getDraftGuideList(@Body() query: GuideQueryDto) {
    return this.guideService.findAll(query, 0);
  }

  @Post('/detail/:id')
  @NotLogin()
  @Api({ summary: '获取指南详情', resType: GuideDetailDto })
  getGuideDetail(@Param('id') id: number, @User() user: AuthUser) {
    if (!id) throw new BadRequestException('id不合法');
    const where: any = { id, status: 1 };
    if (user && user.roles.includes(RolesEnums.SuperAdmin)) {
      delete where.status;
    }
    return this.guideService.findOne(where);
  }

  @Post('/delete/:id')
  @RequiredRoles(RolesEnums.SuperAdmin)
  @Api({ summary: '删除指南' })
  deleteGuide(@Param('id') id: number) {
    return this.guideService.delete(id);
  }
}
