import { Server } from "socket.io";
import http from "http";
import express from "express";
import cookie from "cookie";
import { ENV } from "../config/env.js";
import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"? true: ["http://localhost:5173"],
  }
});

export function getReceiverSocketId(userId: string){ return userSocketMap[userId]};

interface Dictionary {
  [key: string]: string;
}
const userSocketMap: Dictionary = {}; //{userId: socketId}

io.use(async (socket, next) => {
  try{
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.jwt;
    if (!token) return next(new Error("Unauthorized - token not provided"));

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };
    const user =  await User.findById(decoded.id).select("-password");
    if (!user) return next(new Error("Unauthorized - token not provided"));

    socket.data.userId = decoded.id;
    next();
  }
  catch{ next(new Error("Unauthorized - token not provided")); }
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.data.userId;
  if (userId) userSocketMap[userId as string] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    if (userId && userSocketMap[userId as string] === socket.id) delete userSocketMap[userId as string];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })
});

export { io, app, server };