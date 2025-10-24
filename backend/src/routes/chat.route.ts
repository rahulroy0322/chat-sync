import { Router } from 'express';
import {
  createChatController,
  getChatsController,
  updateChatsController,
} from '../controllers/chat.controller';
import { authRequiredMiddleware } from '../middlewares/auth.middleware';

const chatRouter: Router = Router();

chatRouter
  .route('/')
  .post(authRequiredMiddleware, createChatController)
  .get(authRequiredMiddleware, getChatsController)
  .patch(authRequiredMiddleware, updateChatsController);


export default chatRouter;
