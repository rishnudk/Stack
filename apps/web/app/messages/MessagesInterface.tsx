"use client";
import { useState } from "react";
import type { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { MessageCircle } from "lucide-react";
import { SocketProvider } from "./SocketContext";

interface MessagesInterfaceProps {
  session: Session;
}

export default function MessagesInterface({ session }: MessagesInterfaceProps) {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <SocketProvider>
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
              onVideoCall={() => console.log("Video Call Pressed")}
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
      </div>
    </SocketProvider>
  );
}