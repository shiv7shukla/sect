import { asyncHandler } from './../utils/asyncHandler.js';
import type { Request, Response } from "express"
import { Conversation } from "../models/conversationModel.js";

export const getConversations=asyncHandler(async(req:Request, res:Response)=>{
  const userId=req.user!._id.toString();
  const conversations=await Conversation
  .find({participants:userId})
  .sort({lastMessageAt:-1})
  .populate("participants", "username")
  .lean();
  if (conversations.length===0) return res.status(404).json({"msg":"Conversation not found"});//arrays are always truthy in JS so check for empty arrays using their length
  const chatInfo=conversations
  .filter(c=>c.type==="direct")
  .map(c=>{const otherUser=(c.participants as any [])
      .find(p=>p._id.toString()!==userId) //.find() finishes immediately and returns a value, so if (!otherUser) runs right after and checks that returned value.
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
})