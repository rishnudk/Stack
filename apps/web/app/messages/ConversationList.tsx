"use client";
import { trpc } from "@/utils/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useSocket } from "./SocketContext";

interface ConversationListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  sessionUserId: string;
}

export default function ConversationList({
  selectedId,
  onSelect,
  sessionUserId,
}: ConversationListProps) {
  // ✅ 1. Get onlineUsers from context inside the component
  const { socket, isConnected, onlineUsers } = useSocket();
  const utils = trpc.useUtils();

  const { data: conversations, isLoading } = trpc.messaging.getConversations.useQuery();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleConversationUpdated = (data: { conversationId: string; lastMessage: any }) => {
      utils.messaging.getConversations.invalidate();
    };

    socket.on("conversation_updated", handleConversationUpdated);
    return () => {
      socket.off("conversation_updated", handleConversationUpdated);
    };
  }, [socket, isConnected, utils]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-neutral-900 border-r border-neutral-800">
      <div className="p-4 border-b border-neutral-800">
        <h2 className="font-semibold text-lg text-white">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {conversations?.map((conv: any) => {
          const otherParticipant = conv.participants.find((p: any) => p.user.id !== sessionUserId)?.user;
          const lastMessage = conv.messages[0];

          // ✅ 2. Check if this specific participant is in the online list
          const isOnline = onlineUsers.includes(otherParticipant?.id || "");

          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full p-4 flex gap-4 hover:bg-neutral-800 transition-colors text-left ${selectedId === conv.id ? "bg-neutral-800" : ""
                }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border border-neutral-700">
                  <AvatarImage src={otherParticipant?.image || ""} />
                  <AvatarFallback>{otherParticipant?.name?.[0] || "?"}</AvatarFallback>
                </Avatar>

                {isOnline && (
                  <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-neutral-900 rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-white truncate">
                    {otherParticipant?.name || "Unknown User"}
                  </span>
                  {lastMessage && (
                    <span className="text-xs text-neutral-500">
                      {format(new Date(lastMessage.createdAt), "HH:mm")}
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-400 truncate">
                  {lastMessage?.content || "No messages yet"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}