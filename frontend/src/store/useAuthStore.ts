import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import axios from "axios";

export type AuthMode="signIn" | "signUp"

export type AuthUser={
  _id:string;
  username:string;
  email:string;
};

export type SignUpInput={
  email:string;
  username:string;
  password:string;
};

export type SignInInput={
  username:string;
  password:string;
};

export type AuthStatus="checking" | "authenticated" | "unauthenticated";

export type AuthStore={
  authUser:AuthUser | null;
  status:AuthStatus;
  error:string | null;
  mode:AuthMode;

  isSigningUp:boolean;
  isSigningIn:boolean;
  isLoggingOut:boolean;

  checkAuth:()=>Promise<void>;
  signup:(data:SignUpInput)=>Promise<void>;
  signin:(data:SignInInput)=>Promise<void>;
  logout:()=>Promise<void>;

  clearError:()=>void;
  setMode:(mode:AuthMode)=>void;
};

export const authStore=create<AuthStore>((set)=>({
  authUser: null,
  status: "unauthenticated",
  error: null,
  mode:"signIn",

  isSigningUp: false,
  isSigningIn: false,
  isLoggingOut: false,

  clearError:()=>set({ error: null }),

  setMode:(mode)=>set({mode}),

  checkAuth:async()=>{
    set({ status: "checking", error: null });
    try{
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data, status: "authenticated" });
    } catch (err) {
      set({ authUser: null, status: "unauthenticated" });
    }
  },

  signup:async(data)=>{
    set({ isSigningUp: true, error: null });

    try{
      const res = await axiosInstance.post("/auth/signup", data);
      console.log(res.data);
      set({ authUser: res.data, status: "authenticated" });
    } catch (err) {
      const message=axios.isAxiosError(err)? err?.response?.data?.message:null;
      set({
        authUser: null,
        status: "unauthenticated",
        error: message ?? "Signup failed",
      });
    } finally {
      set({ isSigningUp: false });
    }
  },

  signin:async (data)=>{
    set({ isSigningIn: true, error: null });

    try{
      const res = await axiosInstance.post("/auth/signin", data);
      console.log(res.data);
      set({ authUser: res.data, status: "authenticated" });
    } catch (err) {
      const message=axios.isAxiosError(err)? err?.response?.data?.message:null;
      console.log(err);
      set({
        authUser: null,
        status: "unauthenticated",
        error: message ?? "Signin failed",
      });
    } finally {
      set({ isSigningIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true, error: null });

    try{
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, status: "unauthenticated" });
    } catch (err) {
      const message=axios.isAxiosError(err)? err?.response?.data?.message:null;
      set({
        error: message ?? "Logout failed",
      });
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
