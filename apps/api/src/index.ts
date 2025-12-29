import Fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import type { FastifyRequest, FastifyReply } from "fastify";

import { appRouter } from "./trpc/appRouter";
import { createContext } from "./context";
import { initSocket, getIO } from "./socket";

const server = Fastify({ logger: true });

async function bootstrap() {
  // socket init
  initSocket(server.server);

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

  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  const io = getIO();
  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);
  });

  await server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext: async (opts: {
        req: FastifyRequest;
        res: FastifyReply;
      }) => createContext(opts.req, opts.res),
    },
  });

  const port = Number(process.env.PORT ?? 4000);
  await server.listen({ port, host: "0.0.0.0" });
  console.log(`🚀 Server running on ${port}`);
}

bootstrap().catch((err) => {
  server.log.error(err);
  process.exit(1);
});

export { server };
