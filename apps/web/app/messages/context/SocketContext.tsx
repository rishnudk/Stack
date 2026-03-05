'use client'

import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextProps {
    socket: Socket | null;
    isConnected: boolean;
    onlineUsers: string[];
}

const SocketContext = createContext<SocketContextProps>({
    socket: null,
    isConnected: false,
    onlineUsers: [],
})

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        // If no session or no apiToken, do nothing
        if (!session?.apiToken) return;

        const socketInstance = io(process.env.NEXT_PUBLIC_API_URL, {
            withCredentials: true,
            autoConnect: true,
            auth: {
                token: session.apiToken
            }
        })

        // Listen for online/offline updates
        socketInstance.on("user_status", ({ userId, status }) => {
            setOnlineUsers(prev => {
                if (status === "online") {
                    return prev.includes(userId) ? prev : [...prev, userId];
                } else {
                    return prev.filter(id => id !== userId);
                }
            });
        });
        socketInstance.on("connect", () => {
            console.log("🔌 [SOCKET] Connected to server");
            setIsConnected(true);
        })
        socketInstance.on("disconnect", () => {
            console.log("🔌 [SOCKET] Disconnected from server");
            setIsConnected(false);
        })

        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect();
        }
    }, [session?.apiToken]) // 👈 Re-run when token is available
    return (
        <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}