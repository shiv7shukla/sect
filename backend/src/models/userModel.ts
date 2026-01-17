import mongoose from "mongoose";

//ts needs to know what fields a user has
export interface IUser{
  _id:mongoose.Types.ObjectId; //If a field always exists at runtime, it must exist in your TypeScript type — regardless of who generates it.
  email:string;
  username:string;
  password:string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema=new mongoose.Schema<IUser>({
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
export const User=mongoose.models.User as mongoose.Model<IUser>||mongoose.model<IUser>("User", userSchema); 