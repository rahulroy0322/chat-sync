import type { UserType } from '../@types/user.types';
import { sing } from '../utils/jwt';

const singAccessToken = ({ _id, avatarUrl, email, uname }: UserType) =>
  sing(
    {
      sub: _id,
      avatarUrl,
      email,
      uname,
    },
    {
      expiresIn: '5m',
    }
  );

const singRefreshToken = (user: UserType) =>
  sing(
    {
      sub: user._id,
    },
    {
      expiresIn: '7D',
    }
  );

export { singAccessToken, singRefreshToken };
