import { Router } from 'express';
import authRouter from './auth.route';
import chatRouter from './chat.route';
import messageRouter from './message.route';
import userRouter from './user.route';

const apiRouter: Router = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/msg', messageRouter);
apiRouter.use('/chat', chatRouter);

export default apiRouter;
