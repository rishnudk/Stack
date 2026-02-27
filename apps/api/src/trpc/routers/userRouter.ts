import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import type { Context } from "../../context";
import { getPinnedRepos } from "../../modules/github/github.service";
import type { SocialLinks } from "@stack/types";



export const userRouter = router({
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
        },
      });
    }),
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
          headline: true,
          location: true,
          onboardingCompleted: true,
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
              followers: true,
              following: true,
            },
          },
        },
      });

      let isFollowing = false;
      if (ctx.session?.user?.id) {
        const follow = await ctx.prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: ctx.session.user.id,
              followingId: input.userId,
            }
          }
        })
        isFollowing = !!follow;
      }
      return {
        ...user, isFollowing,
        socialLinks: user?.socialLinks as SocialLinks | null,

      };
    }),


  //follow a user
  follow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id === input.userId) {
        throw new Error("Cannot follow yourself");
      }

      await ctx.prisma.follow.create({
        data: {
          followerId: ctx.session.user.id,
          followingId: input.userId,
        },
      });
      return { success: true };
    }),

  //unfollow a user
  unfollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: input.userId,
          },
        },
      });
      return { success: true };
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
        socialLinks: z
          .object({
            github: z.string().optional(),
            linkedin: z.string().optional(),
            twitter: z.string().optional(),
            website: z.string().optional(),
          })
          .optional(),

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

  // Mark onboarding as completed
  completeOnboarding: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (!ctx.session?.user?.id) throw new Error("Unauthorized");
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { onboardingCompleted: true },
      });
    }),

  // Skills-based user suggestions
  getSuggestions: protectedProcedure
    .query(async ({ ctx }) => {
      const currentUserId = ctx.session.user.id;

      // Get current user's profile data and already-followed list
      const currentUser = await ctx.prisma.user.findUnique({
        where: { id: currentUserId },
        select: {
          skills: true,
          company: true,
          location: true,
          following: { select: { followingId: true } },
        },
      });

      if (!currentUser) return [];

      const mySkillsLower = (currentUser.skills ?? []).map((s) =>
        s.toLowerCase()
      );
      const myCompanyLower = currentUser.company?.toLowerCase() ?? null;
      const myLocationLower = currentUser.location?.toLowerCase() ?? null;
      const followingIds = currentUser.following.map((f) => f.followingId);
      const excludedIds = [currentUserId, ...followingIds];

      // Build OR conditions — a candidate is relevant if they share at least
      // one skill, the same company, or the same location.
      const orConditions: object[] = [];

      if (mySkillsLower.length > 0) {
        // Prisma hasSome is case-sensitive, so we match lowercased on the
        // application side after fetching — but we still use hasSome with the
        // original casing as a broad pre-filter to keep the query efficient.
        orConditions.push({ skills: { hasSome: currentUser.skills } });
      }
      if (myCompanyLower) {
        orConditions.push({
          company: { equals: currentUser.company, mode: "insensitive" },
        });
      }
      if (myLocationLower) {
        orConditions.push({
          location: { equals: currentUser.location, mode: "insensitive" },
        });
      }

      if (orConditions.length === 0) return [];

      const candidates = await ctx.prisma.user.findMany({
        where: {
          id: { notIn: excludedIds },
          OR: orConditions,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          avatarUrl: true,
          headline: true,
          skills: true,
          company: true,
          location: true,
        },
        take: 30,
      });

      // Score each candidate (case-insensitive everywhere)
      const ranked = candidates
        .map((user) => {
          const theirSkillsLower = (user.skills ?? []).map((s) =>
            s.toLowerCase()
          );
          const sharedSkills = theirSkillsLower.filter((s) =>
            mySkillsLower.includes(s)
          );

          const sameCompany =
            myCompanyLower !== null &&
            user.company?.toLowerCase() === myCompanyLower;

          const sameLocation =
            myLocationLower !== null &&
            user.location?.toLowerCase() === myLocationLower;

          // Weighted score: skills +2 each, company +3, location +2
          const score =
            sharedSkills.length * 2 +
            (sameCompany ? 3 : 0) +
            (sameLocation ? 2 : 0);

          return {
            ...user,
            sharedSkillCount: sharedSkills.length,
            sameCompany,
            sameLocation,
            score,
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      return ranked;
    }),
});

