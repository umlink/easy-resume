import { Module } from '@nestjs/common';
import { ResumeModule } from '@/modules/resume/resume.module';
import { AIController } from '@/modules/ai/ai.controller';
import { BaiduAiService } from '@/modules/ai/bd.service';
import { XunFeiAiService } from '@/modules/ai/xf.service';
import { KimiAiService } from '@/modules/ai/kimi.service';
import { DeepSeekService } from '@/modules/ai/deepseek.service';
import { AiService } from '@/modules/ai/ai.service';
import { VipModule } from '@/modules/vip/vip.module';

@Module({
  imports: [ResumeModule, VipModule],
  controllers: [AIController],
  providers: [
    AiService,
    BaiduAiService,
    XunFeiAiService,
    KimiAiService,
    DeepSeekService,
  ],
})
export class AiModule {}
