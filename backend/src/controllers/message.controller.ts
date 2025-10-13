import type { RequestHandler } from 'express';
import type { ResType } from '../@types/res.types';
import { STATUS } from '../constants/status.constants';
import { ServerError, ValueError } from '../error/app.error';
import logger from '../logger/log';
import { createMsgSchema } from '../schemas/msg.schema';
import { findMsgsByUId, findOrCreateMsg } from '../services/msg.service';
import { formatJoiError, validateJoi } from '../utils/joi';
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

const getOrCreateMessagesController: RequestHandler = async (req, res) => {
  const user = userRequired(req);

  const { warning, error, value } = validateJoi(createMsgSchema, req.body);

  if (warning) {
    logger.warn(
      formatJoiError(warning),
      'WARNING in getOrCreateMessagesController!'
    );
  }

  if (error) {
    const _error = formatJoiError(error);
    console.error(_error, 'ERROR!: in getOrCreateMessagesController');
    throw new ValueError(error.message);
  }

  const data = await findOrCreateMsg(user.sub, value.uid);

  if (!data || 'error' in data) {
    logger.error(
      data?.error,
      'ERROR finding msgs in "getOrCreateMessagesController"'
    );
    throw new ServerError();
  }

  res.status(data.status === 'created' ? STATUS.CREATED : STATUS.OK).json({
    success: true,
    data: {
      message: data.data,
    },
  } satisfies ResType);
};

export { getAllMessagesController, getOrCreateMessagesController };
