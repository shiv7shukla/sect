import { Router } from "express";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
import { logoutController, signinController, signupController } from '../controllers/auth.controllers.js';

export const authRouter=Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", signinController);
authRouter.post("/logout", protectRoute, logoutController);