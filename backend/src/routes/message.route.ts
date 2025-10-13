import { Router } from 'express';
import {
  getAllMessagesController,
  getOrCreateMessagesController,
} from '../controllers/message.controller';
import { authRequiredMiddleware } from '../middlewares/auth.middleware';

const messageRouter: Router = Router();

messageRouter.get('/', authRequiredMiddleware, getAllMessagesController);

messageRouter.post('/', authRequiredMiddleware, getOrCreateMessagesController);

export default messageRouter;
