import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRouter } from './trpc/appRouter.ts';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { PrismaClient } from '@prisma/client';
import { createContext } from './context.ts';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { Server } from 'socket.io';



const prisma = new PrismaClient();

  let io: Server | undefined;


const server = Fastify({ logger: true });

// Parse JSON bodies
server.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
  try {
    const json = body ? JSON.parse(body as string) : {};
    done(null, json);
  } catch (err) {
    done(err as Error, undefined);
  }
});

server.addHook('preHandler', async (request, reply) => {
  console.log('Raw body:', request.body);
});

async function start() {
  await server.register(cors, {
    origin: true, // Allow all origins (in production, specify your frontend URL)
    credentials: true, // Allow cookies
  });


  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: async (opts: { req: FastifyRequest; res: FastifyReply }) => {
        return createContext(opts.req, opts.res, io);
      },
    },
  });



  await server.ready();
  io = new Server(server.server, {
    cors: {
      origin: true,
      credentials: true,
    }
  });

  io.on('connection', (socket) => {
    console.log('socked connected', socket.id)

    socket.on('join_conversation', (conversationId: string) => {
      socket.join(conversationId)
      console.log(`Socket ${socket.id} joined  ${conversationId}`);
    })
  });

  try {
    await server.listen({ port: 4000 });
    console.log('Server listening on http://localhost:4000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
