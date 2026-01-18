import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import { getConversations } from '../controllers/conversation.controllers.js';
import { getMessages, sendMessages } from '../controllers/message.controllers.js';

export const conversationRouter=Router();

conversationRouter.get("/", protectRoute, getConversations);
conversationRouter.get("/:id", protectRoute, getMessages);
conversationRouter.post("/send/:id", protectRoute, sendMessages)