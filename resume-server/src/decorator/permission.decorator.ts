import { SetMetadata } from '@nestjs/common';
import { RolesEnums } from '@/constants/enums';

export const PERMISSION_KEY = 'required-permission';
export const RequiredPermission = (roles: RolesEnums[]) =>
  SetMetadata(PERMISSION_KEY, roles);
