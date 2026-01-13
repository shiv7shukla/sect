import type { Request, Response } from "express"
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signinController=async(req:Request, res:Response)=>{
  const {email, password}=req.body;
  try{
    const user=await User.findOne({email});
    if (!user) return res.status(401).json({"msg":"invalid credentials"});
    const pwd=await bcrypt.compare(password, user.password);
    if (!pwd) return res.status(401).json({"msg":"invalid credentials"});
    generateToken(user._id.toString(), res);
    return res.status(200).json({"msg":"user logged in", "username":user.username});
  }
  catch(error){
    console.log("error while logging in", error);
    return res.status(500).json({"msg":"internal server error"});
  }
}