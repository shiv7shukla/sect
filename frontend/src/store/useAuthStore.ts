import { toast } from 'sonner';
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import axios from "axios";
import { io, Socket } from "socket.io-client";

export type AuthMode = "signIn" | "signUp"

export type AuthUser = {
  _id: string;
  username: string;
  email: string;
};

export type SignUpInput = {
  email: string;
  username: string;
  password: string;
};

export type SignInInput = {
  username: string;
  password: string;
};

export type AuthStatus = "checking" | "authenticated" | "unauthenticated";

export type AuthStore = {
  authUser: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  mode: AuthMode;
  socket: Socket | null;

  onlineUsers: string[];

  isSigningUp: boolean;
  isSigningIn: boolean;
  isLoggingOut: boolean;

  checkAuth: () => Promise<void>;
  signup: (data:SignUpInput) => Promise<void>;
  signin: (data:SignInInput) => Promise<void>;
  logout: () => Promise<void>;
  
  connectSocket: () => void;
  disconnectSocket: () => void;
  clearError: () => void;
  setMode: (mode:AuthMode) => void;
};

export const authStore = create<AuthStore>((set, get) => ({
  authUser: null,
  error: null,
  socket: null,
  mode:"signIn",
  status: "unauthenticated",
  
  onlineUsers: [],

  isSigningUp: false,
  isSigningIn: false,
  isLoggingOut: false,

  clearError: () => set({ error: null }),

  setMode: (mode) => set({mode}),

  checkAuth: async () => {
    set({ status: "checking", error: null });
    try{
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data, status: "authenticated" });
      get().connectSocket();
    } 
    catch {
      set({ authUser: null, status: "unauthenticated" });
    }
  },

  signup: async(data) => {
    set({ isSigningUp: true, error: null });

    try{
      const res = await axiosInstance.post("/auth/signup", data);
      console.log("this is ", res.data);
      set({ authUser: res.data, status: "authenticated" });
      toast.success("Account created successfully!", {
        description: `Welcome, ${data.username}!`,
      });
    } 
    catch (err) {
      const message = axios.isAxiosError(err)? err?.response?.data?.message:null;
      console.log(message, " xyz", err);
      set({
        authUser: null,
        status: "unauthenticated",
        error: message,
      });
      toast.error(message);
    } 
    finally {
      set({ isSigningUp: false });
    }

    get().connectSocket();
  },

  signin: async (data) => {
    set({ isSigningIn: true, error: null });

    try{
      const res = await axiosInstance.post("/auth/signin", data);
      console.log(res.data);
      set({ authUser: res.data, status: "authenticated" });
      toast.success("Signed in successfully!", {
        description: `Welcome back, ${data.username}!`,
      });
    } 
    catch (err) {
      const message = axios.isAxiosError(err)? err?.response?.data?.message:null;
      console.log(err);
      set({
        authUser: null,
        status: "unauthenticated",
        error: message ?? "Signin failed",
      });
      toast.error("Signin Failed");
    } 
    finally {
      set({ isSigningIn: false });
    }

    get().connectSocket();
  },

  logout: async () => {
    set({ isLoggingOut: true, error: null });

    try{
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, status: "unauthenticated" });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } 
    catch (err) {
      const message=axios.isAxiosError(err)? err?.response?.data?.message:null;
      set({
        error: message ?? "Logout failed",
      });
      toast.error("Logout failed");
    } 
    finally {
      set({ isLoggingOut: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    
    const socketBaseUrl = axiosInstance.defaults.baseURL? new URL(axiosInstance.defaults.baseURL, window.location.origin).origin: window.location.origin;
    const socket = io(socketBaseUrl, {
      query: { userId: authUser._id }
    });

    set({ socket: socket });

    socket.connect();
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds});
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      const socket = get().socket;
      socket?.off("getOnlineUsers");
      socket?.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  }
}));
