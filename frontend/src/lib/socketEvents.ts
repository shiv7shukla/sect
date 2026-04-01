import { chatStore } from './../store/useChatStore';
import { authStore } from "../store/useAuthStore";
import { socket } from "./socket";

export const registerSocketListeners = () => {
    if (!authStore.getState().authUser || socket.connected || socket.active) return;
    
    socket.on("connect", () => {
        socket.emit("setup", authStore.getState().authUser)});
    socket.connect(); 

    socket.emit("start conversation", chatStore.getState().selectedUser?.conversationId);
    
    socket.on("message received", (newMessage) => {
        chatStore.setState((prevState) => ({messages: [...prevState.messages, newMessage]}))});

    socket.on("is typing", () => chatStore.getState().isTyping = true);
    socket.on("is not typing", () => chatStore.getState().isTyping = false);

}