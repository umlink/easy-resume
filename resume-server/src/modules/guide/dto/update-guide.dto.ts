import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGuidDto } from './create-guide.dto';
import { IsNumber } from 'class-validator';

export class UpdateGuideDto extends PartialType(CreateGuidDto) {
  @IsNumber()
  @ApiProperty()
  id: number;
}
