import { IsArray, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateTemplateDto {
  @IsString()
  @ApiProperty()
  code: string;

  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  headerImg: string;

  @IsArray()
  @ApiProperty({ type: String, isArray: true })
  tags: string[];

  @IsObject()
  @ApiProperty()
  content: Prisma.InputJsonValue;
}
