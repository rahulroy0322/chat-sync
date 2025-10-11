import { Router } from 'express';
import {
  createChatController,
  getChatsByMsgIdController,
} from '../controllers/chat.controller';
import { authRequiredMiddleware } from '../middlewares/auth.middleware';

const chatRouter: Router = Router();

chatRouter
  .route('/msg/:id')
  .post(authRequiredMiddleware, createChatController)
  .get(authRequiredMiddleware, getChatsByMsgIdController);

export default chatRouter;
