import { getConversations } from '../controllers/conversation.controllers.js';
import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

export const conversationRouter=Router();

conversationRouter.get("/", protectRoute, getConversations);