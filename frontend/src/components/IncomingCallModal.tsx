import { useEffect } from "react";
import { PhoneOff, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { useWebRTC } from "../hooks/useWebRTC";
import { callStore } from "../store/useCallStore";
import { useShallow } from "zustand/shallow";

    interface IncomingCallModalProps {
        isOpen: boolean;
        closeCall: () => void;
    }

    const IncomingCallModal = ({
        isOpen,
        closeCall,
    }: IncomingCallModalProps) => {
        const { acceptCall, endCall } = useWebRTC();
        const { 
            remoteId, 
            remoteUsername,
            incomingOffer 
        } = callStore(
            useShallow((state) => ({
                remoteId: state.remoteId,
                remoteUsername: state.remoteUsername,
                incomingOffer: state.incomingOffer
            })));

        useEffect(() => {
            if (!isOpen) return;
            const timeout = setTimeout(() => {if (remoteId) endCall(remoteId)}, 30000);
            return () => clearTimeout(timeout);
        }, [isOpen, endCall, remoteId]);

        if (!isOpen) return null;

        return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-sm bg-gradient-card border border-border rounded-3xl p-8 shadow-2xl glow-primary">
                    {/* Header */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Lock className="w-3 h-3 text-primary" />
                    <span className="text-[11px] font-mono text-primary uppercase tracking-wider">
                        Incoming encrypted video call
                    </span>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        {/* Pulse rings */}
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                        <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                        <div className="relative w-28 h-28 rounded-full bg-secondary border-2 border-primary/40 flex items-center justify-center">
                            <span className="font-mono text-4xl font-semibold text-foreground/80">
                                {remoteUsername?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <h2 className="font-mono text-xl font-semibold mb-1">{remoteUsername}</h2>
                    <p className="text-xs text-muted-foreground/60 mt-3">is calling you...</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-around">
                    <div className="flex flex-col items-center gap-2">
                        <Button
                            onClick={() => {if (remoteId) endCall(remoteId); closeCall();}}
                            variant="destructive"
                            size="icon"
                            className="h-16 w-16 rounded-full"
                        >
                        <PhoneOff className="w-6 h-6" />
                        </Button>
                        <span className="text-[11px] font-mono text-muted-foreground">Decline</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <Button
                            onClick={() =>{if (remoteId && remoteUsername && incomingOffer) acceptCall(remoteId, remoteUsername, incomingOffer)}}
                            size="icon"
                            className={"h-16 w-16 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary animate-pulse"}
                        >
                        </Button>
                        <span className="text-[11px] font-mono text-primary">Accept</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomingCallModal;
