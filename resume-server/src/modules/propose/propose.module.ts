import { Module } from '@nestjs/common';
import { EmailModule } from '@/modules/email/email.module';
import { ProposeController } from '@/modules/propose/propose.controller';
import { ProposeService } from '@/modules/propose/propose.service';

@Module({
  imports: [EmailModule],
  controllers: [ProposeController],
  providers: [ProposeService],
})
export class ProposeModule {}
