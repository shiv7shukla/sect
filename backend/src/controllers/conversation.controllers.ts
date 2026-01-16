import type { Request, Response } from "express"
import { Conversation } from "../models/conversationModel.js";

export const getConversations=async (req:Request, res:Response)=>{
  const userId=req.user!._id;
  const conversations=await Conversation.find({participants:userId}).sort({lastMessageAt:-1}).populate("participants", "username");
  const chatInfo=conversations
  .filter(c=>c.type==="direct")
  .map(c=>{const otherUser=(c.participants as any [])
      .find(p=>p._id.toString()!==userId)
      if (!otherUser) return null;
      return {
        conversationId:c._id,
        type:c.type,
        lastMessagePreview:c.lastMessagePreview,
        lastMessageAt:c.lastMessageAt,
        user:{
          id:otherUser._id,
          username:otherUser.username,
        }
      }
    })
  .filter(Boolean);
  res.status(200).json({chatInfo});
}