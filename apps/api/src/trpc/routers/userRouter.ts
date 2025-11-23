import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc.ts";
import type { Context } from "../../context.ts";
import { getPinnedRepos } from "../../modules/github/github.service.ts";

export const userRouter = router({
  getSidebarInfo: publicProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const id = input.userId ?? ctx.session?.user?.id;
      if (!id) return null;

      const user = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
            email: true,
            image: true,
            
        },
      });

      const profileViews = await ctx.prisma.view.count({ where: { userId: id } });
      const postImpressions = await ctx.prisma.impression.count({ where: { userId: id } });

      return { user, profileViews, postImpressions };
    }),

  // Get user by username for public profiles
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      // Try to find by email (username@...)
      const user = await ctx.prisma.user.findFirst({
        where: {
          email: {
            startsWith: input.username,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          avatarUrl: true,
          headline: true,
          location: true,
          company: true,
          bio: true,
          skills: true,
          socialLinks: true,
          leetcodeUsername: true,
          githubUsername: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      return user;
    }),

  // Get user by ID for profile pages
  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          avatarUrl: true,
          headline: true,
          location: true,
          company: true,
          bio: true,
          skills: true,
          socialLinks: true,
          leetcodeUsername: true,
          githubUsername: true,
          coverUrl: true,
          coverGradient: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
            },
          },
        },
      });

      return user;
    }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        headline: z.string().optional(),
        location: z.string().optional(),
        company: z.string().optional(),
        bio: z.string().optional(),
        avatarUrl: z.string().optional(),
        leetcodeUsername: z.string().optional(),
        githubUsername: z.string().optional(),
        skills: z.array(z.string()).optional(),
        socialLinks: z.record(z.string(), z.string()).optional(),
        coverUrl: z.string().optional(),
        coverGradient: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) throw new Error("Unauthorized");
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...input,
          socialLinks: input.socialLinks as any, // Cast to satisfy Prisma Json type
        },
      });
    }),

  // Get GitHub pinned repos
  getGithubPinnedRepos: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      return await getPinnedRepos(input.username);
    }),
});
