import type { RequestHandler } from 'express';
import type { ObjectSchema } from 'joi';
import type { ChatType } from '../@types/chat.types';
import type { ResType } from '../@types/res.types';
import { STATUS } from '../constants/status.constants';
import { ForbiddenError, NotFoundError, ValueError } from '../error/app.error';
import logger from '../logger/log';
import { createChatSchema } from '../schemas/chat.schema';
import { createChat, findChatsByMsgId } from '../services/chat.service';
import { findMsgByID } from '../services/msg.service';
import { formatJoiError, validateJoi } from '../utils/joi';
import { userRequired } from '../utils/user';

const createChatController: RequestHandler = async (req, res) => {
  const user = userRequired(req);

  const { warning, error, value } = validateJoi(
    createChatSchema as unknown as ObjectSchema<ChatType>,
    req.body
  );

  if (warning) {
    logger.warn(formatJoiError(warning), 'WARNING in register!');
  }

  if (error) {
    const _error = formatJoiError(error);
    console.error(_error, 'ERROR!: in register');
    throw new ValueError(error.message);
  }

  const msgId = req.params.id as string;

  // todo! cache ?
  const msg = await findMsgByID(msgId);

  if (!msg) {
    throw new NotFoundError('Msg not found!');
  }
  if ('error' in msg) {
    logger.error(msg.error, 'ERROR finding msg in "createChatController"');
    throw new NotFoundError('Msg not found!');
  }

  if (!msg.users.includes(user.sub)) {
    throw new ForbiddenError('You are not in the chat!');
  }

  const chat = await createChat({
    ...value,
    msgId,
    sender: user.sub,
  });

  if (!chat) {
    throw new NotFoundError('something went wrong!');
  }
  if ('error' in chat) {
    logger.error(chat.error, 'ERROR creating chat in  "createChatController"');
    throw new NotFoundError('some error happeden!');
  }

  res.status(STATUS.CREATED).json({
    success: true,
    data: {
      chat,
    },
  } satisfies ResType);
};

const getChatsByMsgIdController: RequestHandler = async (req, res) => {
  const user = userRequired(req);

  const msgId = req.params.id as string;

  // todo! cache ?
  const msg = await findMsgByID(msgId);

  if (!msg) {
    throw new NotFoundError('Msg not found!');
  }
  if ('error' in msg) {
    logger.error(msg.error, 'ERROR finding msg in "createChatController"');
    throw new NotFoundError('Msg not found!');
  }

  if (!msg.users.includes(user.sub)) {
    throw new ForbiddenError('You are not in the chat!');
  }

  const chats = await findChatsByMsgId(msgId);

  res.status(STATUS.OK).json({
    success: true,
    data: {
      chats,
    },
  } satisfies ResType);
};

export { createChatController, getChatsByMsgIdController };
