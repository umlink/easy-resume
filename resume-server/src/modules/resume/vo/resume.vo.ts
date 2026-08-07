import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ResumeDetailVO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: Prisma.JsonValue;
  @ApiProperty()
  templateCode: string;
  @ApiProperty()
  accessCode: string;
  @ApiProperty()
  dataTmp: number;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAt: string;
}

export class ResumeItemVO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: Prisma.JsonValue;
  @ApiProperty()
  templateCode: string;
  @ApiProperty()
  accessCode: string;
  @ApiProperty()
  dataTmp: number;
  @ApiProperty()
  createdAt: string;
  @ApiProperty()
  updatedAt: string;
}

export class ResumeListVO {
  @ApiProperty({ type: ResumeItemVO, isArray: true })
  list: ResumeItemVO[];
  @ApiProperty()
  total: number;
  @ApiProperty()
  pageNum: number;
  @ApiProperty()
  pageSize: number;
}
