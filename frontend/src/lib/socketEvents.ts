import { chatStore } from './../store/useChatStore';
import { authStore } from "../store/useAuthStore";
import { socket } from "./socket";

export const registerSocketListeners = () => {
    if (!authStore.getState().authUser || socket.connected || socket.active) return;
    
    socket.on("connect", () => {
        socket.emit("setup", authStore.getState().authUser)});
    socket.connect(); 
    
    socket.on("message received", (newMessage) => {
        chatStore.setState((prevState) => ({ messages: [...prevState.messages, newMessage] }))});

    socket.on("is typing", () => {chatStore.setState({ isTyping: true })});
    socket.on("is not typing", () => {chatStore.setState({ isTyping: false })});

}