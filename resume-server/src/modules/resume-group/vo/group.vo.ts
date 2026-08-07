import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class ResumeGroupItem {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  key: string;
  @ApiProperty()
  icon: string;
  @ApiProperty()
  sort: number;
  @ApiProperty()
  types: Prisma.JsonValue;
}
