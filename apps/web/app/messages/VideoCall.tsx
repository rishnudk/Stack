"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "./SocketContext";
import { Button } from "@repo/ui/button";
import { PhoneOff } from "lucide-react";

interface VideoCallProps {
    otherUserId: string;
    isIncoming?: boolean;
    incomingOffer?: any;
    fromSocketId?: string; // This is the socket ID of the OTHER person
    onClose: () => void;
}

export default function VideoCall({
    otherUserId,
    isIncoming,
    incomingOffer,
    fromSocketId: initialSocketId,
    onClose
}: VideoCallProps) {
    const { socket } = useSocket();
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const pc = useRef<RTCPeerConnection | null>(null);
    const remoteSocketIdRef = useRef<string | null>(initialSocketId || null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // Buffers for WebRTC signaling
    const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]); // Incoming
    const outgoingIceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]); // Outgoing
    const hasRemoteDescription = useRef(false);
    const isInitialized = useRef(false);
    const localStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (isInitialized.current) return;
        isInitialized.current = true;

        console.log("📞 [VideoCall] Initializing...", { isIncoming, initialSocketId, otherUserId });

        const init = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                console.log("📷 [VideoCall] Local stream acquired");
                setLocalStream(stream);
                localStreamRef.current = stream;
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;

                pc.current = new RTCPeerConnection({
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
                });

                // Log connection state changes
                pc.current.oniceconnectionstatechange = () => {
                    console.log("⚡ [WebRTC] ICE Connection State:", pc.current?.iceConnectionState);
                };
                pc.current.onconnectionstatechange = () => {
                    console.log("⚡ [WebRTC] Connection State:", pc.current?.connectionState);
                };

                stream.getTracks().forEach(track => {
                    console.log(`🚀 [VideoCall] Adding local track: ${track.kind}`);
                    pc.current?.addTrack(track, stream);
                });

                pc.current.ontrack = (event) => {
                    console.log("📥 [VideoCall] Received remote track", event.streams[0]);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                pc.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        if (remoteSocketIdRef.current) {
                            console.log("📤 [VideoCall] Sending ICE candidate to:", remoteSocketIdRef.current);
                            socket?.emit("ice-candidate", {
                                toSocketId: remoteSocketIdRef.current,
                                candidate: event.candidate
                            });
                        } else {
                            console.log("⏳ [VideoCall] Queuing outgoing ICE candidate (no remoteSocketId yet)");
                            outgoingIceCandidatesQueue.current.push(event.candidate.toJSON());
                        }
                    }
                };

                if (isIncoming && incomingOffer) {
                    console.log("📥 [VideoCall] Handling incoming offer");
                    await pc.current.setRemoteDescription(new RTCSessionDescription(incomingOffer));
                    hasRemoteDescription.current = true;

                    // Process queued candidates
                    while (iceCandidatesQueue.current.length > 0) {
                        const candidate = iceCandidatesQueue.current.shift();
                        if (candidate) await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
                    }

                    const answer = await pc.current.createAnswer();
                    await pc.current.setLocalDescription(answer);
                    console.log("📤 [VideoCall] Sending answer to:", initialSocketId);
                    socket?.emit("answer-call", { toSocketId: initialSocketId, answer });
                } else {
                    console.log("📤 [VideoCall] Creating offer for user:", otherUserId);
                    const offer = await pc.current.createOffer();
                    await pc.current.setLocalDescription(offer);
                    socket?.emit("call-user", { toUserId: otherUserId, offer });
                }
            } catch (err) {
                console.error("❌ [VideoCall] Initialization error:", err);
            }
        };

        init();

        const handleCallAnswered = async ({ answer, fromSocketId }: { answer: any, fromSocketId: string }) => {
            console.log("📥 [VideoCall] Call answered by socket:", fromSocketId);
            remoteSocketIdRef.current = fromSocketId;
            if (pc.current) {
                await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
                hasRemoteDescription.current = true;

                // Process queued incoming candidates
                while (iceCandidatesQueue.current.length > 0) {
                    const candidate = iceCandidatesQueue.current.shift();
                    if (candidate) await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
                }

                // Process queued outgoing candidates
                while (outgoingIceCandidatesQueue.current.length > 0) {
                    const candidate = outgoingIceCandidatesQueue.current.shift();
                    if (candidate) {
                        console.log("📤 [VideoCall] Sending buffered outgoing ICE candidate to:", fromSocketId);
                        socket?.emit("ice-candidate", { toSocketId: fromSocketId, candidate });
                    }
                }
            }
        };

        const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            console.log("📥 [VideoCall] Received ICE candidate");
            if (hasRemoteDescription.current && pc.current) {
                await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
                console.log("⏳ [VideoCall] Queuing incoming ICE candidate (remote description not set)");
                iceCandidatesQueue.current.push(candidate);
            }
        };

        socket?.on("call-answered", handleCallAnswered);
        socket?.on("ice-candidate", handleIceCandidate);

        return () => {
            console.log("🧹 [VideoCall] Cleaning up...");
            isInitialized.current = false;
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(t => {
                    console.log(`🛑 [VideoCall] Stopping track: ${t.kind}`);
                    t.stop();
                });
            }
            pc.current?.close();
            socket?.off("call-answered", handleCallAnswered);
            socket?.off("ice-candidate", handleIceCandidate);
        };
    }, [socket, otherUserId, isIncoming, incomingOffer, initialSocketId]);

    return (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
            <div className="relative w-full max-w-4xl aspect-video bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />
                <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute bottom-4 right-4 w-48 aspect-video bg-black rounded-lg border-2 border-blue-600 object-cover shadow-lg"
                />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <Button
                        variant="danger"
                        size="lg"
                        className="rounded-full w-16 h-16 shadow-xl hover:scale-110 transition-transform"
                        onClick={onClose}
                    >
                        <PhoneOff size={32} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
