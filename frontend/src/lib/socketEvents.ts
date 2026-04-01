import { chatStore } from './../store/useChatStore';
import { authStore } from "../store/useAuthStore";
import { socket } from "./socket";

export const registerSocketListeners = () => {
    if (!authStore.getState().authUser) return;
    
    socket.connect();
    socket.emit("setup", authStore.getState().authUser);

    socket.emit("start conversation", chatStore.getState().selectedUser?.conversationId);
    socket.emit("new message", chatStore.getState().newMessage, chatStore.getState().selectedUser);
    socket.on("message received", (newMessage) => {
        chatStore.setState((prevState) => ({messages: [...prevState.messages, newMessage]}));
    });

    socket.emit("typing", chatStore.getState().selectedUser?.conversationId, chatStore.getState().selectedUser?.username);
    socket.emit("not typing", chatStore.getState().selectedUser?.conversationId, chatStore.getState().selectedUser?.username);
}