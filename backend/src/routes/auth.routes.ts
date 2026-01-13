import { Router } from "express";
import { signupController } from "../controllers/signup.controller.js";
import { signinController } from "../controllers/signin.controller.js";
import { logoutController } from "../controllers/logout.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

export const authRouter=Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", signinController);
authRouter.post("/logout", protectRoute, logoutController);