import type { RequestHandler } from 'express';
import type { ResType } from '../@types/res.types';
import { userRequired } from '../utils/user';

const profileController: RequestHandler = (req, res) => {
  const user = userRequired(req);

  res.json({
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

export { profileController };
