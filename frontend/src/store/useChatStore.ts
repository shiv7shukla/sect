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
  _id: string,
  username: string
  conversationId?: string;
}

export type ChatStore = {
  messages: Message [];
  queriedUsers: SelectedUser [];
  conversations: Conversations [];

  isMessagesLoading: boolean;
  isConversationsLoading: boolean;

  error: string | null;
  selectedUser: SelectedUser | null;

  messageListener: ((msg: Message) => void) | null;

  getConversations: () => Promise<void>;
  searchUsers: (searchquery: string) => Promise<void>;
  getMessages: (selecteduser: SelectedUser, signal?: AbortSignal) => Promise<void>;
  sendMessage: (text: string, type: string) => Promise<void>;

  clearError: () => void;
  subscribeToMessages: () => void;
  unSubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: SelectedUser) => void;
}

export const chatStore = create<ChatStore>(( set, get ) => ({
  messages: [],
  queriedUsers: [],
  conversations: [],

  error: null,
  selectedUser: null,
  messageListener: null,

  isMessagesLoading: false,
  isConversationsLoading: false,

  getConversations: async () => {
    set({ isConversationsLoading: true });
    try {
      const { data: { chatInfo }} = await axiosInstance.get("/conversations");
      set({ conversations: chatInfo ?? [], isConversationsLoading: false });
    } catch (err) {
      const message = axios.isAxiosError(err) ? err?.response?.data?.message : null;
      console.log(err);
      set({ error: message, isConversationsLoading: false });
      toast.error(message ?? "Failed to load conversations");
    }
  },

  getMessages: async (selectedUser: SelectedUser, signal?: AbortSignal) => {
    set({ isMessagesLoading: true });
    try {
      const {data} = await axiosInstance.get<getMessageAPIResponse>(
        `/conversations/messages/${selectedUser?._id}`,
        {signal}
      );

      set({
        isMessagesLoading: false,
        messages: data.messageInfo ?? [],
        selectedUser: { ...selectedUser, conversationId: data.conversationInfo.conversationId }
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        set({isMessagesLoading: false});
        return;
      }
      const message = axios.isAxiosError(err) ? err?.response?.data?.message : null;
      console.log(err);
      set({error: message, isMessagesLoading: false});
      toast.error(message ?? "Failed to load messages");
    }
  },

  sendMessage: async (text: string, type: string) => {
    try {
      const res = await axiosInstance.post(
        `/conversations/send/${get().selectedUser?._id}`,
        {content: {type, text}}
      );
      set(state => ({messages: [...state.messages, res.data]}));
    } catch (err) {
      const message = axios.isAxiosError(err) ? err?.response?.data?.message : null;
      console.log(err);
      set({error: message});
      toast.error(message ?? "Failed to send messages");
    }
  },

  searchUsers: async (searchQuery: string) => {
    const query = searchQuery.trim();
    if (!query) {
      set({ queriedUsers: [] });
      return;
    }
    try {
      const { data } = await axiosInstance.get("/conversations/search/", {
        params: { searchQuery: query }
      });
      set({ queriedUsers: data.results });
    } catch (err) {
      const message = axios.isAxiosError(err) ? err?.response?.data?.message : null;
      console.log(err);
      set({ error: message, queriedUsers: [] });
      toast.error("Failed to search for users");
    }
  },

  subscribeToMessages: () => {
    const {selectedUser} = get();
    if (!selectedUser) return;

    const socket = authStore.getState().socket;
    if (!socket) return;
    
    socket.emit("start conversation", selectedUser.conversationId);
  },

  unSubscribeFromMessages: () => {
    const socket = authStore.getState().socket;
    const listener = get().messageListener;

    if (listener) socket?.off("newMessage", listener);
    set({ messageListener: null });
  },

  setSelectedUser: (selectedUser: SelectedUser) => set({ selectedUser }),

  clearError: () => set({ error: null }),
}));