import type { PrismaClient } from "@prisma/client";

// ──────────────────────────────────────────────
// GET COMMENTS (threaded, 2 levels deep)
// ──────────────────────────────────────────────
export async function getComments(
    prisma: PrismaClient,
    postId: string
) {
    return prisma.comment.findMany({
        where: {
            postId,
            parentId: null, // only top-level comments
        },
        include: {
            user: true,
            likes: true,
            replies: {
                include: {
                    user: true,
                    likes: true,
                    replies: {
                        include: {
                            user: true,
                            likes: true,
                        },
                        orderBy: { createdAt: "asc" },
                    },
                },
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

// ──────────────────────────────────────────────
// ADD COMMENT
// ──────────────────────────────────────────────
export async function addComment(
    prisma: PrismaClient,
    userId: string,
    input: { postId: string; content: string; parentId?: string }
) {
    return prisma.comment.create({
        data: {
            content: input.content,
            postId: input.postId,
            userId,
            parentId: input.parentId,
        },
        include: {
            user: true,
            likes: true,
        },
    });
}

// ──────────────────────────────────────────────
// TOGGLE COMMENT LIKE
// ──────────────────────────────────────────────
export async function toggleCommentLike(
    prisma: PrismaClient,
    userId: string,
    commentId: string
) {
    const existing = await prisma.commentLike.findFirst({
        where: { commentId, userId },
    });

    if (existing) {
        await prisma.commentLike.delete({ where: { id: existing.id } });
        return { liked: false };
    }

    await prisma.commentLike.create({
        data: { commentId, userId },
    });

    return { liked: true };
}
