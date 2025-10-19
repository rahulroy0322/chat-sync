import type { RequestHandler } from 'express';
import type { ResType } from '../@types/res.types';
import { STATUS } from '../constants/status.constants';
import { NotFoundError } from '../error/app.error';
import logger from '../logger/log';
import { findChats } from '../services/chat.service';
import { findUsers } from '../services/user.service';
import { userRequired } from '../utils/user';

const syncChatsGetController: RequestHandler = async (req, res) => {
  const user = userRequired(req);

  const chats = await findChats({
    $or: [
      {
        sender: user.sub,
      },
      {
        receiver: user.sub,
      },
    ],
  });

  if (!chats) {
    throw new NotFoundError('something went wrong!');
  }
  if ('error' in chats) {
    logger.error(
      chats.error,
      'ERROR fetching chats in "syncChatsGetController"'
    );
    throw new NotFoundError('some error happeden!');
  }

  res.status(STATUS.CREATED).json({
    success: true,
    data: {
      chats,
    },
  } satisfies ResType);
};

// ! TODO sync to forntend saved only
const syncUsersController: RequestHandler = async (req, res) => {
  const user = userRequired(req);

  const users = await findUsers({
    _id: {
      $ne: user.sub,
    },
  });

  if (!users) {
    throw new NotFoundError('something went wrong!');
  }
  if ('error' in users) {
    logger.error(users.error, 'ERROR fetching users in "syncUsersController"');
    throw new NotFoundError('some error happeden!');
  }

  res.status(STATUS.CREATED).json({
    success: true,
    data: {
      users,
    },
  } satisfies ResType);
};

export { syncChatsGetController, syncUsersController };
