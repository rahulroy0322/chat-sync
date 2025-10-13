import { Router } from 'express';
import {
  allUsersController,
  profileController,
} from '../controllers/user.controller';
import { authRequiredMiddleware } from '../middlewares/auth.middleware';

const userRouter: Router = Router();

userRouter.get('/', authRequiredMiddleware, allUsersController);
userRouter.get('/profile', authRequiredMiddleware, profileController);

export default userRouter;
