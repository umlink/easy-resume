import { SetMetadata } from '@nestjs/common';

export const IS_VIP_KEY = 'required-vip';
export const RequiredVip = () => SetMetadata(IS_VIP_KEY, true);
