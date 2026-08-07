import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class VipTypeItemVo {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  equity: Prisma.JsonValue;
  @ApiProperty()
  price: number;
  @ApiProperty()
  optTokens: number;
  @ApiProperty()
  checkCount: number;
  @ApiProperty()
  originalPrice: number;
  @ApiProperty()
  duration: number;
}
