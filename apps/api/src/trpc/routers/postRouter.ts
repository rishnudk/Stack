import { z } from "zod";
import { protectedProcedure, router, publicProcedure } from "../trpc";


export const postRouter = router({
  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        images: z.array(z.string()).default([]),
        groupId: z.string().optional(),
      }).refine(data => data.content.trim().length > 0 || data.images.length > 0, {
        message: "Post must have either content or at least one image",
        path: ["content"]
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
              skills: true,
            },
          },
          likes: true,
          comments: true,
          savedBy: {
            where: { userId: ctx.session.user.id },
            take: 1,
          },
        },
      });

      const nextCursor = posts.length > input.limit ? posts.pop()?.id : null;

      return {
        posts: posts.map((post) => ({
          ...post,
          isSaved: post.savedBy.length > 0,
        })),
        nextCursor,
      };
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
              skills: true,
            },
          },
          likes: true,
          comments: {
            include: {
              user: true,
            },
          },
          savedBy: {
            where: { userId: ctx.session.user.id },
            take: 1,
          },
        },
      });

      if (!post) return null;

      return {
        ...post,
        isSaved: post.savedBy.length > 0,
      };
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
              skills: true,
            },
          },
          likes: true,
          comments: true,
          savedBy: {
            where: { userId: ctx.session?.user?.id || "" },
            take: 1,
          },
        },
      });

      return posts.map((post) => ({
        ...post,
        isSaved: post.savedBy.length > 0,
      }));
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

  // Trending hashtags derived from recent post content
  getTrending: publicProcedure.query(async ({ ctx }) => {
    const since = new Date();
    since.setDate(since.getDate() - 7); // look-back window: 7 days

    const recentPosts = await ctx.prisma.post.findMany({
      where: { createdAt: { gte: since } },
      select: { content: true, likes: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    // Tally hashtags
    const tagMap = new Map<string, { count: number; likeWeight: number }>();
    const hashtagRegex = /#([\w]+)/g;

    for (const post of recentPosts) {
      const tags = [...post.content.matchAll(hashtagRegex)].map((m) =>
        m[1]!.toLowerCase()
      );
      const likeBoost = post.likes.length * 0.5;

      for (const tag of new Set(tags)) {
        const prev = tagMap.get(tag) ?? { count: 0, likeWeight: 0 };
        tagMap.set(tag, {
          count: prev.count + 1,
          likeWeight: prev.likeWeight + likeBoost,
        });
      }
    }

    // Sort by combined score and pick top 5
    const sorted = [...tagMap.entries()]
      .map(([tag, { count, likeWeight }]) => ({
        topic: `#${tag}`,
        score: count + likeWeight,
        postCount: count,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // Format post count for display (e.g. 1200 → "1.2K")
    const fmt = (n: number) =>
      n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

    return sorted.map(({ topic, postCount }) => ({
      topic,
      posts: fmt(postCount),
    }));
  }),

  toggleSavePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const existingSave = await ctx.prisma.savedPost.findUnique({
        where: {
          postId_userId: {
            postId: input.postId,
            userId,
          },
        },
      });

      if (existingSave) {
        await ctx.prisma.savedPost.delete({
          where: {
            id: existingSave.id,
          },
        });
        return { isSaved: false };
      }

      await ctx.prisma.savedPost.create({
        data: {
          postId: input.postId,
          userId,
        },
      });
      return { isSaved: true };
    }),
});
