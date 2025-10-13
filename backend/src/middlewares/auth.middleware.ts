import type { RequestHandler } from 'express';
import { verifyAccessToken, verifyRefreshToken } from '../services/jwt.service';
import { type GetTokenPropsType, getToken } from '../utils/auth';

const authRequiredMiddleware: RequestHandler = (req, _, next) => {
  const token = getToken(req as GetTokenPropsType).split(' ')[1];

  const { user } = verifyAccessToken(token);

  req.user = user;

  next();
};

const refreshTokenRequiredMiddleware: RequestHandler = (req, _, next) => {
  const token = getToken(req as GetTokenPropsType).split(' ')[1];

  const { user } = verifyRefreshToken(token);

  req.user = user;

  next();
};

export { authRequiredMiddleware, refreshTokenRequiredMiddleware };
