import type {
  AccessTokenUserType,
  RefreshTokenUserType,
} from '../@types/jwt.types';
import type { UserType } from '../@types/user.types';
import { sing } from '../utils/jwt';

const singAccessToken = ({ _id, avatarUrl, email, uname }: UserType) =>
  sing(
    {
      sub: _id,
      avatarUrl,
      email,
      uname,
    } satisfies AccessTokenUserType,
    {
      expiresIn: '5m',
    }
  );

const singRefreshToken = (user: UserType) =>
  sing(
    {
      sub: user._id,
    } satisfies RefreshTokenUserType,
    {
      expiresIn: '7D',
    }
  );

export { singAccessToken, singRefreshToken };
