import type { PrismaClient } from "@prisma/client";
import type { Server as SocketIOServer } from "socket.io";

// ──────────────────────────────────────────────
// GET CONVERSATIONS (sidebar)
// ──────────────────────────────────────────────
export async function getConversations(
    prisma: PrismaClient,
    userId: string
) {
    return prisma.conversation.findMany({
        where: {
            participants: {
                some: { userId },
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
                take: 1,
            },
        },
        orderBy: { updatedAt: "desc" },
    });
}

// ──────────────────────────────────────────────
// GET MESSAGES (for a specific chat)
// ──────────────────────────────────────────────
export async function getMessages(
    prisma: PrismaClient,
    userId: string,
    conversationId: string
) {
    // Mark as read when opened
    await prisma.conversationParticipant.updateMany({
        where: {
            conversationId,
            userId,
        },
        data: { hasSeenLatest: true },
    });

    return prisma.directMessage.findMany({
        where: { conversationId },
        orderBy: { createdAt: "asc" },
        include: {
            sender: { select: { id: true, name: true, image: true } },
        },
    });
}

// ──────────────────────────────────────────────
// START CONVERSATION (or find existing)
// ──────────────────────────────────────────────
export async function startConversation(
    prisma: PrismaClient,
    userId: string,
    otherUserId: string
) {
    // Check if conversation already exists between these 2
    const existing = await prisma.conversation.findFirst({
        where: {
            AND: [
                { participants: { some: { userId } } },
                { participants: { some: { userId: otherUserId } } },
            ],
        },
        include: { participants: true },
    });

    // Double check it's strictly a 1-on-1 between these two
    if (existing && existing.participants.length === 2) {
        return existing;
    }

    if (existing) return existing;

    // Create new one
    return prisma.conversation.create({
        data: {
            participants: {
                create: [
                    { userId, hasSeenLatest: true },
                    { userId: otherUserId, hasSeenLatest: false },
                ],
            },
        },
    });
}

// ──────────────────────────────────────────────
// SEND MESSAGE
// ──────────────────────────────────────────────
export async function sendMessage(
    prisma: PrismaClient,
    userId: string,
    io: SocketIOServer | undefined,
    input: { conversationId: string; content: string }
) {
    const message = await prisma.directMessage.create({
        data: {
            content: input.content,
            conversationId: input.conversationId,
            senderId: userId,
        },
        include: {
            sender: { select: { id: true, name: true, image: true } },
        },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
        where: { id: input.conversationId },
        data: { updatedAt: new Date() },
    });

    // Emit Socket.IO events
    if (io) {
        io.to(input.conversationId).emit("new_message", message);
        io.emit("conversation_updated", {
            conversationId: input.conversationId,
            lastMessage: message,
        });
    }

    // Mark others as unread
    await prisma.conversationParticipant.updateMany({
        where: {
            conversationId: input.conversationId,
            userId: { not: userId },
        },
        data: { hasSeenLatest: false },
    });

    return message;
}
