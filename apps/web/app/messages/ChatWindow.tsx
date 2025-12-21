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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [liveMessages, setLiveMessages] = useState<any[]>([]);


  const { socket, isConnected } = useSocket();
  const utils = trpc.useContext();

  const { data: messages, isLoading } =
    trpc.messaging.getMessages.useQuery({ conversationId });

  const sendMessageMutation = trpc.messaging.sendMessage.useMutation({
    onSuccess: () => {
      setInput("");
      utils.messaging.getMessages.invalidate({ conversationId });
      utils.messaging.getConversations.invalidate();
    },
  });


  useEffect(() => {
  if (messages) {
    setLiveMessages(messages);
  }
}, [messages]);


  /* --------------------------------
     1️⃣ SOCKET LISTENER (ONCE)
  -------------------------------- */
useEffect(() => {
  if (!socket || !isConnected) return;

  const handleNewMessage = (message: any) => {
    if (message.conversationId !== conversationId) return;

    setLiveMessages((prev) => {
      // avoid duplicates
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  };

  socket.on("new_message", handleNewMessage);
  return () => socket.off("new_message", handleNewMessage);
}, [socket, isConnected, conversationId]);

  /* --------------------------------
     2️⃣ JOIN / LEAVE ROOM
  -------------------------------- */
  useEffect(() => {
    if (!socket || !isConnected) return;

    console.log("📥 Joining room:", conversationId);
    socket.emit("join_conversation", conversationId);

    return () => {
      console.log("📤 Leaving room:", conversationId);
      socket.emit("leave_conversation", conversationId);
    };
  }, [socket, isConnected, conversationId]);

  /* --------------------------------
     3️⃣ AUTO SCROLL
  -------------------------------- */
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
      <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
        <span className="font-semibold text-white">Chat</span>
        <Button variant="ghost" size="icon" onClick={onVideoCall}>
          <Video size={20} />
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {liveMessages?.map((msg) => {
          const isMe = msg.senderId === sessionUserId;

          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end gap-2 max-w-[70%]">
                {!isMe && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.sender.image || ""} />
                    <AvatarFallback>{msg.sender.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
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
      <div className="p-4 border-t border-neutral-800">
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
          />
          <Button type="submit" disabled={!input.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
}
