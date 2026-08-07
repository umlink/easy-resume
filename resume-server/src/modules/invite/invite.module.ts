import { Module } from '@nestjs/common';
import { InviteController } from '@/modules/invite/invite.controller';
import { InviteService } from '@/modules/invite/invite.service';

@Module({
  imports: [],
  controllers: [InviteController],
  providers: [InviteService],
  exports: [InviteService],
})
export class InviteModule {}
