import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io: Server;

// This Map will store: UserId -> Set of SocketIds
// A user might have multiple tabs open, so we store a Set of their socket IDs.
export const onlineUsers = new Map<string, Set<string>>();

export const initSocket = (httpServer: any) => {
  if (!io) {
    io = new Server(httpServer, {
      cors: {
        origin: true,
        credentials: true,
      },
    });

    // 1️⃣ AUTH MIDDLEWARE: Only allow users with a valid API Token
    io.use((socket, next) => {
      const token = socket.handshake.auth.token; // We will send this from frontend
      if (!token) return next(new Error("Unauthorized"));

      try {
        const decoded = jwt.verify(token, process.env.API_JWT_SECRET!) as { sub: string };
        (socket as any).userId = decoded.sub; // Attach userId to the socket
        next();
      } catch (err) {
        next(new Error("Invalid token"));
      }
    });

    io.on("connection", (socket) => {
      const userId = (socket as any).userId;
      console.log(`🔌 [SOCKET] User connected: ${userId} (Socket: ${socket.id})`);

      // 2️⃣ TRACK ONLINE STATUS
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId)?.add(socket.id);

      // Broadcast to EVERYONE that this user is now online
      io.emit("user_status", { userId, status: "online" });

      // Send the list of ALREADY online users to this new connection
      const currentlyOnline = Array.from(onlineUsers.keys());
      socket.emit("initial_online_users", currentlyOnline);

      // 3️⃣ HANDLE TYPING EVENTS
      socket.on("typing", ({ conversationId }) => {
        // Send "user_typing" to everyone in that room EXCEPT the sender
        socket.to(conversationId).emit("user_typing", {
          conversationId,
          userId
        });
      });

      socket.on("stop_typing", ({ conversationId }) => {
        socket.to(conversationId).emit("stop_typing", {
          conversationId,
          userId
        });
      });

      socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
      });

      socket.on("leave_conversation", (conversationId) => {
        socket.leave(conversationId);
      });

      //video call singalling
      socket.on("call-user", ({ toUserId, offer }) => {
        console.log(`📞 [SOCKET] Call offer from ${userId} to user ${toUserId}`);
        //find the target user's socket
        const targetSockets = onlineUsers.get(toUserId);
        if (targetSockets) {
          targetSockets.forEach((socketId => {
            console.log(`🔗 [SOCKET] Forwarding offer to socket: ${socketId}`);
            io.to(socketId).emit("incoming-call", {
              offer,
              fromUserId: userId,
              fromSocketId: socket.id
            })
          }))
        } else {
          console.warn(`⚠️ [SOCKET] User ${toUserId} is not online for call`);
        }
      });

      socket.on("answer-call", ({ toSocketId, answer }) => {
        console.log(`📞 [SOCKET] Call answer from ${userId} to socket ${toSocketId}`);
        io.to(toSocketId).emit("call-answered", {
          answer,
          fromSocketId: socket.id,
        })
      })

      socket.on("ice-candidate", ({ toSocketId, candidate }) => {
        console.log(`❄️ [SOCKET] ICE candidate from ${userId} to socket ${toSocketId}`);
        io.to(toSocketId).emit("ice-candidate", {
          candidate,
          fromSocketId: socket.id,
        })
      })

      socket.on("disconnect", () => {
        const userSockets = onlineUsers.get(userId);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            onlineUsers.delete(userId);
            // Broadcast that they are offline only if ALL their tabs are closed
            io.emit("user_status", { userId, status: "offline" });
          }
        }
        console.log(`🔌 [SOCKET] User disconnected: ${userId}`);
      });
    });

    console.log("🔌 [SOCKET] initialized with Auth & Tracking");
  }
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("❌ Socket.IO not initialized yet");
  return io;
};