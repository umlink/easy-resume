import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { TemplateModule } from '@/modules/template/template.module';
import { EmailModule } from '@/modules/email/email.module';
import { UsersModule } from '@/modules/users/users.module';
import { VipModule } from '@/modules/vip/vip.module';

@Module({
  imports: [TemplateModule, EmailModule, UsersModule, VipModule],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
