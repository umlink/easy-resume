import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TemplateQueryDto {
  @IsInt()
  @ApiProperty()
  pageNum: number;

  @IsInt()
  @ApiProperty()
  pageSize: number;

  @IsOptional()
  @ApiProperty({ required: false })
  filter: string;

  @IsOptional()
  @ApiProperty({ required: false, type: String, isArray: true })
  tags?: string[];

  @IsOptional()
  @ApiProperty({ required: false })
  code?: string;
}
