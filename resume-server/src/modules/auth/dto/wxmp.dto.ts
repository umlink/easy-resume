import { ApiProperty } from '@nestjs/swagger';

export class QueryMpQrCodeDto {
  @ApiProperty()
  imgUrl: string;

  @ApiProperty()
  verifyCode: number;
}
