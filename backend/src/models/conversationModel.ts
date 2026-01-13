import mongoose, { mongo, type Date } from "mongoose";

export interface IC{
  participants:[mongoose.Types.ObjectId];
  type:string;
  lastMessageAt:Date;
  lastMessagePreview:string;
  createdAt?: Date;
  updatedAt?: Date;
}

const conversationSchema=new mongoose.Schema<IC>({
  participants:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  }],
  type:{
    type:String,
    enum:["direct", "group"],
    default:"direct"
  },
  lastMessageAt:{
      type: Date,
      default: () => new Date()
    },
  lastMessagePreview:{
      type: String,
    },
},{timestamps:true});

export const Conversation=mongoose.models.Conversation as mongoose.Model<IC>||mongoose.model<IC>("Conversation", conversationSchema);