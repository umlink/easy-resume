import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailCodeLoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @Length(6, 6)
  @ApiProperty()
  code: string;
}

export class MpCodeLoginDto {
  @IsString()
  @ApiProperty()
  code: string;

  @IsString()
  @ApiProperty()
  verifyCode: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  inviteCode?: string;
}

export class QueryMpQrCodeReqDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  inviteCode?: string;
}

export class MpCodeAutoLoginDto {
  @IsString()
  @ApiProperty()
  code: string;
}

export class LoopLoginReqDto {
  @IsString()
  @ApiProperty()
  verifyCode: string;
}

export class EmailPwdLoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MaxLength(32)
  @ApiProperty()
  password: string;
}

export class ResetEmailPwdDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MaxLength(32)
  @ApiProperty()
  password: string;

  @IsString()
  @Length(6, 6)
  @ApiProperty()
  code: string;
}
