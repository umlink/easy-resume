import { Module } from '@nestjs/common';
import { PuppeteerController } from './puppeteer.controller';
import { PuppeteerService } from './puppeteer.service';
import { ResumeModule } from '@/modules/resume/resume.module';

@Module({
  imports: [ResumeModule],
  controllers: [PuppeteerController],
  providers: [PuppeteerService],
  exports: [PuppeteerService],
})
export class PuppeteerModule {}
