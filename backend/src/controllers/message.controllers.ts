import mongoose from "mongoose";
import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";

export const getMessages = asyncHandler(async(req: Request, res: Response) => {
  const { id } = req.params; // conversationId
  const myId = req.user?._id;

  if (!myId) return res.status(401).json({"message": "unauthorized"});
  if (!id) return res.status(400).json({"message": "conversationId is required"});
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({"message": "invalid conversationId"});

  const conversationObjectId = mongoose.Types.ObjectId.createFromHexString(id);
  const conversation = await Conversation.findOne({
    _id:conversationObjectId,
    participants:myId,
  })
    .select("_id type participants lastMessageAt lastMessagePreview")
    .lean();

  if(!conversation) return res.status(403).json({ "message":  "unauthorized" }); // either conversation doesn't exist or user is not a participant
  const messages = await Message.find({ conversationId: conversationObjectId })
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
  const {id: receiverId} = req.params;
  const senderId = req.user?._id;
  const {content} = req.body;
  const validTypes = ["text", "emoji", "gif", "sticker"];
  
  if (!senderId) return res.status(401).json({"message": "unauthorized"});
  if (!receiverId) return res.status(400).json({"message": "receiverId is required"});
  if (!mongoose.isValidObjectId(receiverId)) return res.status(400).json({"message":  "invalid receiverId"});
  const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
  if (!await User.exists({ _id: receiverObjectId })) return res.status(404).json({"message": "receiver not found"});
  if (!content || typeof content !== "object") return res.status(400).json({"message": "content is required"});
  if (!content.type || !validTypes.includes(content.type)) return res.status(400).json({"message": "content.type must be one of: text, emoji, gif, sticker"});
  if (content.type === "text" && (!content.text || content.text.trim().length === 0)) return res.status(400).json({"message": "text content cannot be empty"});
  if (content.type === "emoji" && !content.emoji) return res.status(400).json({"message": "emoji content is required"});
  if (content.type === "gif" && !content.gifUrl) return res.status(400).json({"message": "gifUrl is required"});
  if (content.type === "sticker" && !content.stickerUrl) return res.status(400).json({"message": "stickerUrl is required"});

  // Prevent sending messages to yourself
  if (senderId.toString() === receiverId) return res.status(400).json({"message": "cannot send message to yourself"});
  let conversation = await Conversation
    .findOneAndUpdate(
      { type: content.type, participants: {$all: [senderId, receiverObjectId]} },
      { $setOnInsert: 
        { type: content.type, participants:[senderId, receiverObjectId], lastMessageAt: new Date(), lastMessagePreview: "" } },
      { upsert: true, new: true, select: "_id participants"})
    .lean();

  const message = await Message
    .create({ senderId, conversationId: conversation._id, content });
  if (!message) return res.status(500).json({"message": "unable to create new message"});

  let preview = content.type === "text" ? content.text : `[${content.type}]`;
  preview = preview.length > 150 ? preview.slice(0, 150) + "...": preview;
  await Conversation
    .updateOne({ _id: conversation._id }, { lastMessageAt: message.createdAt, lastMessagePreview: preview }
  );
  return res.status(201).json({createdMessage: message});
  //add real-time feature later on
});