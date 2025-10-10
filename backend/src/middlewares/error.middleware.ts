import type { ErrorRequestHandler } from 'express';
import { isDev } from '../config/env.config';
import { AppError, ServerError } from '../error/app.error';
import logger from '../logger/log';

const errorMiddleware: ErrorRequestHandler = (
  //? for typescript happy only
  err: AppError,
  _req,
  res,
  _next
) => {
  if (!(err instanceof AppError)) {
    logger.warn(
      {
        err,
      },
      'Some error is not handled properly!'
    );
    err = new ServerError();
  }

  const error: AppError = {
    ...err,
    stack: err.stack,
  };

  if (!isDev) {
    logger.info(error, 'remove extra from error');
    delete error.stack;
  }

  logger.error(error, 'Error happend in the app!');

  res.json({
    success: false,
    error,
  });
};

export { errorMiddleware };
