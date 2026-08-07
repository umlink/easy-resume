import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProposeDto {
  @IsString()
  @ApiProperty()
  message: string;
}
