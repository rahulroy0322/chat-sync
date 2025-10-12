import type { Request, RequestHandler } from "express";
import { UnauthorizedError } from "../error/app.error";
import logger from "../logger/log";
import { accessTokenUserSchema } from "../schemas/user.schema";
import { formatJoiError, validateJoi } from "../utils/joi";
import { verify } from "../utils/jwt";
import { getToken, type GetTokenPropsType } from "../utils/auth";
import { verifyAccessToken } from "../services/jwt.service";

const authRequiredMiddleware: RequestHandler = (req, _, next) => {
  const token = getToken(req as GetTokenPropsType).split(" ")[1];

  const { user } = verifyAccessToken(token);

  req.user = user;

  next();
};

export { authRequiredMiddleware };
