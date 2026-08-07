import { ApiProperty } from '@nestjs/swagger';

export class GuideItemVO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
}

export class GuideDetailDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  sort: number;
  @ApiProperty()
  status: number;
}

export class GuideListVO {
  @ApiProperty({ type: GuideItemVO, isArray: true })
  list: GuideItemVO[];
  @ApiProperty()
  total: number;
  @ApiProperty()
  pageNum: number;
  @ApiProperty()
  pageSize: number;
}
