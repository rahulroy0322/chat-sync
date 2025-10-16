import { Router } from 'express';
import {
  createChatController,
  getChatsByMsgIdController,
  updateChatByIdController,
} from '../controllers/chat.controller';
import { authRequiredMiddleware } from '../middlewares/auth.middleware';

const chatRouter: Router = Router();

chatRouter
  .route('/msg/:id')
  .post(authRequiredMiddleware, createChatController)
  .get(authRequiredMiddleware, getChatsByMsgIdController);

chatRouter
  .route('/msg/:msgId/chat/:chatId')
  .patch(authRequiredMiddleware, updateChatByIdController)
  .put(authRequiredMiddleware, updateChatByIdController);

export default chatRouter;
