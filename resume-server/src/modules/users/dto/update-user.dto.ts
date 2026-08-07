import { IsEmail, IsOptional, Length, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @Length(2, 20, { message: '用户名长度只能为 2-20个字符' })
  @ApiProperty()
  username?: string;

  @IsEmail({}, { message: '邮箱格式错误' })
  @ApiProperty({ description: '邮箱' })
  email: string;

  @IsOptional()
  @ApiProperty({ required: false })
  age?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  avatar?: string;

  @IsOptional()
  @MaxLength(64)
  @ApiProperty({ required: false })
  school?: string;

  @IsOptional()
  @MaxLength(64)
  @ApiProperty({ required: false })
  discipline?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  profession?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  hobby?: string;

  @IsOptional()
  @MaxLength(256)
  @ApiProperty({ required: false })
  introduce?: string;

  @IsOptional()
  @Length(6, 6)
  @ApiProperty({ required: false })
  accessCode?: string;
}
