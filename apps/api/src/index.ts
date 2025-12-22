import Fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { Server } from "socket.io";
import type { FastifyRequest, FastifyReply } from "fastify";

import { appRouter } from "./trpc/appRouter.ts";
import { createContext } from "./context.ts";

const server = Fastify({ logger: true });

// ✅ SINGLE, GUARANTEED SOCKET.IO INSTANCE
let io: Server;

// -----------------------------
// JSON body parser
// -----------------------------
server.addContentTypeParser(
  "application/json",
  { parseAs: "string" },
  (_req, body, done) => {
    try {
      done(null, body ? JSON.parse(body as string) : {});
    } catch (err) {
      done(err as Error, undefined);
    }
  }
);

// -----------------------------
// Debug hook (optional)
// -----------------------------
server.addHook("preHandler", async (request) => {
  console.log("Raw body:", request.body);
});

async function start() {
  // -----------------------------
  // CORS
  // -----------------------------
  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  // -----------------------------
  // SOCKET.IO — MUST COME FIRST
  // -----------------------------
  console.log("🔌 [INIT] Creating Socket.IO server...");
  io = new Server(server.server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });
  console.log("✅ [INIT] Socket.IO server created");

  // -----------------------------
  // SOCKET EVENTS
  // -----------------------------
  io.on("connection", (socket) => {
    console.log("\n🔌 [SOCKET.IO] Connected:", socket.id);
    console.log("   📊 Total sockets:", io.engine.clientsCount);

    socket.on("join_conversation", (conversationId: string) => {
      console.log("\n📥 [JOIN]");
      console.log("   Socket:", socket.id);
      console.log("   Conversation:", conversationId);

      socket.join(conversationId);

      const room = io.sockets.adapter.rooms.get(conversationId);
      console.log("   Room size:", room?.size ?? 0);
    });

    socket.on("leave_conversation", (conversationId: string) => {
      console.log("\n📤 [LEAVE]");
      console.log("   Socket:", socket.id);
      console.log("   Conversation:", conversationId);

      socket.leave(conversationId);
    });

    socket.on("disconnect", () => {
      console.log("\n🔴 [DISCONNECT]", socket.id);
      console.log("   Remaining sockets:", io.engine.clientsCount);
    });
  });

  // -----------------------------
  // tRPC — AFTER Socket.IO
  // -----------------------------
  console.log("🔌 [INIT] Registering tRPC...");
  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext: async (opts: {
        req: FastifyRequest;
        res: FastifyReply;
      }) => {
        console.log("🔧 [CONTEXT]", opts.req.url);
        return createContext(opts.req, opts.res, io);
      },
    },
  });
  console.log("✅ [INIT] tRPC registered with Socket.IO");

  // -----------------------------
  // START SERVER
  // -----------------------------
  try {
    await server.listen({ port: 4000 });
    console.log("🚀 Server running at http://localhost:4000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
