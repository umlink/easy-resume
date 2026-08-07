import { Prisma } from '@prisma/client';
import { IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResumeDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsObject()
  @ApiProperty()
  content: Prisma.InputJsonValue;

  @IsString()
  @ApiProperty()
  templateCode: string;
}
