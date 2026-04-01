import { io } from "socket.io-client";

const socketBaseUrl = "http://localhost:3000";
export const socket = io(socketBaseUrl, {autoConnect: false, withCredentials: true});