import { Router } from "express";
import { signupController } from "../controllers/signup.controller.js";
import { signinController } from "../controllers/signin.controller.js";
import { logoutController } from "../controllers/logout.controller.js";

export const authRouter=Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", signinController);
authRouter.post("/logout", logoutController);