import { Router } from 'express';
import { profileController } from '../controllers/user.controller';
import { authRequiredMiddleware } from '../middlewares/auth.middleware';

const userRouter: Router = Router();

userRouter.get('/profile', authRequiredMiddleware, profileController);

export default userRouter;
