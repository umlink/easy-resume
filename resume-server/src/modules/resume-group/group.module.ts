import { Module } from '@nestjs/common';
import { ResumeGroupController } from '@/modules/resume-group/group.controller';
import { ResumeGroupService } from '@/modules/resume-group/group.service';

@Module({
  controllers: [ResumeGroupController],
  providers: [ResumeGroupService],
})
export class ResumeGroupModule {}
