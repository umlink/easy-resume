import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SearchOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  status: number;
}
