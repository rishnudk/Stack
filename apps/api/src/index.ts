import Fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import type { FastifyRequest, FastifyReply } from "fastify";

import { appRouter } from "./trpc/appRouter.js";
import { createContext } from "./context.js";
import { initSocket, getIO } from "./socket.js";

const server = Fastify({ logger: true });

// 🔥 INITIALIZE SOCKET AT MODULE LOAD TIME
initSocket(server.server);

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

async function start() {
  // -----------------------------
  // CORS
  // -----------------------------
  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  // -----------------------------
  // SOCKET EVENTS (GET SINGLETON)
  // -----------------------------
  const io = getIO(); // ✅ THIS WAS MISSING

  io.on("connection", (socket) => {
    console.log("🔌 [SOCKET.IO] Connected:", socket.id);

    socket.on("join_conversation", (conversationId: string) => {
      socket.join(conversationId);
      console.log("📥 Joined:", conversationId);
    });

    socket.on("leave_conversation", (conversationId: string) => {
      socket.leave(conversationId);
      console.log("📤 Left:", conversationId);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });

  // -----------------------------
  // tRPC
  // -----------------------------
  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext: async (opts: {
        req: FastifyRequest;
        res: FastifyReply;
      }) => {
        console.log("⚡ [INDEX] createContext callback triggered");
        return createContext(opts.req, opts.res);
      },
    },
  });

  // -----------------------------
  // START SERVER
  // -----------------------------
  await server.listen({ port: 4000 });
  console.log("🚀 Server running at http://localhost:4000");
}

start();
