import type { RequestHandler } from 'express';

import logger from '../logger/log';

const requestInfoMiddleware: RequestHandler = (req, res, next) => {
  const start = Date.now();
  res.once('finish', () => {
    const now = Date.now();

    logger.info(
      `[${req.method.toUpperCase()}] "${req.url}" ${res.statusCode} ${res.get('content-length')} -> (${now - start} ms)`
    );
  });

  next();
};

export { requestInfoMiddleware };
