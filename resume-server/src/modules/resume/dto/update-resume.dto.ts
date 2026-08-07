import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateResumeDto } from './create-resume.dto';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateResumeDto extends PartialType(CreateResumeDto) {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsOptional()
  @ApiProperty({ required: false })
  accessCode?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  dataTmp?: number;
}

export class MigrationResumeDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @Length(6, 6)
  @ApiProperty()
  code: string;
}
