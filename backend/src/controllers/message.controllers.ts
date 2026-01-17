import mongoose from 'mongoose';
import { Message } from '../models/messageModel.js';
import { asyncHandler } from './../utils/asyncHandler.js';
import type {Request, Response} from "express"

export const getMessages=asyncHandler(async(req:Request, res:Response)=>{
  const {id}=req.params;
  if (!id) return res.status(400).json({"msg":"conversationId is required"});
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ "msg": "invalid conversationId" });
  const conversationObjectId=new mongoose.Types.ObjectId(id);
  const messages=await Message
  .find({conversationId:conversationObjectId})
  .populate("senderId", "_id username")
  .populate("conversationId", "type participants lastMessageAt lastMessagePreview")
  .lean();
  if(messages.length===0) return res.status(400).json({"msg":"no messages"});
  const messageInfo=messages
  .map(m=>{
    const senderInfo=m.senderId as {_id:mongoose.Types.ObjectId, username:string} | null;
    const conversationInfo=m.conversationId as {lastMessageAt:Date, lastMessagePreview:string} | null;
    if (!senderInfo || !conversationInfo) return null;
    return {
      senderId:senderInfo._id,
      senderUsername:senderInfo.username,
      lastMessageAt:conversationInfo.lastMessageAt,
      lastMessagePreview:conversationInfo.lastMessagePreview,
      type:m.content.type,
      payload: m.content.text ?? m.content.emoji ?? m.content.gifUrl ?? m.content.stickerUrl
    }
  })
  .filter(Boolean);
  return res.status(200).json({messageInfo});
})