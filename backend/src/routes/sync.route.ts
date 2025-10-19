import { Router } from 'express';
import {
  syncChatsGetController,
  syncUsersController,
} from '../controllers/sync.controller';
import { authRequiredMiddleware } from '../middlewares/auth.middleware';

const syncRouter: Router = Router();

syncRouter.route('/chat').get(authRequiredMiddleware, syncChatsGetController);

syncRouter.route('/user').get(authRequiredMiddleware, syncUsersController);

export default syncRouter;
