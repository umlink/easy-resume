import { Module } from '@nestjs/common';
import { VipTypeService } from './vip-type.service';
import { VipTypeController } from './vip-type.controller';

@Module({
  imports: [],
  controllers: [VipTypeController],
  providers: [VipTypeService],
  exports: [VipTypeService],
})
export class VipTypeModule {}
