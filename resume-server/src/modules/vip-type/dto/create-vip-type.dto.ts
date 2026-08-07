import { IsNumber, IsObject, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '.prisma/client';

export class CreateVipTypeDto {
  @IsString()
  @ApiProperty({ description: 'id' })
  id: number;

  @IsString()
  @ApiProperty({ description: '会员类型标题' })
  title: string;

  @IsString()
  @ApiProperty({ description: '会员介绍' })
  description: string;

  @IsObject()
  @ApiProperty({ description: '权益介绍，json 对象' })
  equity: Prisma.InputJsonValue;

  @IsNumber()
  @ApiProperty({ description: '售价' })
  price: number;

  @ApiProperty({ description: '原价' })
  @IsNumber()
  originalPrice: number;

  @ApiProperty({ description: '有效天数' })
  @IsNumber()
  duration: number;

  @IsString()
  @ApiProperty({ description: '售卖类型', enum: $Enums.vip_type_sell_type })
  sellType: $Enums.vip_type_sell_type;
}
