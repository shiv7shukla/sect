import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"? ["https://your-frontend.onrender.com"] : ["http://localhost:5173"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
  });

  socket.on("start conversation", (room) => {
    socket.join(room);
  });

  socket.on("leave conversation", (room) => {
    socket.leave(room);
  });

  socket.on("new message", (newMessage, selectedUser) => {
    socket.in(selectedUser.conversationId).emit("message received", newMessage); // everyone in this room EXCEPT the socket that emitted
  });

  socket.on("typing", (room, senderUsername) => socket.in(room).emit("is typing", senderUsername));

  socket.on("not typing", (room, senderUsername) => socket.in(room).emit("is not typing", senderUsername));

})

export {io, app, server};