import { Router } from 'express';
import authRouter from './auth.route';
import chatRouter from './chat.route';
import syncRouter from './sync.route';
import userRouter from './user.route';

const apiRouter: Router = Router();

apiRouter.use('/sync', syncRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/chat', chatRouter);

export default apiRouter;
