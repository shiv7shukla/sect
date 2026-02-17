import mongoose from "mongoose";
import type { IUser } from "./userModel.js";
import type { IC } from "./conversationModel.js";

export interface IM{
  _id:mongoose.Types.ObjectId;
  senderId:mongoose.Types.ObjectId | IUser;
  conversationId:mongoose.Types.ObjectId | IC;
  content:{
    type: "text" | "emoji" | "gif" | "sticker";
    text?: string;
    emoji?: string;
    gifUrl?: string;
    stickerUrl?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema=new mongoose.Schema<IM>({
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  //a conversation is a folder a message is a file inside that folder a file without a folder is useless.
  conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
  },
    // type+payload pattern where one field tells the type and the other stores the actual data
  content: {
      type: {
        type: String,
        enum: ["text", "emoji", "gif", "sticker"],
        required: true,
      },
      text: String,       
      emoji: String,      
      gifUrl: String,     
      stickerUrl: String 
  },
},{timestamps:true});

export const Message=mongoose.models.Message as mongoose.Model<IM>||mongoose.model<IM>("Message", messageSchema);