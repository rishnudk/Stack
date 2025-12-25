"use client";
import { useEffect, useState } from "react";
import type { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import VideoCall from "./VideoCall"
import { useSocket } from "./SocketContext";
import { Loader2, MessageCircle } from "lucide-react";
import { SocketProvider } from "./SocketContext";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/utils/trpc";

interface MessagesInterfaceProps {
  session: Session;
}

export default function MessagesInterface({ session }: MessagesInterfaceProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const { socket } = useSocket();
  const [callData, setCallData] = useState<{
    isActive: boolean;
    isIncoming: boolean;
    otherUserId: string;
    offer?: any;
    fromSocketId?: string;
  }>({ isActive: false, isIncoming: false, otherUserId: "" });

  useEffect(() => {
    if (!socket) return;
    socket.on("incoming-call", ({ offer, fromUserId, fromSocketId }) => {
      console.log("📥 [MessagesInterface] Incoming call event received", { fromUserId, fromSocketId });
      setCallData({ isActive: true, isIncoming: true, otherUserId: fromUserId, offer, fromSocketId });
    });
    return () => { socket.off("incoming-call"); };
  }, [socket]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const userIdToStart = searchParams.get("userId");
  const utils = trpc.useUtils();

  const { data: conversations } = trpc.messaging.getConversations.useQuery();

  const startConversationMutation = trpc.messaging.startConversation.useMutation({
    onSuccess: (conversation) => {
      //when done, select it!
      setSelectedConversationId(conversation.id)

      utils.messaging.getConversations.invalidate();

      router.replace("/messages");
    },
    onError: (error) => {
      console.error("Failed to start conversation:", error);
    }
  })

  useEffect(() => {
    if (userIdToStart) {
      startConversationMutation.mutate({
        otherUserId: userIdToStart
      })
    }
  }, [userIdToStart]);

  if (startConversationMutation.isPending) {
    return (
      <div className="flex w-full h-full bg-black items-center justify-center text-white">
        <Loader2 className="animate-spin mr-2" /> Loading...

      </div>
    )
  }
  return (
    <div className="flex w-full h-full bg-black overflow-hidden rounded-2xl border border-neutral-800 my-4 mr-4">
      {/* Sidebar List (35% width, min 300px) */}
      <div className="w-[350px] flex-shrink-0 h-full border-r border-neutral-800">
        <ConversationList
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
          sessionUserId={session.user.id}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 h-full bg-black relative">
        {selectedConversationId ? (
          <ChatWindow
            conversationId={selectedConversationId}
            sessionUserId={session.user.id}
            onVideoCall={() => {
              // Find the other user ID in the conversation
              const conversation = (conversations as any[])?.find((c) => c.id === selectedConversationId);
              const otherUser = (conversation?.participants as any[])?.find(
                (p: any) => p.userId !== session.user.id
              );
              if (otherUser) {
                setCallData({
                  isActive: true,
                  isIncoming: false,
                  otherUserId: otherUser.userId,
                });
              }
            }}
          />
        ) : (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-neutral-500 bg-neutral-900/20">
            <div className="p-4 bg-neutral-900 rounded-full mb-4">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-lg font-medium text-white">Select a conversation</h3>
            <p className="text-sm">Choose a person to start chatting</p>
          </div>
        )}
      </div>

      {/* Video Call Overlay */}
      {callData.isActive && (
        <VideoCall
          otherUserId={callData.otherUserId}
          isIncoming={callData.isIncoming}
          incomingOffer={callData.offer}
          fromSocketId={callData.fromSocketId}
          onClose={() => setCallData({ isActive: false, isIncoming: false, otherUserId: "" })}
        />
      )}
    </div>
  );
}