import { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Lock, Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { callStore } from "../store/useCallStore";
import { useShallow } from "zustand/shallow";
import { useWebRTC } from "../hooks/useWebRTC";

    interface VideoCallModalProps {
        isOpen: boolean;
        closeCall: () => void;
    }

    const VideoCallModal = ({ isOpen, closeCall }: VideoCallModalProps) => {
    const { 
        remoteUsername,
        callStatus, 
        isVideoOff, 
        isMuted, 
        toggleAudio, 
        toggleVideo 
    } = callStore(useShallow((state) => ({ 
        remoteUsername: state.remoteUsername,
            callStatus: state.callStatus,
            isVideoOff: state.isVideoOff,
            isMuted: state.isMuted,
            toggleAudio: state.toggleAudio, 
            toggleVideo: state.toggleVideo,
    })))

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const { endCall } = useWebRTC();
    const { remoteId } = callStore((useShallow((state) => ({ remoteId: state.remoteId}))))

    // Acquire local media when call opens
    useEffect(() => {
        if (!isOpen) return;

        return () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        };
    }, [isOpen]);

    // Auto-close after declined
    useEffect(() => {
        if (callStatus !== "declined") return;
        const t = setTimeout(() => {if (remoteId) endCall(remoteId); closeCall();}, 2500);
        return () => clearTimeout(t);
    }, [callStatus, endCall, remoteId, closeCall]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl animate-fade-in">
            <div className="h-full w-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-secondary border border-border/50 flex items-center justify-center">
                            <span className="font-mono text-sm font-semibold text-foreground/80">
                                {remoteUsername?.toUpperCase()}
                            </span>
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                            ${callStatus === "connected"? "bg-primary animate-pulse":callStatus === "calling"? "bg-accent": "bg-destructive"}`
                        } />
                    </div>
                    <div>
                        <h3 className="font-medium text-sm">{remoteUsername}</h3>
                        <div className="flex items-center gap-1.5">
                            <Lock className="w-3 h-3 text-primary" />
                            <span className="text-[11px] text-primary font-mono">
                                {callStatus === "calling" && "Ringing..."}
                                {callStatus === "declined" && "Call ended"}
                            </span>
                        </div>
                    </div>
                </div>

            <div className={`rounded-full px-3 py-1.5 flex items-center gap-2 border ${callStatus === "connected"?"bg-primary/10 border-primary/20":callStatus === "calling"? "bg-accent/10 border-accent/20":"bg-destructive/10 border-destructive/20"}`}>
                <span className={`w-2 h-2 rounded-full" ${callStatus === "connected"?"bg-primary animate-pulse":callStatus === "calling"? "bg-accent animate-pulse":"bg-destructive"}`} />
                <span className={`text-[11px] font-mono uppercase tracking-wider ${callStatus === "connected"?"bg-primary animate-pulse":callStatus === "calling"? "text-accent":"text-destructive"}`}>
                    {callStatus === "calling" && "Calling"}
                    {callStatus === "connected" && "Live"}
                    {callStatus === "declined" && "Declined"}
                </span>
            </div>
            </div>

            {/* Video stage */}
            <div className="flex-1 relative overflow-hidden">
                {/* Remote video placeholder (mock) */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-card">
                    <div className="text-center">
                        <div className={`relative w-32 h-32 mx-auto rounded-3xl bg-secondary border flex items-center justify-center mb-4
                            status === "calling" ? "border-accent/40" : "border-border/50"
                            status !== "declined" && "animate-float`}>
                            {callStatus === "calling" && (
                            <>
                                <div className="absolute inset-0 rounded-3xl bg-accent/20 animate-ping" />
                                <div className="absolute inset-0 rounded-3xl bg-accent/10 animate-pulse" />
                            </>
                            )}
                            <span className="relative font-mono text-5xl font-semibold text-foreground/60">
                                {remoteUsername?.toUpperCase()}
                            </span>
                        </div>
                        <h2 className="font-mono text-2xl font-semibold mb-1">{remoteUsername}</h2>

                        {callStatus === "calling" && (
                            <p className="text-xs text-accent mt-4 font-mono animate-pulse">
                                Ringing @{remoteUsername}...
                            </p>
                        )}
                        {callStatus === "connected" && (
                            <p className="text-xs text-muted-foreground/60 mt-4 max-w-sm mx-auto">
                                Remote video stream is simulated in this preview.
                            </p>
                        )}
                        {callStatus === "declined" && (
                            <div className="mt-6 inline-flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-full px-4 py-2">
                                <PhoneOff className="w-4 h-4 text-destructive" />
                                <span className="text-xs font-mono text-destructive">
                                    {remoteUsername} declined the call
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Local video PiP */}
                <div className="absolute bottom-6 right-6 w-48 h-32 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-2xl bg-secondary">
                    {!isVideoOff ? (
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                    />
                    ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-secondary text-muted-foreground">
                        <VideoOff className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-mono">Camera off</span>
                    </div>
                    )}
                    <div className="absolute top-2 left-2 bg-background/80 backdrop-blur rounded px-2 py-0.5">
                        <span className="text-[10px] font-mono text-foreground/80">You</span>
                    </div>
                    {isMuted && (
                    <div className="absolute bottom-2 right-2 bg-destructive/90 rounded-full p-1.5">
                        <MicOff className="w-3 h-3 text-destructive-foreground" />
                    </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="px-6 py-6 border-t border-border/50 bg-card/30">
                <div className="flex items-center justify-center gap-3">
                    <Button
                        onClick={toggleAudio}
                        variant={isMuted ? "destructive" : "secondary"}
                        size="icon"
                        className="h-14 w-14 rounded-full"
                        aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                        disabled={callStatus === "declined"}
                    >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>

                    <Button
                        onClick={toggleVideo}
                        variant={isVideoOff ? "destructive" : "secondary"}
                        size="icon"
                        className="h-14 w-14 rounded-full"
                        aria-label={isVideoOff ? "Start video" : "Stop video"}
                        disabled={callStatus === "declined"}
                    >
                        {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        className="h-14 w-14 rounded-full"
                        aria-label="Speaker"
                        disabled={callStatus === "declined"}
                    >
                    <Volume2 className="w-5 h-5" />
                    </Button>

                    <div className="w-px h-10 bg-border mx-2" />

                    <Button
                        onClick={() => {if (remoteId) endCall(remoteId)}}
                        variant="destructive"
                        className="h-14 px-8 rounded-full font-mono text-sm"
                    >
                        <PhoneOff className="w-5 h-5" />
                        {callStatus === "calling" ? "Cancel" : callStatus === "declined" ? "Close" : "End call"}
                    </Button>
                </div>
                <p className="text-center text-[10px] text-muted-foreground mt-4 font-mono">
                    🔒 Call protected by sect end-to-end encryption
                </p>
            </div>
        </div>
    </div>
    );
};

export default VideoCallModal;
