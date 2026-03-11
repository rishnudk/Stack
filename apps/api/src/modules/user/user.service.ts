import type { PrismaClient } from "@prisma/client";
import {
    getPinnedRepos,
    getContributionGraph as getGithubContributionGraph,
} from "../github/github.service";
import type { SocialLinks } from "@stack/types";

// ──────────────────────────────────────────────
// CREATE
// ──────────────────────────────────────────────
export async function createUser(
    prisma: PrismaClient,
    input: { name: string; email: string }
) {
    return prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
        },
    });
}

// ──────────────────────────────────────────────
// SIDEBAR INFO
// ──────────────────────────────────────────────
export async function getSidebarInfo(
    prisma: PrismaClient,
    userId: string | undefined
) {
    if (!userId) return null;

    const user = await prisma.user.findUnique({
        where: { id: userId },
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

    const profileViews = await prisma.view.count({ where: { userId } });
    const postImpressions = await prisma.impression.count({ where: { userId } });

    return { user, profileViews, postImpressions };
}

// ──────────────────────────────────────────────
// GET BY USERNAME
// ──────────────────────────────────────────────
export async function getUserByUsername(
    prisma: PrismaClient,
    username: string
) {
    return prisma.user.findFirst({
        where: {
            email: { startsWith: username },
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
            _count: { select: { posts: true } },
        },
    });
}

// ──────────────────────────────────────────────
// GET BY ID (profile page)
// ──────────────────────────────────────────────
export async function getUserById(
    prisma: PrismaClient,
    viewerId: string | undefined,
    userId: string
) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
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
    if (viewerId) {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: viewerId,
                    followingId: userId,
                },
            },
        });
        isFollowing = !!follow;
    }

    return {
        ...user,
        isFollowing,
        socialLinks: user?.socialLinks as SocialLinks | null,
    };
}

// ──────────────────────────────────────────────
// FOLLOW
// ──────────────────────────────────────────────
export async function follow(
    prisma: PrismaClient,
    currentUserId: string,
    targetUserId: string
) {
    if (currentUserId === targetUserId) {
        throw new Error("Cannot follow yourself");
    }

    await prisma.follow.create({
        data: {
            followerId: currentUserId,
            followingId: targetUserId,
        },
    });
    return { success: true };
}

// ──────────────────────────────────────────────
// UNFOLLOW
// ──────────────────────────────────────────────
export async function unfollow(
    prisma: PrismaClient,
    currentUserId: string,
    targetUserId: string
) {
    await prisma.follow.delete({
        where: {
            followerId_followingId: {
                followerId: currentUserId,
                followingId: targetUserId,
            },
        },
    });
    return { success: true };
}

// ──────────────────────────────────────────────
// UPDATE PROFILE
// ──────────────────────────────────────────────
export async function updateProfile(
    prisma: PrismaClient,
    userId: string,
    input: {
        name?: string;
        headline?: string;
        location?: string;
        company?: string;
        bio?: string;
        avatarUrl?: string;
        leetcodeUsername?: string;
        githubUsername?: string;
        skills?: string[];
        socialLinks?: {
            github?: string;
            linkedin?: string;
            twitter?: string;
            website?: string;
        };
        coverUrl?: string;
        coverGradient?: string;
    }
) {
    return prisma.user.update({
        where: { id: userId },
        data: {
            ...input,
            socialLinks: input.socialLinks as any,
        },
    });
}

// ──────────────────────────────────────────────
// GITHUB PINNED REPOS
// ──────────────────────────────────────────────
export async function getGithubPinnedRepos(username: string) {
    return getPinnedRepos(username);
}

export async function getContributionGraph(username: string) {
    return getGithubContributionGraph(username);
}

// ──────────────────────────────────────────────
// COMPLETE ONBOARDING
// ──────────────────────────────────────────────
export async function completeOnboarding(
    prisma: PrismaClient,
    userId: string
) {
    return prisma.user.update({
        where: { id: userId },
        data: { onboardingCompleted: true },
    });
}

// ──────────────────────────────────────────────
// SUGGESTIONS (skills-based)
// ──────────────────────────────────────────────
export async function getSuggestions(
    prisma: PrismaClient,
    currentUserId: string
) {
    const currentUser = await prisma.user.findUnique({
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

    const orConditions: object[] = [];

    if (mySkillsLower.length > 0) {
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

    const candidates = await prisma.user.findMany({
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
}
