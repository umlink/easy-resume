import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { VipTypeService } from '@/modules/vip-type/vip-type.service';
import { VipService } from '@/modules/vip/vip.service';
import { HttpModule } from '@nestjs/axios';
import { InviteModule } from '@/modules/invite/invite.module';

@Module({
  imports: [HttpModule, InviteModule],
  controllers: [OrderController],
  providers: [OrderService, VipTypeService, VipService],
  exports: [OrderService],
})
export class OrderModule {}
