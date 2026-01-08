import { Router } from "express";
import type { Response, Request } from "express";

export const authRouter=Router();

authRouter.get("/signup", (req:Request, res:Response)=>{
  res.status(200).json({msg:"signup endpoint"})
})

authRouter.get("/signin", (req:Request, res:Response)=>{
  res.status(200).json({msg:"signin endpoint"})
})

authRouter.get("/logout", (req:Request, res:Response)=>{
  res.status(200).json({msg:"logout endpoint"})
})