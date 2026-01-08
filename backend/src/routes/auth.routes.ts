import { Router } from "express";
import type { Response, Request } from "express";

export const authRouter=Router();

authRouter.post("/signup", (req:Request, res:Response)=>{
  res.status(200).json({msg:"signup endpoint"})
})

authRouter.post("/signin", (req:Request, res:Response)=>{
  res.status(200).json({msg:"signin endpoint"})
})

authRouter.post("/logout", (req:Request, res:Response)=>{
  res.status(200).json({msg:"logout endpoint"})
})