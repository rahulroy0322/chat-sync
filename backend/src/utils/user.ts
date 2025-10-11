import type { Request } from 'express';
import { NotImplementedError } from '../error/app.error';
import logger from '../logger/log';

const userRequired = (req: Request) => {
  if (!req.user) {
    const url = req.url;
    logger.error(`user not present in request at : ${url}`);
    throw new NotImplementedError(`${url} not implemeted yet!`);
  }

  return req.user;
};

export { userRequired };
