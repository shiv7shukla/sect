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
  },
},{timestamps:true});

// mongoose keeps models in memory
// in watch mode or hot reload, the same file can be imported multiple times
// re-creating a model causes OverwriteModelError
// this pattern prevents that error safely
export const User=mongoose.models.User||mongoose.model("User", userSchema); 