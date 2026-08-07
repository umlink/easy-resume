import { PartialType } from '@nestjs/swagger';
import { CreateVipDto } from './create-vip.dto';

export class UpdateVipDto extends PartialType(CreateVipDto) {}
