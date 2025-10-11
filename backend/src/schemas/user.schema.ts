import J from 'joi';
import type {
  AccessTokenUserType,
  RefreshTokenUserType,
} from '../@types/jwt.types';

const str = J.string();

const accessTokenUserSchema = J.object<AccessTokenUserType>({
  sub: str.required(),
  avatarUrl: str.optional(),
  email: str.required(),
  uname: str.required(),
});

const refreshTokenUserSchema = J.object<RefreshTokenUserType>({
  sub: str.required(),
});

export { accessTokenUserSchema, refreshTokenUserSchema };
