import type { UserType } from './user.types';

type AccessTokenUserType = Pick<UserType, 'avatarUrl' | 'email' | 'uname'> &
  RefreshTokenUserType;

type RefreshTokenUserType = {
  sub: string;
};

export type { RefreshTokenUserType, AccessTokenUserType };
