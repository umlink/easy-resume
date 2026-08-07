import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { VipModule } from '@/modules/vip/vip.module';
import { EmailService } from '@/modules/email/email.service';

@Module({
  imports: [VipModule],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
  exports: [UsersService], // 导出既共享
})
export class UsersModule {}
