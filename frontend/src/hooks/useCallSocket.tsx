import { useShallow } from "zustand/shallow";
import { callStore } from "../store/useCallStore";
import { useWebRTC } from "./useWebRTC";
import { useEffect } from "react";
import { socket } from "../lib/socket";

const useCallSocket = () => {

    const {
        setCallStatus, 
        setIncomingOffer,
        setRemote, 
        resetCall,

    } = callStore(useShallow((state) => ({
        setCallStatus: state.setCallStatus,
        setIncomingOffer: state.setIncomingOffer,
        setRemote: state.setRemote,
        resetCall: state.resetCall
    })));

    const { handleRemoteAnswer, addIceCandidate, cleanupConnection } = useWebRTC();

    useEffect(() => {
        socket.on('incoming-call', ({ fromId, from, offer }) => {
            setRemote(fromId, from);
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
