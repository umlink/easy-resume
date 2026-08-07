import { ApiProperty } from '@nestjs/swagger';

export class TemplateItemVO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: JSON;
  @ApiProperty()
  headerImg: string;
  @ApiProperty()
  isVip: number;
  @ApiProperty({ type: String, isArray: true })
  tags: string[];
  @ApiProperty()
  useCount: number;
}

export class TemplateListVo {
  @ApiProperty({ type: TemplateItemVO, isArray: true })
  list: TemplateItemVO[];
  @ApiProperty()
  total: number;
  @ApiProperty()
  pageNum: number;
  @ApiProperty()
  pageSize: number;
}
