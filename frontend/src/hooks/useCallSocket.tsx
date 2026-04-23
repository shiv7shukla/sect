import { useShallow } from "zustand/shallow";
import { callStore } from "../store/useCallStore";
import { useWebRTC } from "./useWebRTC";
import { useEffect } from "react";
import { socket } from "../lib/socket";

const useCallSocket = () => {

    const {
        setCallStatus, 
        setIncomingOffer,
        setRemoteSocketId, 
        resetCall,
    } = callStore(useShallow((state) => ({
        setCallStatus: state.setCallStatus,
        setIncomingOffer: state.setIncomingOffer,
        setRemoteSocketId: state.setRemoteSocketId,
        resetCall: state.resetCall
    })));

    const { handleRemoteAnswer, addIceCandidate, cleanupConnection } = useWebRTC();

    useEffect(() => {
        // Another user is calling us
    socket.on('incoming-call', ({ from, offer }) => {
        setRemoteSocketId(from);
        setIncomingOffer(offer);
        setCallStatus('receiving');
    });

    // Our call was answered — complete the handshake
    socket.on('call-answered', handleRemoteAnswer);

    // Our call was declined — reset immediately
    socket.on('call-declined', () => {
        cleanupConnection();
        resetCall();
    });

    // Relay ICE candidates to the peer connection
    socket.on('ice-candidate', addIceCandidate);

    // Other party ended the call
    socket.on('call-ended', () => {
        cleanupConnection();
        resetCall();
    });

    return () => { socket.disconnect(); };
    }, [])

    return (
        <div>
        </div>
    )
}

export default useCallSocket
