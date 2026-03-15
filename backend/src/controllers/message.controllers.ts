import mongoose from "mongoose";
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getMessages = asyncHandler(async(req: Request, res: Response) => {
  const { id } = req.params; // receiverId
  const myId = req.user?._id;

  if (myId?.toString() === id) return res.status(400).json({"message": "cannot send message to yourself"});
  if (!myId) return res.status(401).json({"message": "unauthorized"});
  if (!id) return res.status(400).json({"message": "receiverId is required"});
  if (!mongoose.isObjectIdOrHexString(id)) return res.status(400).json({"message": "invalid receiverId"});
  const receiverObjectId = mongoose.Types.ObjectId.createFromHexString(id);
  if (!await User.exists({ _id: receiverObjectId })) return res.status(404).json({"message": "receiver not found"});

  const conversation = await Conversation
  .findOneAndUpdate({
    type: "direct",
    participants: {
      $all: [myId, receiverObjectId], 
      $size: 2
    },
  },
  {
    $setOnInsert: {
      type: "direct",
      participants: [myId, receiverObjectId],
      lastMessageAt: new Date(),
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
  const { receiverId } = req.params;
  const senderId = req.user?._id;
  const { content } = req.body;
  
  if (!senderId) return res.status(401).json({"message": "unauthorized"});
  if (!receiverId) return res.status(400).json({"message": "receiverId is required"});
  if (!mongoose.isObjectIdOrHexString(receiverId)) return res.status(400).json({"message":  "invalid receiverId"});
  if (senderId.toString() === receiverId) return res.status(400).json({"message": "cannot send message to yourself"}); // Prevent sending messages to yourself
  const receiverObjectId = mongoose.Types.ObjectId.createFromHexString(receiverId);
  if (!await User.exists({ _id: receiverObjectId })) return res.status(404).json({"message": "receiver not found"});
  if (!content || typeof content !== "object") return res.status(400).json({"message": "content is required"});

  const participants = [senderId, receiverObjectId].sort();

  let conversation = await Conversation
    .findOneAndUpdate({ 
        type: "direct", 
        participants: { 
          $all: participants,
          $size: 2
        } 
      }, { 
        $setOnInsert: {
          type: "direct", 
          participants, 
        }}, { 
          upsert: true, 
          new: true, 
          select: "_id participants"
        })
    .lean();

  const message = await Message
    .create({ senderId, conversationId: conversation._id, content });
  await Conversation
  .updateOne({
    _id: conversation._id
  }, {
    $set: {
          lastMessageAt: new Date(), 
          lastMessagePreview: content.text
        }})
  const populatedMessage = await Message
    .findById(message._id)
    .populate("senderId", "_id username")
    .lean();
  if (!populatedMessage) return res.status(500).json({"message": "unable to create new message"});
  const sender = populatedMessage.senderId as { _id: mongoose.Types.ObjectId; username: string } | null;
  const newMessage = {
    id: populatedMessage._id.toString(),
    senderId: sender?._id?.toString() ?? null,
    senderUsername: sender?.username ?? "Deleted User",
    content: populatedMessage.content,
    createdAt: populatedMessage.createdAt,
  };

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", newMessage);

  return res.status(201).json(newMessage);
});