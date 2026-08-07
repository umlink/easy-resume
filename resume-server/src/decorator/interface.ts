import { RolesEnums } from '@/constants/enums';

export interface AuthUser {
  id: number;
  username: string;
  avatar: string;
  email: string;
  roles: RolesEnums[];
}
