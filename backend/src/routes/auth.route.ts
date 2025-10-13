import { Router } from 'express';
import {
  loginController,
  refreshTokenController,
  registerController,
} from '../controllers/auth.controller';
import { refreshTokenRequiredMiddleware } from '../middlewares/auth.middleware';

const authRouter: Router = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get(
  '/refresh',
  refreshTokenRequiredMiddleware,
  refreshTokenController
);

export default authRouter;
