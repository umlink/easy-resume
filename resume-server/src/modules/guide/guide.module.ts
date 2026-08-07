import { Module } from '@nestjs/common';
import { GuideController } from '@/modules/guide/guide.controller';
import { GuideService } from '@/modules/guide/guide.service';

@Module({
  imports: [],
  controllers: [GuideController],
  providers: [GuideService],
})
export class GuideModule {}
