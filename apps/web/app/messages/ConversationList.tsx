"use client";
import { trpc } from "@/utils/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { format } from "date-fns";
import { Loader2, Plus } from "lucide-react";

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
  // Fetch conversations from our API
  const { data: conversations, isLoading } = trpc.messaging.getConversations.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-neutral-900 border-r border-neutral-800">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
        <h2 className="font-semibold text-lg text-white">Messages</h2>
        {/* We can add a 'New Chat' button here later */}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {conversations?.map((conv) => {
          // Find the "other" participant to display their name/avatar
          const otherParticipant = conv.participants.find(
            (p) => p.user.id !== sessionUserId
          )?.user;
          const lastMessage = conv.messages[0];

          return (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full p-4 flex gap-4 hover:bg-neutral-800 transition-colors text-left ${
                selectedId === conv.id ? "bg-neutral-800" : ""
              }`}
            >
              <Avatar className="h-12 w-12 border border-neutral-700">
                <AvatarImage src={otherParticipant?.image || ""} />
                <AvatarFallback>{otherParticipant?.name?.[0] || "?"}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-medium text-white truncate">
                    {otherParticipant?.name || "Unknown User"}
                  </span>
                  {lastMessage && (
                    <span className="text-xs text-neutral-500">
                      {format(new Date(lastMessage.createdAt), "MMM d")}
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

        {conversations?.length === 0 && (
          <div className="p-8 text-center text-neutral-500 text-sm">
            No conversations yet.
          </div>
        )}
      </div>
    </div>
  );
}