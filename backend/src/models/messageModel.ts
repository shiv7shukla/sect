import mongoose from "mongoose";

export interface IM{
  senderId:mongoose.Types.ObjectId;
  conversationId:mongoose.Types.ObjectId;
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
    // typ+payload pattern where one field tells the type and the other stores the actual data
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