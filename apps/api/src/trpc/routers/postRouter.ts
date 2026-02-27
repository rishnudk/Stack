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
      const post = await ctx.prisma.post.create({
        data: {
          content: input.content,
          images: input.images,
          authorId: ctx.session.user.id,
          groupId: input.groupId,
        },
      });

      // Extract and track hashtags at write-time
      const tags = [...input.content.matchAll(/#([\w]+)/g)].map((m) =>
        m[1]!.toLowerCase()
      );
      for (const tag of new Set(tags)) {
        const hashtag = await ctx.prisma.hashtag.upsert({
          where: { tag },
          create: { tag },
          update: {},
        });
        await ctx.prisma.postHashtag.create({
          data: { postId: post.id, hashtagId: hashtag.id },
        });
      }

      return post;
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

  // Trending hashtags — efficient groupBy on the PostHashtag pivot
  getTrending: publicProcedure.query(async ({ ctx }) => {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const fmt = (n: number) =>
      n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

    const rows = await ctx.prisma.postHashtag.groupBy({
      by: ["hashtagId"],
      _count: { postId: true },
      where: { post: { createdAt: { gte: since } } },
      orderBy: { _count: { postId: "desc" } },
      take: 5,
    });

    if (rows.length === 0) return [];

    const ids = rows.map((r) => r.hashtagId);
    const hashtags = await ctx.prisma.hashtag.findMany({
      where: { id: { in: ids } },
    });
    const tagById = new Map(hashtags.map((h) => [h.id, h.tag]));

    return rows.map((r) => ({
      topic: `#${tagById.get(r.hashtagId) ?? r.hashtagId}`,
      posts: fmt(r._count.postId),
    }));
  }),

  // Posts filtered by a specific hashtag (for /hashtag/[tag] page)
  getPostsByHashtag: publicProcedure
    .input(
      z.object({
        tag: z.string(),
        cursor: z.string().nullish(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const hashtag = await ctx.prisma.hashtag.findUnique({
        where: { tag: input.tag.toLowerCase().replace(/^#/, "") },
      });

      if (!hashtag) return { posts: [], nextCursor: null };

      const pivots = await ctx.prisma.postHashtag.findMany({
        where: { hashtagId: hashtag.id },
        select: { postId: true },
      });
      const postIds = pivots.map((p) => p.postId);

      const posts = await ctx.prisma.post.findMany({
        where: { id: { in: postIds } },
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
          savedBy: input.cursor
            ? { where: { userId: ctx.session?.user?.id ?? "" }, take: 1 }
            : ctx.session?.user?.id
              ? { where: { userId: ctx.session.user.id }, take: 1 }
              : false,
        },
      });

      const nextCursor = posts.length > input.limit ? posts.pop()?.id : null;

      return {
        posts: posts.map((post) => ({
          ...post,
          isSaved: Array.isArray(post.savedBy) ? post.savedBy.length > 0 : false,
        })),
        nextCursor,
      };
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
