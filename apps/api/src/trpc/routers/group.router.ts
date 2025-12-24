import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc.js";
import { TRPCError } from "@trpc/server";
export const groupRouter = router({
  // Endpoint 1: Get all groups
  getGroups: publicProcedure.query(async ({ ctx }) => {
    const groups = await ctx.prisma.group.findMany({
      where: {
        OR: [
          { privacy: "PUBLIC" },
          ctx.session?.user?.id
            ? {
              members: {
                some: {
                  userId: ctx.session.user.id,
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return groups.map((group: any) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      image: group.image,
      memberCount: group._count.members,
    }));
  }),
  // Endpoint 2: Get single group
  getGroupById: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findUnique({
        where: { id: input.groupId },
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
              userId: ctx.session?.user?.id || "",
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
    }),
  // Endpoint 3: Get group posts
  getGroupPosts: publicProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: { groupId: input.groupId },
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
        orderBy: {
          createdAt: "desc",
        },
      });
      return posts.map((post: any) => ({
        id: post.id,
        text: post.content,
        imageUrl: post.images[0] || null,
        time: formatTimeAgo(post.createdAt),
        name: post.author.name || "Unknown",
        username: post.author.name?.toLowerCase().replace(/\s+/g, '') || "unknown",
        userId: post.author.id,
        avatarUrl: post.author.avatarUrl || post.author.image,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
      }));
    }),
  // Endpoint 4: Get user's top groups
  getTopGroups: protectedProcedure.query(async ({ ctx }) => {
    const groups = await ctx.prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
            status: "ACCEPTED",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });
    return groups.map((group: any) => ({
      id: group.id,
      name: group.name,
    }));
  }),
  // Endpoint 5: Join a group
  joinGroup: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findUnique({
        where: { id: input.groupId },
      });
      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group not found",
        });
      }
      const existingMember = await ctx.prisma.groupMember.findUnique({
        where: {
          userId_groupId: {
            userId: ctx.session.user.id,
            groupId: input.groupId,
          },
        },
      });
      if (existingMember) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Already a member",
        });
      }
      const status = group.privacy === "PUBLIC" ? "ACCEPTED" : "PENDING";
      await ctx.prisma.groupMember.create({
        data: {
          userId: ctx.session.user.id,
          groupId: input.groupId,
          status,
          role: "MEMBER",
        },
      });
      return { success: true, status, groupId: input.groupId };
    }),
  // Endpoint 6: Create a group
  createGroup: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(50),
        description: z.string().max(200).optional(),
        privacy: z.enum(["PUBLIC", "PRIVATE"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.create({
        data: {
          name: input.name,
          description: input.description,
          privacy: input.privacy,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "ADMIN",
              status: "ACCEPTED",
            },
          },
        },
      });
      return group;
    }),
});
// Helper function
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return `${Math.floor(seconds / 604800)}w`;
}