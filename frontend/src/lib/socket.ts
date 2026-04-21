import { io } from "socket.io-client";

const socketBaseUrl = window.location.href.includes('localhost')? "http://localhost:3000/api" : import.meta.env.VITE_API_BASE_URL;
export const socket = io(socketBaseUrl, {autoConnect: false, withCredentials: true});