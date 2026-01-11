import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
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

export const Message=mongoose.models.Message||mongoose.model("Message", messageSchema);