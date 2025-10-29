import type {
  AccessTokenUserType,
  RefreshTokenUserType,
} from '../@types/jwt.types';
import type { UserType } from '../@types/user.types';
import { UnauthorizedError } from '../error/app.error';
import logger from '../logger/log';
import {
  accessTokenUserSchema,
  refreshTokenUserSchema,
} from '../schemas/user.schema';
import { formatJoiError, validateJoi } from '../utils/joi';
import { sing, verify } from '../utils/jwt';

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

const verifyAccessToken = (
  token: string | undefined
): {
  user: AccessTokenUserType;
} => {
  if (!token) {
    throw new UnauthorizedError();
  }

  const data = verify(token);

  const { warning, error, value } = validateJoi(accessTokenUserSchema, data);

  if (warning) {
    logger.warn(formatJoiError(warning), 'WARNING in verifyAccessToken!');
  }

  if (error) {
    const _error = formatJoiError(error);
    logger.error(_error, 'ERROR!: in verifyAccessToken');
    throw new UnauthorizedError('invalid token send!');
  }

  return {
    user: value,
  };
};

const verifyRefreshToken = (
  token: string | undefined
): {
  user: AccessTokenUserType;
} => {
  if (!token) {
    throw new UnauthorizedError();
  }

  const data = verify(token);

  const { warning, error, value } = validateJoi(refreshTokenUserSchema, data);

  if (warning) {
    logger.warn(formatJoiError(warning), 'WARNING in verifyAccessToken!');
  }

  if (error) {
    const _error = formatJoiError(error);
    logger.error(_error, 'ERROR!: in verifyAccessToken');
    throw new UnauthorizedError('invalid token send!');
  }

  return {
    user: value as AccessTokenUserType,
  };
};

export {
  singAccessToken,
  singRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
