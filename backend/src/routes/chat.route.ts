import { Router } from 'express';
import {
  createChatController,
  getChatsByMsgIdController,
  updateChatStatusController,
} from '../controllers/chat.controller';
import { authRequiredMiddleware } from '../middlewares/auth.middleware';

const chatRouter: Router = Router();

chatRouter
  .route('/msg/:id')
  .post(authRequiredMiddleware, createChatController)
  .get(authRequiredMiddleware, getChatsByMsgIdController);

chatRouter
  .route('/status')
  .patch(authRequiredMiddleware, updateChatStatusController);

export default chatRouter;
