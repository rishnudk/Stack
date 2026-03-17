import { z } from "zod";

// createUser
export const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
});

// getSidebarInfo
export const getSidebarInfoSchema = z.object({
    userId: z.string().optional(),
});

// getUserByUsername
export const getUserByUsernameSchema = z.object({
    username: z.string(),
});

// getUserById
export const getUserByIdSchema = z.object({
    userId: z.string(),
});

// follow / unfollow
export const followSchema = z.object({
    userId: z.string(),
});

// updateProfile
export const updateProfileSchema = z.object({
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
});

// getGithubPinnedRepos
export const getGithubPinnedReposSchema = z.object({
    username: z.string(),
});

// getContributionGraph
export const getContributionGraphSchema = z.object({
    username: z.string(),
});

export const getSuggestionsSchema = z.object({
    limit: z.number().optional(),
});

export const getTopWritersSchema = z.object({
    limit: z.number().optional(),
});

export const getTopArticlesSchema = z.object({
    limit: z.number().optional(),
});

export const getTrendingArticlesSchema = z.object({
    limit: z.number().optional(),
});

