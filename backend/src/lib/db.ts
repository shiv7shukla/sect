import { ENV } from "../config/env.js";
import mongoose from "mongoose";

export const connectDB=async()=>{
  try{
    await mongoose.connect(ENV.DB_URL);
  }
  catch(e){
    console.log("error while connecting to database", e);
  }
};