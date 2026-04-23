import { useRef, useCallback } from 'react';
import { callStore } from '../store/useCallStore';
import { useShallow } from 'zustand/shallow';
import { socket } from '../lib/socket';
import { authStore } from '../store/useAuthStore';

const ICE_SERVERS = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };

    export function useWebRTC() {
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const {
        setLocalStream, 
        setRemoteStream,
        setCallStatus, 
        setRemote,
        resetCall,
        localStream
    } = callStore(useShallow((state) => ({
        setLocalStream: state.setLocalStream,
        setRemoteStream: state.setRemoteStream,
        setCallStatus: state.setCallStatus,
        setRemote: state.setRemote,
        resetCall: state.resetCall,
        localStream: state.localStream
    })));

    const authUser = authStore((state) => state.authUser);

    const cleanupTracks = useCallback(() => {
        // Stop all local tracks to release the camera and mic indicator
        localStream?.getTracks().forEach((t) => t.stop());
        setLocalStream(null);
    }, [localStream, setLocalStream]);

    const getLocalMedia = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
        video: true, audio: true,
        });
        setLocalStream(stream);
        return stream;
    }, [setLocalStream]);

    const createPeerConnection = useCallback((stream: MediaStream, targetId: string) => {
        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        // Add our tracks so the remote gets our stream
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // When we receive remote tracks, store them
        pc.ontrack = (e) => setRemoteStream(e.streams[0]);

        // Relay ICE candidates through the server
        pc.onicecandidate = (e) => {
            if (e.candidate) {
            socket?.emit('ice-candidate', {
                to: targetId, candidate: e.candidate,
            });
            }
        };

        return pc;
    }, [socket, setRemoteStream]);

    const initiateCall = useCallback(async (targetId: string, targetUsername: string) => {
        const stream = await getLocalMedia();
        const pc = createPeerConnection(stream, targetId);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket?.emit('call-user', { to: targetId, fromId: authUser?._id, from: authUser?.username, offer });
        setRemote(targetId, targetUsername);
        setCallStatus('calling');
    }, [getLocalMedia, createPeerConnection, socket, setRemote, setCallStatus]);

    const acceptCall = useCallback(async (fromId: string, from: string, offer: RTCSessionDescriptionInit) => {
        const stream = await getLocalMedia();
        const pc = createPeerConnection(stream, fromId);

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket?.emit('answer-call', { to: fromId, answer });
        setRemote(fromId, from);
        setCallStatus('in-call');
    }, [getLocalMedia, createPeerConnection, socket, setRemote, setCallStatus]);

    const handleRemoteAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
        await pcRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
        setCallStatus('in-call');
    }, [setCallStatus]);

    const addIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
        await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    }, []);

    const cleanupConnection = useCallback(() => {
        pcRef.current?.close();
        pcRef.current = null;
    }, []);

    const declineCall = useCallback((fromId: string) => {
        // Emit to server → server relays 'call-declined' to the caller
        socket?.emit('decline-call', { to: fromId });
        // Reset our own state — we were only in 'receiving' status, no PC yet
        resetCall();
    }, [socket, resetCall]);

    const endCall = useCallback((remoteId: string) => {
        // Notify the other peer so their screen resets too
        socket?.emit('end-call', { to: remoteId });
        // Tear down in order: tracks first, then peer connection, then state
        cleanupTracks();
        cleanupConnection();
        resetCall();
    }, [socket, cleanupTracks, cleanupConnection, resetCall]);

    return { initiateCall, acceptCall, handleRemoteAnswer, addIceCandidate, cleanupConnection, declineCall, endCall };
}