import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class UpdateResumeGroupDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  icon: string;

  @IsNumber()
  @ApiProperty()
  sort: number;

  @IsArray()
  @ApiProperty({ type: Object, isArray: true })
  types: Prisma.InputJsonArray;
}
