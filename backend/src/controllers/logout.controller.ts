import type { Request, Response } from "express"

export const logoutController=async(req:Request, res:Response)=>{
  try{
    res.cookie("jwt", "", {maxAge:0});
    return res.status(200).json({"msg":"logged out successfully"});
  }
    catch(error){
    console.log("error while logging in", error);
    return res.status(500).json({"msg":"internal server error"});
  }
}