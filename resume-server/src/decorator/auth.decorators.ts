import { SetMetadata } from '@nestjs/common';

export const NOT_LOGIN_KEY = 'not-login';
export const NotLogin = () => SetMetadata(NOT_LOGIN_KEY, true);
