import { Module } from '@nestjs/common';
import { VipService } from './vip.service';
import { VipController } from './vip.controller';
import { InviteService } from '@/modules/invite/invite.service';

@Module({
  imports: [],
  controllers: [VipController],
  providers: [VipService, InviteService],
  exports: [VipService],
})
export class VipModule {}
