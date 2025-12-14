import { z } from "zod";
import { publicProcedure, router } from "../trpc.ts";

// Simple in-memory cache (5 min TTL)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

export const devStatsRouter = router({
  // Get LeetCode stats
  getLeetCodeStats: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const cacheKey = `leetcode:${input.username}`;
      const cached = getCached(cacheKey);
      if (cached) return cached;

      try {
        const response = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                  username
                  profile {
                    ranking
                    reputation
                  }
                  submitStats {
                    acSubmissionNum {
                      difficulty
                      count
                    }
                  }
                  userCalendar {
                    streak
                    totalActiveDays
                    submissionCalendar
                  }
                }
              }
            `,
            variables: { username: input.username },
          }),
        });

        const data = await response.json();
        const stats = data.data?.matchedUser;

        if (!stats) {
          return null;
        }

        // Parse submission calendar for heatmap
        const calendar = stats.userCalendar?.submissionCalendar
          ? JSON.parse(stats.userCalendar.submissionCalendar)
          : {};

        const result = {
          username: stats.username,
          ranking: stats.profile?.ranking || 0,
          reputation: stats.profile?.reputation || 0,
          streak: stats.userCalendar?.streak || 0,
          totalActiveDays: stats.userCalendar?.totalActiveDays || 0,
          problems: {
            easy: stats.submitStats?.acSubmissionNum?.find((s: any) => s.difficulty === "Easy")?.count || 0,
            medium: stats.submitStats?.acSubmissionNum?.find((s: any) => s.difficulty === "Medium")?.count || 0,
            hard: stats.submitStats?.acSubmissionNum?.find((s: any) => s.difficulty === "Hard")?.count || 0,
            total: stats.submitStats?.acSubmissionNum?.find((s: any) => s.difficulty === "All")?.count || 0,
          },
          calendar,
        };

        setCache(cacheKey, result);
        return result;
      } catch (error) {
        return null;
      }
    }),

  // Get GitHub stats
  getGitHubStats: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const cacheKey = `github:${input.username}`;
      const cached = getCached(cacheKey);
      if (cached) return cached;

      try {
        const githubToken = process.env.GITHUB_TOKEN;
        const headers: Record<string, string> = githubToken 
          ? { Authorization: `Bearer ${githubToken}` }
          : {};
        
        const userResponse = await fetch(
          `https://api.github.com/users/${input.username}`,
          { headers }
        );
        const userData = await userResponse.json();

        if (userData.message === "Not Found") {
          return null;
        }

        const eventsResponse = await fetch(
          `https://api.github.com/users/${input.username}/events/public?per_page=30`,
          { headers }
        );
        const events = await eventsResponse.json();

        const reposResponse = await fetch(
          `https://api.github.com/users/${input.username}/repos?sort=updated&per_page=10`,
          { headers }
        );
        const repos = await reposResponse.json();

        const totalStars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);

        const pushEvents = events.filter((e: any) => e.type === "PushEvent");
        
        const recentCommits = pushEvents
          .map((e: any) => {
            const payload = e.payload;
            const commitCount = payload.size || payload.distinct_size || (payload.commits?.length) || 1;
            
            return {
              repo: e.repo.name,
              message: `Pushed ${commitCount} commit${commitCount > 1 ? 's' : ''}`,
              date: e.created_at,
            };
          })
          .slice(0, 5);


        const result = {
          username: userData.login,
          name: userData.name,
          avatar: userData.avatar_url,
          bio: userData.bio,
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          totalStars,
          recentCommits,
          repos: repos.slice(0, 6).map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            url: repo.html_url,
          })),
        };

        setCache(cacheKey, result);
        return result;
      } catch (error) {
        return null;
      }
    }),
});
