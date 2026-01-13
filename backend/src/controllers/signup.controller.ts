import type { Request, Response } from 'express';
import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';

export const signupController=async(req:Request, res:Response)=>{
  const {email, username, password}=req.body;
  try{
    if(password.length<6) return res.status(400).json({msg:"password too small"});
    const user= await User.findOne({email});
    if(user) return res.status(400).json({msg:"user already exists"});
    const salt=await bcrypt.genSalt(10);
    const hashedpwd=await bcrypt.hash(password, salt);
    const newUser=await User.create({email, username, password:hashedpwd});
    if(newUser) generateToken(newUser._id, res);
    return res.status(201).json({msg:"new user created"});
  }
  catch(error){
    res.status(500).json({msg:"Internal Server Error"});
    console.log(error);
  }
}