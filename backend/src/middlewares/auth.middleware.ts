import type { Request, RequestHandler } from 'express';
import { UnauthorizedError } from '../error/app.error';
import logger from '../logger/log';
import { accessTokenUserSchema } from '../schemas/user.schema';
import { formatJoiError, validateJoi } from '../utils/joi';
import { verify } from '../utils/jwt';

const getToken = (req: Request): string => {
  const headers = req.headers;

  return (
    ((headers.Authorization ||
      headers.authorization ||
      headers.token ||
      headers['api-token'] ||
      headers['x-api-token']) as string) || ''
  );
};

const authRequiredMiddleware: RequestHandler = (req, _, next) => {
  const token = getToken(req).split(' ')[1];

  if (!token) {
    throw new UnauthorizedError();
  }

  const data = verify(token);

  const { warning, error, value } = validateJoi(accessTokenUserSchema, data);

  if (warning) {
    logger.warn(
      formatJoiError(warning),
      'WARNING in auth required middleware!'
    );
  }

  if (error) {
    const _error = formatJoiError(error);
    console.error(_error, 'ERROR!: in auth required middleware');
    throw new UnauthorizedError('invalid token senr!');
  }

  req.user = value;

  next();
};

export { authRequiredMiddleware };
