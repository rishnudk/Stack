"use client";
import { trpc } from "@/utils/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Loader2, Send, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "./SocketContext";

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
  const [liveMessages, setLiveMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // ✅ 1. Typing state and Socket hooks
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { socket, isConnected } = useSocket();
  const utils = trpc.useUtils();

  const { data: messages, isLoading } = trpc.messaging.getMessages.useQuery({ conversationId });

  const sendMessageMutation = trpc.messaging.sendMessage.useMutation({
    onSuccess: () => {
      setInput("");
      socket?.emit("stop_typing", { conversationId }); // Stop typing on send
      utils.messaging.getMessages.invalidate({ conversationId });
      utils.messaging.getConversations.invalidate();
    },
  });

  useEffect(() => {
    if (messages) setLiveMessages(messages);
  }, [messages]);

  // ✅ 2. Listen for Typing Events
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleTyping = (data: { conversationId: string }) => {
      if (data.conversationId === conversationId) setIsOtherUserTyping(true);
    };
    const handleStopTyping = (data: { conversationId: string }) => {
      if (data.conversationId === conversationId) setIsOtherUserTyping(false);
    };

    socket.on("user_typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    
    return () => {
      socket.off("user_typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, isConnected, conversationId]);

  // ✅ 3. New Change Handler with Debounce
  const handleInputChange = (val: string) => {
    setInput(val);
    if (!socket || !isConnected) return;

    socket.emit("typing", { conversationId });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { conversationId });
    }, 2000);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [liveMessages, isOtherUserTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessageMutation.mutate({ conversationId, content: input });
  };

  if (isLoading) return (
    <div className="h-full flex items-center justify-center p-4">
      <Loader2 className="animate-spin text-neutral-500" />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
        <span className="font-semibold text-white">Chat</span>
        <Button variant="secondary" onClick={onVideoCall} size="sm">
          <Video size={18} />
        </Button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {liveMessages?.map((msg) => {
          const isMe = msg.senderId === sessionUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end gap-2 max-w-[80%]">
                {!isMe && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender.image || ""} />
                    <AvatarFallback>{msg.sender.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-200"}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ 4. Show Typing Indicator above input */}
      {isOtherUserTyping && (
        <div className="px-5 py-1 text-xs text-neutral-500 italic animate-pulse">
          User is typing...
        </div>
      )}

      <div className="p-4 border-t border-neutral-800">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
          <Input
            value={input}
            onChange={(e) => handleInputChange(e.target.value)} // ✅ 5. Uses new handler
            placeholder="Type a message..."
            className="bg-neutral-900 border-neutral-800"
          />
          <Button type="submit" disabled={!input.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}