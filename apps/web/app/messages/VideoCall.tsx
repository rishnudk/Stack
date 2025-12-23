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

  useEffect(() => {
    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      pc.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      stream.getTracks().forEach(track => pc.current?.addTrack(track, stream));

      pc.current.ontrack = (event) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      };

      pc.current.onicecandidate = (event) => {
        if (event.candidate && remoteSocketIdRef.current) {
          socket?.emit("ice-candidate", { 
            toSocketId: remoteSocketIdRef.current, 
            candidate: event.candidate 
          });
        }
      };

      if (isIncoming && incomingOffer) {
        await pc.current.setRemoteDescription(new RTCSessionDescription(incomingOffer));
        const answer = await pc.current.createAnswer();
        await pc.current.setLocalDescription(answer);
        socket?.emit("answer-call", { toSocketId: initialSocketId, answer });
      } else {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        socket?.emit("call-user", { toUserId: otherUserId, offer });
      }
    };

    init();

    socket?.on("call-answered", async ({ answer, fromSocketId }) => {
      remoteSocketIdRef.current = fromSocketId;
      await pc.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket?.on("ice-candidate", async ({ candidate }) => {
      await pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      localStream?.getTracks().forEach(t => t.stop());
      pc.current?.close();
      socket?.off("call-answered");
      socket?.off("ice-candidate");
    };
  }, [socket, otherUserId, isIncoming, incomingOffer, initialSocketId]);

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="relative w-full max-w-4xl aspect-video bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
        <video 
          ref={localVideoRef} 
          autoPlay 
          muted 
          playsInline 
          className="absolute bottom-4 right-4 w-48 aspect-video bg-black rounded-lg border-2 border-blue-600 object-cover shadow-lg" 
        />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <Button variant="danger" size="lg" className="rounded-full w-16 h-16 shadow-xl hover:scale-110 transition-transform" onClick={onClose}>
            <PhoneOff size={32} />
          </Button>
        </div>
      </div>
    </div>
  );
}