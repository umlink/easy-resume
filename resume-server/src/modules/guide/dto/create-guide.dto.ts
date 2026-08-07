import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuidDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  content: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  sort: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  status: number;
}
