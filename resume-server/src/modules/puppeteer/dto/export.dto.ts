import { ApiProperty } from '@nestjs/swagger';

export class ExportPdfDto {
  @ApiProperty()
  url: string;
}

export class GenPdfDto {
  url: string;
  token?: string;
  waitTime?: number;
  margin?: any;
}
