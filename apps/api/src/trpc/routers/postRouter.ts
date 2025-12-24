import { z } from "zod";
import { protectedProcedure, router, publicProcedure } from "../trpc.js";


export const postRouter = router({
  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        images: z.array(z.string()).default([]), // S3 URLs
        groupId: z.string().optional(), // Optional group ID for group posts
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          content: input.content,
          images: input.images,
          authorId: ctx.session.user.id,
          groupId: input.groupId,
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
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              avatarUrl: true,
            },
          },
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
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              avatarUrl: true,
            },
          },
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

  // Get posts by user ID for profile page
  getUserPosts: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: { authorId: input.userId },
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              avatarUrl: true,
            },
          },
          likes: true,
          comments: true,
        },
      });

      return posts;
    }),

  deletePost: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({ where: { id: input.id } });
      if (!post) throw new Error("Post not found");
      if (post.authorId !== ctx.session.user.id) throw new Error("Unauthorized");

      return ctx.prisma.post.delete({ where: { id: input.id } });
    }),

  editPost: protectedProcedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({ where: { id: input.id } });
      if (!post) throw new Error("Post not found");
      if (post.authorId !== ctx.session.user.id) throw new Error("Unauthorized");

      return ctx.prisma.post.update({
        where: { id: input.id },
        data: { content: input.content },
      });
    }),
});
