'use client'

import { createContext, ReactNode, useContext, useState } from "react";
import { Socket } from "socket.io-client";

interface SocketContextProps {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({
    socket: null,
    isConnected: false,
})

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [ socket, setSocket ] = useState<Socket | null>(null); 
    const [ isConnected, setIsConnected ] = useState(false); 

    useEffect(() => {
        const socketInstance = io("http://localhost:4000", {
            withCredentials: true,
            autoConnect: false,
        })

        socketInstance.on("connect", () => {
            console.log("Socket connected on frontend", socketInstance.id);
            setIsConnected(true);
        })

        socketInstance.on("disconnect", () => {
            console.log("Socket disconnected on frontend");
            setIsConnected(false);
        })
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }
    }, [])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}