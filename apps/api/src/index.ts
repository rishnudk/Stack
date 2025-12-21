import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRouter } from './trpc/appRouter.ts';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { PrismaClient } from '@prisma/client';
import { createContext } from './context.ts';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { Server } from 'socket.io';



const prisma = new PrismaClient();

const ioContainer = { io: undefined as Server | undefined };


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

  // ✅ CRITICAL FIX: Create Socket.IO BEFORE registering tRPC
  // This ensures ioContainer.io is defined when createContext is called
  // Note: We don't need server.ready() - Socket.IO attaches to server.server directly

  console.log('🔌 [INIT] Creating Socket.IO server...');
  ioContainer.io = new Server(server.server, {
    cors: {
      origin: true,
      credentials: true,
    }
  });
  console.log('✅ [INIT] Socket.IO server created successfully');
  console.log('✅ [INIT] ioContainer.io is now:', !!ioContainer.io);

  // Setup Socket.IO connection handlers
  ioContainer.io.on('connection', (socket) => {
    console.log('\n🔌 [SOCKET.IO] New socket connected:', socket.id);
    console.log('   📊 Total connected sockets:', ioContainer.io?.engine.clientsCount);

    socket.on('join_conversation', (conversationId: string) => {
      console.log('\n📥 [JOIN] Socket joining conversation');
      console.log('   📌 Socket ID:', socket.id);
      console.log('   📌 ConversationId:', conversationId);

      socket.join(conversationId);

      const room = ioContainer.io?.sockets.adapter.rooms.get(conversationId);
      console.log('   📊 Sockets now in room:', room ? Array.from(room) : 'none');
      console.log('   📊 Total in room:', room ? room.size : 0);
      console.log('   ✅ Join complete\n');
    });

    socket.on('leave_conversation', (conversationId: string) => {
      console.log('\n📤 [LEAVE] Socket leaving conversation');
      console.log('   📌 Socket ID:', socket.id);
      console.log('   📌 ConversationId:', conversationId);

      socket.leave(conversationId);

      const room = ioContainer.io?.sockets.adapter.rooms.get(conversationId);
      console.log('   📊 Sockets remaining in room:', room ? Array.from(room) : 'none');
      console.log('   📊 Total remaining:', room ? room.size : 0);
      console.log('   ✅ Leave complete\n');
    });

    socket.on('disconnect', () => {
      console.log('\n🔴 [DISCONNECT] Socket disconnected:', socket.id);
      console.log('   📊 Remaining connected sockets:', ioContainer.io?.engine.clientsCount);
    });
  });

  // NOW register tRPC with Socket.IO already initialized
  console.log('🔌 [INIT] Registering tRPC with Socket.IO context...');
  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext: async (opts: { req: FastifyRequest; res: FastifyReply }) => {
        const path = opts.req.url;
        console.log(`🔧 [CONTEXT] Creating context for: ${path}`);
        console.log('   📌 io available:', !!ioContainer.io);
        return createContext(opts.req, opts.res, ioContainer.io);
      },
    },
  });
  console.log('✅ [INIT] tRPC registered successfully with io:', !!ioContainer.io);


  try {
    await server.listen({ port: 4000 });
    console.log('Server listening on http://localhost:4000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
