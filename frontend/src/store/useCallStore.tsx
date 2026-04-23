import { create } from "zustand";

export type CallStatus = "idle" | "calling" | "receiving" | "in-call";

export type CallStore = {
    remoteSocketId: string | null,
    localStream: MediaStream | null,
    remoteStream: MediaStream | null,
    incomingOffer: RTCSessionDescriptionInit| null,

    isMuted: boolean,
    isVideoOff: boolean
    callStatus: CallStatus,

    setCallStatus: (s: CallStatus) => void;
    setLocalStream: (s: MediaStream | null) => void;
    setRemoteStream: (s: MediaStream | null) => void;
    setRemoteSocketId: (id: string | null) => void;
    setIncomingOffer: (offer: RTCSessionDescriptionInit | null) => void;

    resetCall: () => void;
    toggleAudio: () => void;
    toggleVideo: () => void;
};

export const callStore = create<CallStore>((set, get) => ({
    remoteSocketId: null,
    localStream: null,
    remoteStream: null,
    incomingOffer: null,

    isMuted: false,
    isVideoOff: false,
    callStatus: "idle",

    setLocalStream: (localStream) => set({ localStream }),
    setRemoteStream: (remoteStream) => set({ remoteStream }),
    setRemoteSocketId: (remoteSocketId) => set({ remoteSocketId }),
    setCallStatus: (callStatus) => set({ callStatus }),
    setIncomingOffer: (incomingOffer) => set({ incomingOffer }),

    toggleAudio: () => {
        const { localStream, isMuted } = get();
        localStream?.getAudioTracks().forEach((t) => (t.enabled = isMuted));
        set({ isMuted: !isMuted });
    },

    toggleVideo: () => {
        const { localStream, isVideoOff } = get();
        localStream?.getVideoTracks().forEach((t) => (t.enabled = isVideoOff));
        set({ isVideoOff: !isVideoOff });
    },

    resetCall: () => set({
        remoteStream: null, localStream: null, callStatus: 'idle',
        remoteSocketId: null, incomingOffer: null,
        isMuted: false, isVideoOff: false,
    }),
}));