import { PartialType } from '@nestjs/swagger';
import { CreateTemplateDto } from '@/modules/template/dto/create-template.dto';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {}
