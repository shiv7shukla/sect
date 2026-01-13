import type { Request, Response } from "express"
import { ENV } from "../config/env.js";

export const logoutController=async(req:Request, res:Response)=>{
  try{
    res.cookie("jwt", "", {maxAge: 0, httpOnly: true, secure: ENV.NODE_ENV !== "DEVELOPMENT", sameSite: "strict"});
    return res.status(200).json({"msg":"logged out successfully"});
  }
    catch(error){
    console.log("error while logging out", error);
    return res.status(500).json({"msg":"internal server error"});
  }
}