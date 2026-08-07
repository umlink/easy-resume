import { ApiProperty } from '@nestjs/swagger';

export class VipInfoVO {
  @ApiProperty()
  userId: number;
  @ApiProperty()
  vipTypeId: number;
  @ApiProperty()
  optTokens: number;
  @ApiProperty()
  checkCount: number;
  @ApiProperty()
  startTime: string;
  @ApiProperty()
  expireTime: string;
}
