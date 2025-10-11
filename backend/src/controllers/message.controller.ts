import type { RequestHandler } from 'express';
import type { ResType } from '../@types/res.types';
import { ServerError } from '../error/app.error';
import logger from '../logger/log';
import { findMsgsByUId } from '../services/msg.service';
import { userRequired } from '../utils/user';

const getAllMessagesController: RequestHandler = async (req, res) => {
  const user = userRequired(req);

  const messages = await findMsgsByUId(user.sub);

  if (!messages || 'error' in messages) {
    logger.error(
      messages?.error,
      'ERROR finding msgs in "getAllMessagesController"'
    );
    throw new ServerError();
  }

  res.json({
    success: true,
    data: {
      messages,
    },
  } satisfies ResType);
};

export { getAllMessagesController };
