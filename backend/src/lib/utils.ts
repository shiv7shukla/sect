import jwt from "jsonwebtoken"
import { ENV } from "../config/env.js"
import type { Response } from "express";
import type mongoose from "mongoose";

export const generateToken=(id:mongoose.Types.ObjectId, res:Response)=>{
  const token=jwt.sign({id},ENV.JWT_SECRET,{expiresIn:"7d"});

  res.cookie("jwt", token, {
    maxAge:7*24*60*60*1000,  //the age for cookie's lifetime must be in ms
    httpOnly:true,
    sameSite:"strict",
    secure:ENV.NODE_ENV!="development"
  })

  return token;
}