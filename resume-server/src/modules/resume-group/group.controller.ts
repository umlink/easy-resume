import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ResumeGroupService } from '@/modules/resume-group/group.service';
import { Api } from '@/decorator/api.decorator';
import { ResumeGroupItem } from '@/modules/resume-group/vo/group.vo';
import { UpdateResumeGroupDto } from '@/modules/resume-group/dto/update.dto';
import { RequiredRoles } from '@/decorator/roles.decorator';
import { RolesEnums } from '@/constants/enums';
import { NotLogin } from '@/decorator/auth.decorators';

@ApiTags('ResumeGroup')
@Controller('resume-group')
export class ResumeGroupController {
  @Inject(ResumeGroupService)
  private resumeGroupService: ResumeGroupService;

  @Post('/list')
  @NotLogin()
  @Api({
    summary: '获取简历分组列表',
    resType: ResumeGroupItem,
    resIsArray: true,
  })
  getResumeGroupList() {
    return this.resumeGroupService.findAll();
  }

  @Post('/update')
  @Api({
    summary: '更新简历分组&内容模板',
    reqType: UpdateResumeGroupDto,
  })
  @RequiredRoles(RolesEnums.SuperAdmin)
  updateResumeGroup(@Body() data: UpdateResumeGroupDto) {
    return this.resumeGroupService.update(data.id, data);
  }
}
