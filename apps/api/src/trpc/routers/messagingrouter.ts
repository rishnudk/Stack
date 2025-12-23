import { router, protectedProcedure } from "../trpc.ts";
import { z } from "zod";

console.log('🔧 [INIT] messagingrouter.ts loaded at', new Date().toISOString());

export const messagingRouter = router({
  // 1. Get all conversations for the sidebar
  getConversations: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: ctx.session.user.id },
        },
      },
      include: {
        participants: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get the last message for the preview
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }),

  // 2. Get messages for a specific chat
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Mark as read when you open it
      await ctx.prisma.conversationParticipant.updateMany({
        where: {
          conversationId: input.conversationId,
          userId: ctx.session.user.id,
        },
        data: { hasSeenLatest: true },
      });

      return ctx.prisma.directMessage.findMany({
        where: { conversationId: input.conversationId },
        orderBy: { createdAt: "asc" }, // Oldest first
        include: {
          sender: { select: { id: true, name: true, image: true } },
        },
      });
    }),

  // 3. Start a new chat (or find existing)
  startConversation: protectedProcedure
    .input(z.object({ otherUserId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if conversation already exists between these 2
      const existing = await ctx.prisma.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId: ctx.session.user.id } } },
            { participants: { some: { userId: input.otherUserId } } },
          ],
        },
        include: {
          participants: true
        }
      });

      if (existing) return existing;

      // Create new one
      return ctx.prisma.conversation.create({
        data: {
          participants: {
            create: [
              { userId: ctx.session.user.id, hasSeenLatest: true },
              { userId: input.otherUserId, hasSeenLatest: false },
            ],
          },
        },
      });
    }),

  // 4. Send a message
  sendMessage: protectedProcedure
    .input(z.object({ conversationId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // ABSOLUTE FIRST LINE - CANNOT BE MISSED
      console.log('\n\n\n🚨🚨🚨 SEND MESSAGE MUTATION CALLED 🚨🚨🚨\n\n\n');

      // CRITICAL: Log IMMEDIATELY to confirm this code is running
      console.log('\n========================================');
      console.log('📨 [BACKEND] sendMessage mutation STARTED');
      console.log('========================================');
      console.log('   📌 ConversationId:', input.conversationId);
      console.log('   📌 Content:', input.content);
      console.log('   📌 SenderId:', ctx.session?.user?.id || 'NO USER');
      console.log('   📌 ctx.io exists:', !!ctx.io);
      console.log('========================================\n');

      const message = await ctx.prisma.directMessage.create({
        data: {
          content: input.content,
          conversationId: input.conversationId,
          senderId: ctx.session!.user.id,
        },
        include: {
          sender: { select: { id: true, name: true, image: true } }
        }
      });

      console.log('✅ Message created in DB:', message.id);

      // Update conversation timestamp & notify other participant
      await ctx.prisma.conversation.update({
        where: { id: input.conversationId },
        data: { updatedAt: new Date() },
      });

      try {
        console.log('\n🔌 [SOCKET.IO] Attempting to emit new_message');
        if (!ctx.io) {
          console.error('❌ FATAL: ctx.io is undefined! SOCKET EVENTS WILL NOT WORK!');
          console.error('   This means real-time messaging is broken.');
        } else {
          console.log('✅ ctx.io exists');

          // Debug: Log all sockets in the room
          const room = ctx.io.sockets.adapter.rooms.get(input.conversationId);
          console.log('📊 Sockets in room', input.conversationId, ':', room ? Array.from(room) : '⚠️ ROOM DOES NOT EXIST');
          console.log('📊 Total sockets in room:', room ? room.size : 0);

          // Log all connected sockets
          const allSockets = await ctx.io.fetchSockets();
          console.log('📊 Total connected sockets:', allSockets.length);
          allSockets.forEach((s, i) => {
            console.log(`   Socket ${i + 1}: ID=${s.id}, Rooms=${Array.from(s.rooms)}`);
          });

          console.log('📤 Emitting new_message to room:', input.conversationId);
          console.log('📤 Message payload:', JSON.stringify(message, null, 2));

          ctx.io.to(input.conversationId).emit('new_message', message);

          console.log('✅ new_message event emitted successfully');
        }

        console.log('📤 Emitting conversation_updated globally');
        ctx.io?.emit('conversation_updated', {
          conversationId: input.conversationId,
          lastMessage: message,
        });
      } catch (error) {
        console.error('❌ ERROR inSocket.IO emission:', error);
      }

      // Mark others as unread
      await ctx.prisma.conversationParticipant.updateMany({
        where: {
          conversationId: input.conversationId,
          userId: { not: ctx.session!.user.id },
        },
        data: { hasSeenLatest: false },
      });

      console.log('✅ [BACKEND] sendMessage mutation COMPLETED\n');
      return message;
    }),
});