import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class QueryResumeDto {
  @IsInt()
  @ApiProperty()
  pageNum: number;

  @IsInt()
  @ApiProperty()
  pageSize: number;
}

export class PreviewResumeDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsOptional()
  @ApiProperty({ required: false })
  code?: string;
}
