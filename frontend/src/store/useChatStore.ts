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
  participants: string[];
  type: string;
  lastMessageAt: string;
  lastMessagePreview: string;
}

export type ChatStore = {
  messages: Message[];
  conversations: Conversations[];
  isMessagesLoading: boolean;
  isUsersLoading: boolean;
}

export const ChatStore = create<ChatStore>((set)) => ({
  messages: [],
  conversations: [],
  selectedUser: null,

  isMessagesLoading: false,
  isUsersLoading: false,

  getUsers: async () => {
    set({isUsersLoading: true});
  }
})