import axios from "axios";
import { axiosInstance } from "../lib/axios";
import { create } from "zustand";

export type Message = {
  senderId: string;
  content: {
    type: "text" | "emoji" | "gif" | "sticker";
    text?: string;
    emoji?: string;
    gifUrl?: string;
    stickerUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type Conversations = {
  conversationId: string,
  type: string,
  lastMessagePreview: string,
  lastMessageAt: string,
  participant: {
    id: string,
    username: string,
  }
}

export type ChatStore = {
  messages: Message [];
  conversations: Conversations [];

  isMessagesLoading: boolean;
  isUsersLoading: boolean;

  selectedUser: string | null;
  error: string | null;

  getUsers: () => Promise<void>;
  getMessages: () => Promise<void>;
  clearError : () => void;
}

export const chatStore = create<ChatStore>((set) => ({
  messages: [],
  conversations: [],

  selectedUser: null,
  error: null,

  isMessagesLoading: false,
  isUsersLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try{
      const { data: { chatInfo }} = await axiosInstance.get("/conversations");
      set({ conversations:  chatInfo, isUsersLoading: false })
    }
    catch (err){
      const message = axios.isAxiosError(err)? err?.response?.data?.message: null;
      console.log(err);
      set ({ error: message, isUsersLoading: false});
    }
  },

  getMessages: async () => {
    set({ isMessagesLoading: true });
  },

  clearError: () => set({ error: null})

}))