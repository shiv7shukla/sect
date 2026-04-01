import mongoose from "mongoose";
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
// import { getReceiverSocketId, io } from "../lib/socket.js";

export const getMessages = asyncHandler(async(req: Request, res: Response) => {
  const {receiverId} = req.params; // receiverId
  const myId = req.user?._id;

  if (!myId) return res.status(401).json({"message": "unauthorized"});
  if (myId?.toString() === receiverId) return res.status(400).json({"message": "cannot send message to yourself"});
  if (!receiverId) return res.status(400).json({"message": "receiverId is required"});
  if (!mongoose.isObjectIdOrHexString(receiverId)) return res.status(400).json({"message": "invalid receiverId"});
  const receiverObjectId = mongoose.Types.ObjectId.createFromHexString(receiverId);
  if (!await User.exists({ _id: receiverObjectId })) return res.status(404).json({"message": "receiver not found"});

  const participants = [myId, receiverObjectId].sort();
  const participantsKey = participants.map(id => id.toString()).join("_");

  const conversation = await Conversation
  .findOneAndUpdate({
    type: "direct",
    participantsKey
  },
  {
    $setOnInsert: {
      type: "direct",
      participants,
      participantsKey,
      lastMessagePreview: ""
    }
  },
  {
    new: true, //return the document (new or existing)
    upsert: true //create if not found
  })
  .select("_id type participants lastMessageAt lastMessagePreview")
  .lean();

  const messages = await Message.find({ conversationId: conversation._id })
    .sort({ createdAt: 1 })
    .populate("senderId", "_id username")
    .lean();

  const messageInfo = messages.map((m) => {
    const sender = m.senderId as { _id: mongoose.Types.ObjectId; username: string } | null;

    return{
      id: m._id.toString(),
      senderId: sender?._id?.toString()??null,
      senderUsername: sender?.username??"Deleted User",
      content: m.content,
      createdAt: m.createdAt,
    };
  });

  return res.status(200).json({
    conversationInfo: {
      conversationId: conversation._id.toString(),
      type: conversation.type,
      lastMessageAt: conversation.lastMessageAt,
      lastMessagePreview: conversation.lastMessagePreview,
    },
    messageInfo: messageInfo,
  });
});

export const sendMessages = asyncHandler(async(req:Request, res:Response) => {
  const {receiverId} = req.params;
  const senderId = req.user?._id;
  const {content} = req.body;
  
  if (!senderId) return res.status(401).json({"message": "unauthorized"});
  if (!receiverId) return res.status(400).json({"message": "receiverId is required"});
  if (!mongoose.isObjectIdOrHexString(receiverId)) return res.status(400).json({"message":  "invalid receiverId"});
  if (senderId.toString() === receiverId) return res.status(400).json({"message": "cannot send message to yourself"}); // Prevent sending messages to yourself
  const receiverObjectId = mongoose.Types.ObjectId.createFromHexString(receiverId);
  if (!content || typeof content !== "object") return res.status(400).json({"message": "content is required"});

  const participants = [senderId, receiverObjectId].sort();
  const participantsKey = participants.map(id => id.toString()).join("_");

  let conversation = await Conversation
    .findOneAndUpdate({ 
        type: content.type,
        participantsKey: participantsKey
      }, { 
        $setOnInsert: {
          type: content.type, 
          participants: participants,
          participantsKey: participantsKey 
        }}, { 
          upsert: true, 
          new: true, 
          select: "_id participants"
        })
    .lean();

  const message = await Message
    .create({senderId, conversationId: conversation._id, content});
  
  await Conversation.findOneAndUpdate(
  {
    _id: conversation._id,
    $or: [
      {lastMessageAt: {$exists: false}},           // no preview yet (new conversation)
      {lastMessageAt: {$lt: message.createdAt!}}    // this message is newer
    ]
  },
  {
    $set: {
      lastMessageAt: message.createdAt,
      lastMessagePreview: content.text        
    }
  }
);
  
  if (!message) return res.status(500).json({"message": "unable to create new message"});
  
  // const sender = populatedMessage.senderId as {_id: mongoose.Types.ObjectId; username: string } | null;
  
  const newMessage = {
    id: message._id.toString(),
    senderId: senderId.toString() ?? null,
    senderUsername: req.user?.username ?? "Deleted User",
    content: message.content,
    createdAt: message.createdAt,
  };

    // const receiverSocketId = getReceiverSocketId(receiverId);
    // if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage);

  return res.status(201).json(newMessage);
});