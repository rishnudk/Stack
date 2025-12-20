import { router, protectedProcedure } from "../trpc.ts";
import { z } from "zod";

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
      const message = await ctx.prisma.directMessage.create({
        data: {
          content: input.content,
          conversationId: input.conversationId,
          senderId: ctx.session.user.id,
        },
        include: {
          sender: { select: { id: true, name: true, image: true }}
        }
      });

      // Update conversation timestamp & notify other participant
      await ctx.prisma.conversation.update({
        where: { id: input.conversationId },
        data: { updatedAt: new Date() },
      });

      ctx.io?.to(input.conversationId).emit('new_message', message);

      ctx.io?.emit('conversation_updated', {
        conversationId: input.conversationId,
        lastMessage: message,
      })

      return message;
      // Mark others as unread
      await ctx.prisma.conversationParticipant.updateMany({
        where: {
          conversationId: input.conversationId,
          userId: { not: ctx.session.user.id },
        },
        data: { hasSeenLatest: false },
      });

      return message;
    }),
});