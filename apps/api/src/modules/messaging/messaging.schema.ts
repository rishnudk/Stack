import { z } from "zod";

// getMessages
export const getMessagesSchema = z.object({
    conversationId: z.string(),
});

// startConversation
export const startConversationSchema = z.object({
    otherUserId: z.string(),
});

// sendMessage
export const sendMessageSchema = z.object({
    conversationId: z.string(),
    content: z.string(),
});
