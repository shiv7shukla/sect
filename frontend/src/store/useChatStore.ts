import axios from "axios";
import { axiosInstance } from "../lib/axios";
import { create } from "zustand";
import { toast } from "sonner";
import { createJSONStorage, persist } from "zustand/middleware";
import { socket } from "../lib/socket";

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
  newMessage: Message | null;
  messages: Message [];
  queriedUsers: SelectedUser [];
  conversations: Conversations [];

  isTyping: boolean;
  isMessagesLoading: boolean;
  isConversationsLoading: boolean;

  error: string | null;
  selectedUser: SelectedUser | null;

  lastMessageAt: string | null;
  lastMessagePreview: string | null;

  getConversations: () => Promise<void>;
  messageListener: ((msg: Message) => void) | null;
  searchUsers: (searchquery: string) => Promise<void>;
  getMessages: (selecteduser: SelectedUser, signal?: AbortSignal) => Promise<string | undefined>;
  sendMessage: (text: string, type: string) => Promise<void>;

  clearError: () => void;
  // unSubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: SelectedUser | null) => void;
}

export const chatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
    messages: [],
    queriedUsers: [],
    conversations: [],
      
    error: null,
    newMessage: null,
    selectedUser: null,
    lastMessageAt: null,
    messageListener: null,
    lastMessagePreview: null,

    isTyping: false,
    isMessagesLoading: false,
    isConversationsLoading: false,

    getConversations: async () => {
      set({isConversationsLoading: true});
      try {
        const {data} = await axiosInstance.get("/conversations");
        console.log(data.chatInfo)
        if (JSON.stringify(data.chatInfo) !== "{}")
          set({
            conversations: data.chatInfo ?? [],
            isConversationsLoading: false, 
            lastMessageAt: data.chatInfo[0].lastMessageAt, 
            lastMessagePreview: data.chatInfo[0].lastMessagePreview
          });
        else
          set({
            conversations: [],
            isConversationsLoading: false
          });

      } catch (err) {
        const message = axios.isAxiosError(err) ? err?.response?.data?.message : null;
        console.log(err);
        set({error: message, isConversationsLoading: false});
        toast.error(message ?? "Failed to load conversations");
      }
    },

    getMessages: async (selectedUser: SelectedUser, signal?: AbortSignal) => {
      set({isMessagesLoading: true});

      try {
        const {data} = await axiosInstance.get<getMessageAPIResponse>(
          `/conversations/messages/${selectedUser?._id}`,
          {signal}
        );

        set({
          isMessagesLoading: false,
          messages: data.messageInfo ?? [],
          lastMessageAt: data.conversationInfo.lastMessageAt,
          lastMessagePreview: data.conversationInfo.lastMessagePreview,
          selectedUser: {...selectedUser, conversationId: data.conversationInfo.conversationId},
        });

        return data.conversationInfo.conversationId;
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

    searchUsers: async (searchQuery: string) => {
      const query = searchQuery.trim();
      if (!query) {
        set({queriedUsers: []});
        return;
      }
      try {
        const {data} = await axiosInstance.get("/conversations/search/", {
          params: {searchQuery: query}
        });
        set({queriedUsers: data.results});
      } catch (err) {
        const message = axios.isAxiosError(err) ? err?.response?.data?.message : null;
        console.log(err);
        set({ error: message, queriedUsers: [] });
        toast.error("Failed to search for users");
      }
    },

    sendMessage: async (text: string, type: string) => {
      try {
        const targetUser = get().selectedUser;
        const res = await axiosInstance.post(
          `/conversations/send/${get().selectedUser?._id}`,
          {content: {type, text}}
        );
        if (targetUser === get().selectedUser){
          set(state => ({messages: [...state.messages, res.data], newMessage: res.data}));
          socket.emit("new message", res.data, targetUser);
        }
      } catch (err) {
        const message = axios.isAxiosError(err) ? err?.response?.data?.message : null;
        console.log(err);
        console.log(message);
        set({error: message});
        toast.error(message ?? "Failed to send messages");
      }
    },

    setSelectedUser: (selectedUser: SelectedUser | null) => set({selectedUser}),

    clearError: () => set({error: null}),
  }),
  {
      name: "chat-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({selectedUser: state.selectedUser})
    }
  )
);