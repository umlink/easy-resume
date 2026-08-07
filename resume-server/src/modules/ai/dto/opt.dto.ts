import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NewSseTaskReq {
  @IsString()
  @ApiProperty()
  content: string;
}

export class OptModuleReqDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsString()
  @ApiProperty()
  content: string;
}
