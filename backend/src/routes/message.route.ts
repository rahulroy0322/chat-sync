import {
  getOrCreateMessagesController,
  getAllMessagesController,
} from "../controllers/message.controller";
import { authRequiredMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";

const messageRouter: Router = Router();

messageRouter.get("/", authRequiredMiddleware, getAllMessagesController);

messageRouter.post("/", authRequiredMiddleware, getOrCreateMessagesController);

export default messageRouter;
