import { SetMetadata } from '@nestjs/common';
import { RolesEnums } from '@/constants/enums';

export const ROLES_KEY = 'required-roles';
export const RequiredRoles = (...roles: RolesEnums[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
