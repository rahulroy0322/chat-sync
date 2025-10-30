import type { RequestHandler } from 'express';
import type { ResType } from '../@types/res.types';
import { STATUS } from '../constants/status.constants';
import {
  BadRequestError,
  ConflictError,
  ServerError,
  ValueError,
} from '../error/app.error';
import logger from '../logger/log';
import { loginSchema, registerSchema } from '../schemas/auth.schema';
import { singAccessToken, singRefreshToken } from '../services/jwt.service';
import {
  createUser,
  findUserByEmail,
  findUserByID,
  findUserByUserNameOrEmail,
} from '../services/user.service';
import { compare, hash } from '../utils/bcrypt';
import { formatJoiError, validateJoi } from '../utils/joi';
import { userRequired } from '../utils/user';

const registerController: RequestHandler = async (req, res) => {
  const { warning, error, value } = validateJoi(registerSchema, req.body);

  if (warning) {
    logger.warn(formatJoiError(warning), 'WARNING in register!');
  }

  if (error) {
    const _error = formatJoiError(error);
    logger.error(_error, 'ERROR!: in register');
    throw new ValueError(error.message);
  }

  const existsUser = await findUserByUserNameOrEmail(value);

  if (existsUser) {
    if ('error' in existsUser) {
      logger.error(existsUser.error, 'error for checking in register user!');
      throw new ConflictError('UserName or Email already exist!');
    }

    if (existsUser.email === value.email) {
      throw new ConflictError('Email already exist!');
    }
    throw new ConflictError('UserName already exist!');
  }

  const hashedPass = await hash(value.password);

  const _user = await createUser({
    ...value,
    password: hashedPass,
  });

  if (!_user) {
    throw new ServerError();
  }
  if ('error' in _user) {
    throw new BadRequestError(_user.error.message);
  }

  const { password: _, ...user } = _user;

  const refresh = singRefreshToken(_user);
  const access = singAccessToken(_user);

  res.status(STATUS.CREATED).json({
    success: true,
    data: {
      user,
      token: {
        refresh,
        access,
      },
    },
  } satisfies ResType);
};

const loginController: RequestHandler = async (req, res) => {
  const { warning, error, value } = validateJoi(loginSchema, req.body);

  if (warning) {
    logger.warn(formatJoiError(warning), 'WARNING in login!');
  }

  if (error) {
    const _error = formatJoiError(error);
    logger.error(_error, 'ERROR!: in login');
    throw new ValueError(error.message);
  }

  const _user = await findUserByEmail(value);

  if (!_user || 'error' in _user) {
    if ('error' in (_user || {})) {
      logger.error(_user?.error, 'error for checking in login user!');
    }

    throw new BadRequestError('Incorrect Email or Password!');
  }

  const { password, ...user } = _user;

  const isMatched = await compare(value.password, password);
  if (!isMatched) {
    throw new BadRequestError('Incorrect Email or Password!');
  }

  const refresh = singRefreshToken(_user);
  const access = singAccessToken(_user);

  res.status(STATUS.OK).json({
    success: true,
    data: {
      user,
      token: {
        refresh,
        access,
      },
    },
  } satisfies ResType);
};

const refreshTokenController: RequestHandler = async (req, res) => {
  const _user = userRequired(req);

  const user = await findUserByID(_user.sub);

  if (!user) {
    throw new ServerError();
  }
  if ('error' in user) {
    throw new BadRequestError(user.error.message);
  }

  const refresh = singRefreshToken(user);
  const access = singAccessToken(user);

  res.status(STATUS.OK).json({
    success: true,
    data: {
      user,
      token: {
        refresh,
        access,
      },
    },
  } satisfies ResType);
};

export { registerController, loginController, refreshTokenController };
