import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"? ["https://sect-chat.netlify.app"] : ["http://localhost:5173"],
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

  socket.on('call-user', ({ to, from, offer }) => {
    socket.to(to).emit('incoming-call', { from, offer });
  });

  socket.on('answer-call', ({ to, answer }) => {
    socket.to(to).emit('call-answered', answer);
  });

  socket.on('decline-call', ({ to }) => {
    socket.to(to).emit('call-declined');
  });

  socket.on('ice-candidate', ({ to, candidate }) => {
    socket.to(to).emit('ice-candidate', candidate);
  });

  socket.on('end-call', ({ to }) => {
    socket.to(to).emit('call-ended');
  });

})

export {io, app, server};