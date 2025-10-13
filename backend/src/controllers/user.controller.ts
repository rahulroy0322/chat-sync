import type { RequestHandler } from 'express';
import type { ResType } from '../@types/res.types';
import { STATUS } from '../constants/status.constants';
import User from '../models/user.model';
import { userRequired } from '../utils/user';

const profileController: RequestHandler = (req, res) => {
  const user = userRequired(req);

  res.status(STATUS.OK).json({
    success: true,
    data: {
      user: {
        _id: user.sub,
        email: user.email,
        uname: user.uname,
        avatarUrl: user.avatarUrl,
      },
    },
  } satisfies ResType);
};

const allUsersController: RequestHandler = async (req, res) => {
  const user = userRequired(req);

  // ! ? TODO
  const users = await User.find({
    _id: {
      $ne: user.sub,
    },
  });

  res.status(STATUS.OK).json({
    success: true,
    data: {
      users,
    },
  } satisfies ResType);
};

export { profileController, allUsersController };
