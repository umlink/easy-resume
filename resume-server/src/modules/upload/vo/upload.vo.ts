import { ApiProperty } from '@nestjs/swagger';

export class UploadQiNiuResVo {
  @ApiProperty()
  filename: string;
  @ApiProperty()
  size: string;
  @ApiProperty()
  url: string;
  @ApiProperty()
  type: string;
}
