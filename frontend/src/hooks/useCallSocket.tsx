import { useShallow } from "zustand/shallow";
import { callStore } from "../store/useCallStore";
import { useWebRTC } from "./useWebRTC";
import { useEffect } from "react";
import { socket } from "../lib/socket";

const useCallSocket = () => {

    const {
        setCallStatus, 
        setIncomingOffer,
        setRemoteId, 
        resetCall,
    } = callStore(useShallow((state) => ({
        setCallStatus: state.setCallStatus,
        setIncomingOffer: state.setIncomingOffer,
        setRemoteId: state.setRemoteId,
        resetCall: state.resetCall
    })));

    const { handleRemoteAnswer, addIceCandidate, cleanupConnection } = useWebRTC();

    useEffect(() => {
        socket.on('incoming-call', ({ from, offer }) => {
            setRemoteId(from);
            setIncomingOffer(offer);
            setCallStatus('receiving');
        });

        socket.on('call-answered', handleRemoteAnswer);

        socket.on('call-declined', () => {
            cleanupConnection();
            resetCall();
        });

        socket.on('ice-candidate', addIceCandidate);

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
