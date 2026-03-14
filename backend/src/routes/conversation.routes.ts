import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import { getMessages, sendMessages } from '../controllers/message.controllers.js';
import { getConversations, searchUsers } from '../controllers/conversation.controllers.js';

export const conversationRouter = Router ();

conversationRouter.get("/", protectRoute, getConversations);
conversationRouter.get("/messages/:id", protectRoute, getMessages);
conversationRouter.post("/send/:receiverId", protectRoute, sendMessages);
conversationRouter.get("/searchUsers", protectRoute, searchUsers);