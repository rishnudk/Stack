import { z } from "zod";
import { protectedProcedure, router } from "../trpc.ts";


export const postRouter = router({
  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        images: z.array(z.string()).default([]), // S3 URLs
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          content: input.content,
          images: input.images,
          authorId: ctx.session.user.id,
        },
      });
    }),

  getPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          author: true,
          likes: true,
          comments: true,
        },
      });

      let nextCursor = null;
      if (posts.length > input.limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return { posts, nextCursor };
    }),

  getPostById: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: { id: input.postId },
        include: {
          author: true,
          likes: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });

      return post;
    }),
});
