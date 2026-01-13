import { Router } from "express";
import type { Response, Request } from "express";
import { signupController } from "../controllers/signup.controller.js";

export const authRouter=Router();

authRouter.post("/signup", signupController);

authRouter.post("/signin", (req:Request, res:Response)=>{
  res.status(200).json({msg:"signin endpoint"})
})

authRouter.post("/logout", (req:Request, res:Response)=>{
  res.status(200).json({msg:"logout endpoint"})
})