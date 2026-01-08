import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
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

export const Message=mongoose.models.Message||mongoose.model("Message", messageSchema);