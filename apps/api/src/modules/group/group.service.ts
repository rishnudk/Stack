import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

// ── Helper ──
function formatTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return `${Math.floor(seconds / 604800)}w`;
}

// ──────────────────────────────────────────────
// GET ALL GROUPS
// ──────────────────────────────────────────────
export async function getGroups(
    prisma: PrismaClient,
    viewerId: string | undefined
) {
    const groups = await prisma.group.findMany({
        where: {
            OR: [
                { privacy: "PUBLIC" },
                viewerId
                    ? {
                        members: {
                            some: {
                                userId: viewerId,
                                status: "ACCEPTED",
                            },
                        },
                    }
                    : {},
            ],
        },
        include: {
            _count: {
                select: {
                    members: {
                        where: { status: "ACCEPTED" },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return groups.map((group: any) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        image: group.image,
        memberCount: group._count.members,
    }));
}

// ──────────────────────────────────────────────
// GET GROUP BY ID
// ──────────────────────────────────────────────
export async function getGroupById(
    prisma: PrismaClient,
    viewerId: string | undefined,
    groupId: string
) {
    const group = await prisma.group.findUnique({
        where: { id: groupId },
        include: {
            _count: {
                select: {
                    members: {
                        where: { status: "ACCEPTED" },
                    },
                },
            },
            members: {
                where: {
                    userId: viewerId || "",
                    status: "ACCEPTED",
                },
                take: 1,
            },
        },
    });

    if (!group) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group not found",
        });
    }

    return {
        id: group.id,
        name: group.name,
        description: group.description,
        image: group.image,
        privacy: group.privacy,
        guidelines: group.guidelines,
        memberCount: group._count.members,
        isMember: group.members.length > 0,
    };
}

// ──────────────────────────────────────────────
// GET GROUP POSTS
// ──────────────────────────────────────────────
export async function getGroupPosts(
    prisma: PrismaClient,
    groupId: string
) {
    const posts = await prisma.post.findMany({
        where: { groupId },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    avatarUrl: true,
                },
            },
            _count: {
                select: {
                    likes: true,
                    comments: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return posts.map((post: any) => ({
        id: post.id,
        text: post.content,
        imageUrl: post.images[0] || null,
        time: formatTimeAgo(post.createdAt),
        name: post.author.name || "Unknown",
        username: post.author.name?.toLowerCase().replace(/\s+/g, "") || "unknown",
        userId: post.author.id,
        avatarUrl: post.author.avatarUrl || post.author.image,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
    }));
}

// ──────────────────────────────────────────────
// GET TOP GROUPS (user's groups)
// ──────────────────────────────────────────────
export async function getTopGroups(
    prisma: PrismaClient,
    userId: string
) {
    const groups = await prisma.group.findMany({
        where: {
            members: {
                some: {
                    userId,
                    status: "ACCEPTED",
                },
            },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
    });

    return groups.map((group: any) => ({
        id: group.id,
        name: group.name,
    }));
}

// ──────────────────────────────────────────────
// JOIN GROUP
// ──────────────────────────────────────────────
export async function joinGroup(
    prisma: PrismaClient,
    userId: string,
    groupId: string
) {
    const group = await prisma.group.findUnique({
        where: { id: groupId },
    });

    if (!group) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group not found",
        });
    }

    const existingMember = await prisma.groupMember.findUnique({
        where: {
            userId_groupId: { userId, groupId },
        },
    });

    if (existingMember) {
        throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Already a member",
        });
    }

    const status = group.privacy === "PUBLIC" ? "ACCEPTED" : "PENDING";

    await prisma.groupMember.create({
        data: {
            userId,
            groupId,
            status,
            role: "MEMBER",
        },
    });

    return { success: true, status, groupId };
}

// ──────────────────────────────────────────────
// CREATE GROUP
// ──────────────────────────────────────────────
export async function createGroup(
    prisma: PrismaClient,
    userId: string,
    input: { name: string; description?: string; privacy: "PUBLIC" | "PRIVATE" }
) {
    return prisma.group.create({
        data: {
            name: input.name,
            description: input.description,
            privacy: input.privacy,
            members: {
                create: {
                    userId,
                    role: "ADMIN",
                    status: "ACCEPTED",
                },
            },
        },
    });
}
