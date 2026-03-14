import axios from "axios";
import { axiosInstance } from "../lib/axios";
import { create } from "zustand";
import { authStore } from "./useAuthStore";
import { toast } from "sonner";

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
    text: string;
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
  id: string,
  username: string
  conversationId: string;
}

export type QueriedUser = {
  id: string,
  username: string
}

export type ChatStore = {
  messages: Message [];
  queriedUsers: QueriedUser [];
  conversations: Conversations [];

  isSearching: boolean
  isMessagesLoading: boolean;
  isConversationsLoading: boolean;

  error: string | null;
  selectedUser: SelectedUser | null;

  getConversations: () => Promise<void>;
  searchUsers: (searchquery: string) => Promise<void>;
  getMessages: (selecteduser: SelectedUser) => Promise<void>;
  sendMessage: (text: string, type: string) => Promise<void>;

  clearError: () => void;
  subscribeToMessages: () => void;
  unSubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: SelectedUser) => void;
}

export const chatStore = create<ChatStore>((set, get) => ({
  messages: [],
  queriedUsers: [],
  conversations: [],

  error: null,
  selectedUser: null,

  isSearching: false,
  isMessagesLoading: false,
  isConversationsLoading: false,

  getConversations: async () => {
    set({ isConversationsLoading: true });
    try{
      const { data: { chatInfo }} = await axiosInstance.get("/conversations");
      set({ conversations:  chatInfo?? [], isConversationsLoading: false });
    }
    catch (err){
      const message = axios.isAxiosError(err)? err?.response?.data?.message: null;
      console.log(err);
      set ({ error: message, isConversationsLoading: false});
      toast.error(message?? "Failed to load conversations")
    }
  },

  getMessages: async (selectedUser: SelectedUser) => {
    set({ isMessagesLoading: true });
    try{
      const { data } = await axiosInstance.get<getMessageAPIResponse>(`/conversations/messages/${selectedUser?.conversationId}`);
      set({ messages: data.messageInfo?? [], isMessagesLoading: false})
    }
    catch(err){
      const message = axios.isAxiosError(err)? err?.response?.data?.message: null;
      console.log(err);
      set ({ error: message, isMessagesLoading: false});
      toast.error(message?? "Failed to load messages")
    }
  },

  sendMessage: async (text: string, type: string) => {
    try{
      const res = await axiosInstance.post(`/conversations/send/${get().selectedUser?.id}`, { content: { type: type, text } });
      set(state => ({ messages: [...state.messages, res.data ]}))
    }
    catch(err){
      const message = axios.isAxiosError(err)? err?.response?.data?.message: null;
      console.log(err)
      set({ error: message });
      toast.error(message?? "Failed to send messages")
    }
  },

  searchUsers: async (searchquery: string) => {
    set({ isSearching: true });

    try{
      const { data } = await axiosInstance.get("/conversations/search/", { params: { searchquery }});
      set({ queriedUsers: data.results, isSearching: false});
    }
    catch(err){
      const message = axios.isAxiosError(err)? err?.response?.data?.message: null;
      console.log(err)
      set({ error: message });
      toast.error(message?? "Failed to search for users");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = authStore.getState().socket;
    socket?.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser.id) return;
      
      set({ messages: [...get().messages, newMessage]})
    })
  },

  unSubscribeFromMessages: () => {
    const socket = authStore.getState().socket;
    socket?.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  clearError: () => set({ error: null})

}))