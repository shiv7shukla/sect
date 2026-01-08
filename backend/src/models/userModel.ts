import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  username:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    unique:false
  },
},{timestamps:true});

// Mongoose keeps models in memory
// In watch mode or hot reload, the same file can be imported multiple times
// Re-creating a model causes OverwriteModelError
// This pattern prevents that error safely
export const User=mongoose.models.User||mongoose.model("User", userSchema); 