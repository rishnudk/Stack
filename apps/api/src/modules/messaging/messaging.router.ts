import { router, protectedProcedure } from "../../trpc/trpc";
import * as MessagingService from "./messaging.service";
import * as MessagingSchema from "./messaging.schema";

export const messagingRouter = router({
    getConversations: protectedProcedure
        .query(({ ctx }) =>
            MessagingService.getConversations(ctx.prisma, ctx.session.user.id)
        ),

    getMessages: protectedProcedure
        .input(MessagingSchema.getMessagesSchema)
        .query(({ ctx, input }) =>
            MessagingService.getMessages(ctx.prisma, ctx.session.user.id, input.conversationId)
        ),

    startConversation: protectedProcedure
        .input(MessagingSchema.startConversationSchema)
        .mutation(({ ctx, input }) =>
            MessagingService.startConversation(ctx.prisma, ctx.session.user.id, input.otherUserId)
        ),

    sendMessage: protectedProcedure
        .input(MessagingSchema.sendMessageSchema)
        .mutation(({ ctx, input }) =>
            MessagingService.sendMessage(ctx.prisma, ctx.session.user.id, ctx.io, input)
        ),
});
