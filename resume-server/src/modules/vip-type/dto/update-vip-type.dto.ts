import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVipTypeDto } from './create-vip-type.dto';

export class UpdateVipTypeDto extends PartialType(CreateVipTypeDto) {
  @ApiProperty({ description: '启用禁用：1/0' })
  disabled?: number;
}
