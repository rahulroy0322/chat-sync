import type { ErrorRequestHandler } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import type { ResType } from '../@types/res.types';
import { isDev } from '../config/env.config';
import {
  type AppError,
  ServerError,
  UnauthorizedError,
} from '../error/app.error';
import logger from '../logger/log';

const errorMiddleware: ErrorRequestHandler = (e, _req, res, _next) => {
  let _err = e as AppError;

  if (!(e instanceof Error)) {
    logger.warn(
      {
        e,
      },
      'Some error is not handled properly!'
    );
    _err = new ServerError();
  } else if (e instanceof JsonWebTokenError) {
    _err = new UnauthorizedError('Invalid Jwt!');
  } else if (e instanceof TokenExpiredError) {
    _err = new UnauthorizedError('Jwt Token Expired!');
  }

  if (!isDev) {
    logger.info(_err, 'remove extra from error');
    delete _err.stack;
  }

  res.status(_err.status).json({
    success: false,
    error: {
      ..._err,
      message: _err.message,
    } satisfies AppError,
  } satisfies ResType);
};

export { errorMiddleware };
