import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export type AuthUser = {
  _id: string;
  username: string;
  email: string;
};

type AuthStore = {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
};

export const authStore=create<AuthStore>((set)=>({
  authUser:null,
  isSigningUp:false,
  isLoggingIn:false,
  isCheckingAuth:true,
  checkAuth:async()=>{
    try{
      const res=await axiosInstance.get("/auth/check");
      set({authUser:res.data});
    }
    catch(error){
      set({authUser:null});
      console.log("error while auth checking", error);
    }
    finally{
      set({isCheckingAuth:false});
    }
  }
}))