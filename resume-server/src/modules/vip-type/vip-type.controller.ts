import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VipTypeService } from './vip-type.service';
import { CreateVipTypeDto } from './dto/create-vip-type.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateVipTypeDto } from '@/modules/vip-type/dto/update-vip-type.dto';
import { Api } from '@/decorator/api.decorator';
import { errorHandler } from '@/utils/prisma-utils';
import { RequiredRoles } from '@/decorator/roles.decorator';
import { RolesEnums } from '@/constants/enums';
import { NotLogin } from '@/decorator/auth.decorators';
import { VipTypeItemVo } from '@/modules/vip-type/vo/vip-type.vo';

@ApiTags('VipType')
@Controller('vip-type')
export class VipTypeController {
  constructor(private readonly vipTypeService: VipTypeService) {}

  @Post('create')
  @Api({
    summary: '创建会员类型',
    reqType: CreateVipTypeDto,
  })
  @RequiredRoles(RolesEnums.SuperAdmin)
  createVipType(@Body() createVipTypeDto: CreateVipTypeDto) {
    return this.vipTypeService.create(createVipTypeDto);
  }

  @Post('/update/:id')
  @Api({
    summary: '更新会员类型',
    reqType: UpdateVipTypeDto,
    resType: String,
  })
  @RequiredRoles(RolesEnums.SuperAdmin)
  async updateVipType(@Param('id') id: number, @Body() data: UpdateVipTypeDto) {
    await this.vipTypeService.update(id, data).catch(errorHandler);
    return null;
  }

  @Get('/list')
  @NotLogin()
  @Api({
    summary: '获取所有会员类型-只返回售卖类型',
    resType: VipTypeItemVo,
    resIsArray: true,
  })
  async getVipTypeList() {
    return this.vipTypeService.findAll();
  }
}
