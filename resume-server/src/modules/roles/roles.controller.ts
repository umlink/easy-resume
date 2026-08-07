import { Controller } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Rules')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
}
