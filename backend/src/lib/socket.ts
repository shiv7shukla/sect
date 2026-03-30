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
    credentials: true
  }
});

io.on("connection", (socket) => {
  socket.on("setup", (userData, callback) => {
    socket.join(userData._id);
    callback();
  });

  socket.on("start conversation", (conversationId) => {
    socket.join(conversationId);
    console.log("user joined conversation" + conversationId);
  });

  socket.on("new message", (newMessage) => {
    
  })
})

export { io, app, server };