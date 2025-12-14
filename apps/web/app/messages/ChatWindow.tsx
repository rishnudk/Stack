"use client";
import { trpc } from "@/utils/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Loader2, Send, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatWindowProps {
  conversationId: string;
  sessionUserId: string;
  onVideoCall?: () => void;
}

export default function ChatWindow({
  conversationId,
  sessionUserId,
  onVideoCall,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // API Hooks
  const utils = trpc.useContext();
  const { data: messages, isLoading } = trpc.messaging.getMessages.useQuery(
    { conversationId },
    { refetchInterval: 3000 }
  );

  const sendMessageMutation = trpc.messaging.sendMessage.useMutation({
    onSuccess: () => {
      setInput("");
      utils.messaging.getMessages.invalidate({ conversationId });
      utils.messaging.getConversations.invalidate();
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessageMutation.mutate({
      conversationId,
      content: input,
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 backdrop-blur">
        <span className="font-semibold text-white">Chat</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onVideoCall}
          className="hover:bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <Video size={20} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4" ref={scrollRef}>
        {messages?.map((msg) => {
          const isMe = msg.senderId === sessionUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-end gap-2 max-w-[70%]">
                {!isMe && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender.image || ""} />
                    <AvatarFallback>{msg.sender.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl break-words text-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-neutral-800 text-neutral-200 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-neutral-900 border-neutral-700 focus:border-blue-500 text-white"
          />
          <Button
            type="submit"
            disabled={!input.trim() || sendMessageMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}