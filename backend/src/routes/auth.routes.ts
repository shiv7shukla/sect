import { Router } from "express";
import type { Response, Request } from "express";
import { signupController } from "../controllers/signup.controller.js";
import { signinController } from "../controllers/signin.controller.js";

export const authRouter=Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", signinController);
authRouter.post("/logout", logoutController);