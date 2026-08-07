import { ApiProperty } from '@nestjs/swagger';

export class LoginResVo {
  @ApiProperty({ description: 'jwt token' })
  accessToken: string;
  @ApiProperty({ description: '是否是新用户' })
  isRegister: boolean;
}

export class QueryMpQrCodeResVo {
  @ApiProperty()
  imgUrl: string;

  @ApiProperty()
  verifyCode: number;
}
