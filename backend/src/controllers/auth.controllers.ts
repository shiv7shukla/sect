import { asyncHandler } from './../utils/asyncHandler.js';
import type { Request, Response } from "express"
import { ENV } from "../config/env.js";
import { User } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signinController=asyncHandler(async(req:Request, res:Response)=>{
  const {email, password}=req.body??{};
  if(!email || !password) return res.status(400).json({msg:"email and password are required"});
  const user=await User.findOne({email});
  if (!user) return res.status(401).json({"msg":"invalid credentials"});
  const pwd=await bcrypt.compare(password, user.password);
  if (!pwd) return res.status(401).json({"msg":"invalid credentials"});
  generateToken(user._id.toString(), res);
  return res.status(200).json({"msg":"user logged in", "username":user.username});
})

export const signupController=asyncHandler(async(req:Request, res:Response)=>{
  const {email, username, password}=req.body??{};
  if(!email || !password || !username) return res.status(400).json({msg:"email, username and password are required"});
  if(password.length<6) return res.status(400).json({msg:"password too small"});
  const user= await User.findOne({email});
  if(user) return res.status(400).json({msg:"user already exists"});
  const salt=await bcrypt.genSalt(10);
  const hashedpwd=await bcrypt.hash(password, salt);
  const newUser=await User.create({email, username, password:hashedpwd});
  if(!newUser) return res.status(500).json({msg:"Failed to create user"});   
  generateToken(newUser._id.toString(), res);    
  return res.status(201).json({msg:"new user created"});
})

export const logoutController=asyncHandler(async(req:Request, res:Response)=>{
  res.cookie("jwt", "", {maxAge: 0, httpOnly: true, secure: ENV.NODE_ENV !== "DEVELOPMENT", sameSite: "strict"});
  return res.status(200).json({"msg":"logged out successfully"});
})

export const checkAuth=asyncHandler(async(req:Request, res:Response)=>{
  res.status(200).json(req.user);
})