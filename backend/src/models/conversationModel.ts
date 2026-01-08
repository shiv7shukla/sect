import mongoose from "mongoose";

const conversationSchema=new mongoose.Schema({
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
    },
  lastMessagePreview:{
      type: String,
    },
},{timestamps:true});

export const Conversation=mongoose.models.Conversation||mongoose.model("Conversation", conversationSchema);