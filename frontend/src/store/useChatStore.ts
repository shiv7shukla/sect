import axios from "axios";
import { axiosInstance } from "../lib/axios";
import { create } from "zustand";
// import { toast } from "sonner";

export type getMessageAPIResponse = {
  conversationInfo: {
    conversationId: string;
    type: string;
    lastMessagePreview: string;
    lastMessageAt: string;
  },
  messageInfo: Message[]
}

export type Message = {
  id: string;
  senderId: string | null;
  senderUsername: string;
  content: {
    type: "text" | "emoji" | "gif" | "sticker";
    text?: string;
    emoji?: string;
    gifUrl?: string;
    stickerUrl?: string;
  };
  createdAt: string;
}

export type Conversations = {
  conversationId: string;
  type: string;
  lastMessagePreview: string;
  lastMessageAt: string;
  participant: {
    id: string,
    username: string,
  }
}

export type SelectedUser = {
  conversationId: string;
  id: string,
  username: string
}

export type ChatStore = {
  messages: Message [];
  conversations: Conversations [];

  isMessagesLoading: boolean;
  isConversationsLoading: boolean;

  selectedUser: SelectedUser | null;
  error: string | null;

  getConversations: () => Promise<void>;
  getMessages: (selecteduser: SelectedUser) => Promise<void>;
  setSelectedUser: (selectedUser: SelectedUser) => void;
  sendMessage: (text: string, type: string) => Promise<void>;
  clearError: () => void;
}

export const chatStore = create<ChatStore>((set, get) => ({
  messages: [],
  conversations: [],

  selectedUser: null,
  error: null,

  isMessagesLoading: false,
  isConversationsLoading: false,

  getConversations: async () => {
    set({ isConversationsLoading: true });
    try{
      const { data: { chatInfo }} = await axiosInstance.get("/conversations");
      set({ conversations:  chatInfo, isConversationsLoading: false });
    }
    catch (err){
      const message = axios.isAxiosError(err)? err?.response?.data?.message: null;
      console.log(err);
      set ({ error: message, isConversationsLoading: false});
      // toast.error(message)
    }
  },

  getMessages: async (selectedUser: SelectedUser) => {
    set({ isMessagesLoading: true });
    try{
      const { data } = await axiosInstance.get<getMessageAPIResponse>(`/conversations/messages/${selectedUser?.conversationId}`);
      set({ messages: data.messageInfo, isMessagesLoading: false})
    }
    catch(err){
      const message = axios.isAxiosError(err)? err?.response?.data?.message: null;
      console.log(err);
      set ({ error: message, isMessagesLoading: false});
      // toast.error(message)
    }
  },

  sendMessage: async (text: string, type: string) => {
    try{
      const res = await axiosInstance.post(`/conversations/send/${get().selectedUser?.id}`, { content: { type: type, text } });
      set(state => ({messages: [...state.messages, res.data]}))
    }
    catch(err){
      const message = axios.isAxiosError(err)? err?.response?.data?.message: null;
      console.log(err)
      set({ error: message });
      // toast.error(message)
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  clearError: () => set({ error: null})

}))