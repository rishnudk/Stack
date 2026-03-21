"use client";
import { trpc } from "@/utils/trpc";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Video, Smile } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

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
    const handleNewMessage = (message: any) => {
      if (message.conversationId === conversationId) {
        setLiveMessages((prev) => {
          // Prevent duplicates
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    };

    socket.emit("join_conversation", conversationId);

    socket.on("user_typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("new_message", handleNewMessage);

    return () => {
      socket.emit("leave_conversation", conversationId);
      socket.off("user_typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("new_message", handleNewMessage);
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
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-5">
        {liveMessages?.map((msg: any) => {
          const isMe = msg.senderId === sessionUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end gap-2 max-w-[80%] group">
                {!isMe && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={msg.sender.image || ""} />
                    <AvatarFallback>{msg.sender.name?.[0] || "?"}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`px-4 py-2.5 text-[15px] leading-relaxed max-w-full wrap-break-word shadow-sm ${isMe
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-br-sm"
                  : "bg-neutral-800 text-neutral-100 rounded-2xl rounded-bl-sm border border-neutral-700/50"
                  }`}>
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

      <div className="p-4 bg-neutral-900 border-t border-neutral-800/80">
        <div className="relative flex items-center gap-2 w-full">
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-[calc(100%+12px)] left-0 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200 shadow-xl border border-neutral-800 rounded-(--epr-picker-border-radius)">
              <EmojiPicker
                theme={Theme.DARK}
                onEmojiClick={(emojiData: any) => setInput((prev) => prev + emojiData.emoji)}
                autoFocusSearch={false}
              />
            </div>
          )}

          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-neutral-400 hover:text-white hover:bg-neutral-800 shrink-0 rounded-full h-11 w-11 transition-all"
          >
            <Smile size={24} />
          </Button>

          <form className="flex gap-2 flex-1 items-center" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <Input
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Type a message..."
              className="bg-neutral-800/50 border-neutral-700/50 rounded-full h-11 px-5 text-[15px] focus-visible:ring-1 focus-visible:ring-blue-500 transition-all placeholder:text-neutral-500"
            />
            <Button
              type="submit"
              disabled={!input.trim()}
              className="rounded-full h-11 w-11 shrink-0 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-white disabled:opacity-50 disabled:bg-neutral-800 disabled:shadow-none transition-all p-0 flex items-center justify-center"
            >
              <Send size={18} className="ml-1" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
