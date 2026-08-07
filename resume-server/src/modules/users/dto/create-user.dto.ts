import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @Length(2, 10)
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @Length(4, 18)
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  avatar: string;

  @IsEmail({}, { message: '邮箱格式错误' })
  @ApiProperty({ description: '邮箱' })
  email: string;
}

export class RegisterUserDto {
  @IsString()
  @Length(2, 10)
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @Length(6, 32)
  @ApiProperty()
  password: string;
}
