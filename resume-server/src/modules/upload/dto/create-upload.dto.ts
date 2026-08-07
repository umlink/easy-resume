import { ApiProperty } from '@nestjs/swagger';

export class CreateUploadDto {
  @ApiProperty({ type: FormData, description: '上传文件 multipart/form-data' })
  file: FormData;
}
