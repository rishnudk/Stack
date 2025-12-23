import { Server } from "socket.io";

let io: Server;

export const initSocket = (httpServer: any) => {
  if (!io) {
    io = new Server(httpServer, {
      cors: {
        origin: true,
        credentials: true,
      },
    });
    console.log("🔌 [SOCKET] initialized");
  }
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("❌ Socket.IO not initialized yet");
  }
  return io;
};
