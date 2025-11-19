import z from "zod";
import { protectedProcedure, router } from "../trpc.ts";

export const commentRouter = router({
  getComments: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
          parentId: null, // only get top-level comments
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

      return comments;
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        parentId: z.string().optional(), // for replies
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          postId: input.postId,
          userId: ctx.session.user.id,
          parentId: input.parentId,
        },
        include: {
          user: true,
          likes: true,
        },
      });
    }),

  toggleCommentLike: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.commentLike.findFirst({
        where: {
          commentId: input.commentId,
          userId: ctx.session.user.id,
        },
      });

      if (existing) {
        await ctx.prisma.commentLike.delete({ where: { id: existing.id } });
        return { liked: false };
      }

      await ctx.prisma.commentLike.create({
        data: {
          commentId: input.commentId,
          userId: ctx.session.user.id,
        },
      });

      return { liked: true };
    }),
});
