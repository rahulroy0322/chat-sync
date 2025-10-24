import type { RequestHandler } from 'express';
import type { ObjectSchema } from 'joi';
import type { ChatType } from '../@types/chat.types';
import type { ResType } from '../@types/res.types';
import { STATUS } from '../constants/status.constants';
import { NotFoundError, ValueError } from '../error/app.error';
import logger from '../logger/log';
import { createChatSchema, updateChatsSchema } from '../schemas/chat.schema';
import {
  createChat,
  findChats,
  updateChats,
} from '../services/chat.service';
import { formatJoiError, validateJoi } from '../utils/joi';
import { userRequired } from '../utils/user';
import { Types } from 'mongoose';
import { findUsers } from '../services/user.service';

const createChatController: RequestHandler = async (req, res) => {
  const user = userRequired(req);

  const { warning, error, value } = validateJoi(
    createChatSchema as unknown as ObjectSchema<ChatType>,
    req.body
  );

  if (warning) {
    logger.warn(formatJoiError(warning), 'WARNING in createChatController!');
  }

  if (error) {
    const _error = formatJoiError(error);
    console.error(_error, 'ERROR!: in createChatController');
    throw new ValueError(error.message);
  }

  const chat = await createChat({
    ...value,
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

const getChatsController: RequestHandler = async (req, res) => {
  const user = userRequired(req);

  const _id = new Types.ObjectId(user.sub);

  const chats = await findChats({
    $or: [
      {
        sender: _id,
      },
      {
        receiver: _id,
      },
    ],
  });


  if (!chats) {
    throw new NotFoundError('something went wrong!');
  }

  if ('error' in chats) {
    logger.error(chats.error, 'ERROR creating chat in "getChatsController"');
    throw new NotFoundError('some error happeden!');
  }
  const users = await findUsers({
    _id: {
      $in: [
        ...new Set(
          chats.map(({ receiver, sender }) =>
            receiver === user.sub ? sender : receiver
          )
        ),
      ].map((id) => new Types.ObjectId(id)),
    },
  });

  if (!users) {
    throw new NotFoundError('something went wrong!');
  }
  if ('error' in users) {
    logger.error(users.error, 'ERROR creating chat in "getChatsController"');
    throw new NotFoundError('some error happeden!');
  }


  res.status(STATUS.OK).json({
    success: true,
    data: {
      chats,
      users,
    },
  } satisfies ResType);
};

const updateChatsController: RequestHandler = async (req, res) => {
  userRequired(req);

  const { warning, error, value } = validateJoi(updateChatsSchema, req.body);

  if (warning) {
    logger.warn(formatJoiError(warning), 'WARNING in updateChatsController!');
  }

  if (error) {
    const _error = formatJoiError(error);
    console.error(_error, 'ERROR!: in updateChatsController');
    throw new ValueError(error.message);
  }

  const chats = await updateChats(value.chats);

  if (!chats || 'error' in chats) {
    logger.error(
      chats?.error ?? null,
      'ERROR finding msg in "updateChatsController"'
    );
    throw new NotFoundError('Error updating chat status!');
  }

  res.status(STATUS.CREATED).json({
    success: true,
    data: {
      chats,
    },
  } satisfies ResType);
};
export {
  createChatController,
  updateChatsController,
  getChatsController,
};
