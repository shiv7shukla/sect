import { asyncHandler } from './../utils/asyncHandler.js';
import type { Request, Response } from "express"
import { ENV } from "../config/env.js";
import { User } from "../models/userModel.js";
import { generateToken } from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

export const signinController=asyncHandler(async(req:Request, res:Response)=>{
  const {username, password}=req.body??{};
  if(!username || !password) return res.status(400).json({"message":"username and password are required"});
  const user=await User.findOne({username});
  if (!user) return res.status(401).json({"message":"invalid credentials"});
  const pwd=await bcrypt.compare(password, user.password);
  if (!pwd) return res.status(401).json({"message":"invalid credentials"});
  generateToken(user._id.toString(), res);
  return res.status(200).json({"message":"user logged in", "username":user.username, "email":user.email});
})

export const signupController=asyncHandler(async(req:Request, res:Response)=>{
  const {email, username, password}=req.body??{};
  if(!email || !password || !username) return res.status(400).json({"message":"email, username and password are required"});
  const user=await User.findOne({email});
  if(user) return res.status(409).json({"message":"user already exists"});
  if(password.length<6) return res.status(400).json({"message":"password too small"});
  const salt=await bcrypt.genSalt(10);
  const hashedpwd=await bcrypt.hash(password, salt);
  const newUser=await User.create({email, username, password:hashedpwd});
  if(!newUser) return res.status(500).json({"message":"Failed to create user"});   
  generateToken(newUser._id.toString(), res);    
  return res.status(201).json({"message":"new user created", email, username});
})

export const logoutController=asyncHandler(async(req:Request, res:Response)=>{
  res.cookie("jwt", "", {maxAge: 0, httpOnly: true, secure: ENV.NODE_ENV !== "DEVELOPMENT", sameSite: "strict"});
  return res.status(200).json({"message":"logged out successfully"});
})

export const checkAuth=asyncHandler(async(req:Request, res:Response)=>{
  res.status(200).json(req.user);
})