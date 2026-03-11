// Simple in-memory cache (5 min TTL)
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached<T>(key: string): T | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data as T;
    }
    cache.delete(key);
    return null;
}

function setCache(key: string, data: unknown) {
    cache.set(key, { data, timestamp: Date.now() });
}

// ── Types ──
interface LeetCodeSubmission {
    difficulty: string;
    count: number;
}

interface GitHubRepo {
    name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    html_url: string;
}

interface GitHubEvent {
    type: string;
    repo: { name: string };
    payload: { size?: number; distinct_size?: number; commits?: unknown[] };
    created_at: string;
}

// ──────────────────────────────────────────────
// LEETCODE STATS
// ──────────────────────────────────────────────
export type LeetCodeStatsResult = {
    username: string;
    ranking: number;
    reputation: number;
    streak: number;
    totalActiveDays: number;
    problems: { easy: number; medium: number; hard: number; total: number };
    calendar: Record<string, number>;
};

export async function getLeetCodeStats(username: string): Promise<LeetCodeStatsResult | null> {
    const cacheKey = `leetcode:${username}`;
    const cached = getCached<LeetCodeStatsResult>(cacheKey);
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
                variables: { username },
            }),
        });

        const data = await response.json();
        const stats = data.data?.matchedUser;

        if (!stats) return null;

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
                easy:
                    stats.submitStats?.acSubmissionNum?.find(
                        (s: LeetCodeSubmission) => s.difficulty === "Easy"
                    )?.count || 0,
                medium:
                    stats.submitStats?.acSubmissionNum?.find(
                        (s: LeetCodeSubmission) => s.difficulty === "Medium"
                    )?.count || 0,
                hard:
                    stats.submitStats?.acSubmissionNum?.find(
                        (s: LeetCodeSubmission) => s.difficulty === "Hard"
                    )?.count || 0,
                total:
                    stats.submitStats?.acSubmissionNum?.find(
                        (s: LeetCodeSubmission) => s.difficulty === "All"
                    )?.count || 0,
            },
            calendar,
        };

        setCache(cacheKey, result);
        return result;
    } catch {
        return null;
    }
}

// ──────────────────────────────────────────────
// GITHUB STATS
// ──────────────────────────────────────────────
export type GitHubStatsResult = {
    username: string;
    name: string | null;
    avatar: string;
    bio: string | null;
    publicRepos: number;
    followers: number;
    following: number;
    totalStars: number;
    recentCommits: { repo: string; message: string; date: string }[];
    repos: { name: string; description: string | null; stars: number; forks: number; language: string | null; url: string }[];
};

export async function getGitHubStats(username: string): Promise<GitHubStatsResult | null> {
    const cacheKey = `github:${username}`;
    const cached = getCached<GitHubStatsResult>(cacheKey);
    if (cached) return cached;

    try {
        const githubToken = process.env.GITHUB_TOKEN;
        console.log(`[dev-stats] Using token for ${username}:`, githubToken ? "Token present" : "No token");
        const headers: Record<string, string> = {
            "User-Agent": "stack-app",
            ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
        };

        const userResponse = await fetch(
            `https://api.github.com/users/${username}`,
            { headers }
        );
        console.log(`[dev-stats] GitHub user response:`, userResponse.status, userResponse.statusText);
        if (!userResponse.ok) {
            console.error(`GitHub user API error: ${userResponse.status} ${userResponse.statusText}`);
            return null;
        }
        const userData = await userResponse.json();

        if (userData.message === "Not Found") return null;

        const eventsResponse = await fetch(
            `https://api.github.com/users/${username}/events/public?per_page=30`,
            { headers }
        );
        const events: GitHubEvent[] = eventsResponse.ok ? await eventsResponse.json() : [];

        const reposResponse = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`,
            { headers }
        );
        const repos: GitHubRepo[] = reposResponse.ok ? await reposResponse.json() : [];

        const totalStars = repos.reduce(
            (sum, repo) => sum + (repo.stargazers_count || 0),
            0
        );

        const pushEvents = events.filter((e) => e.type === "PushEvent");

        const recentCommits = pushEvents
            .map((e) => {
                const payload = e.payload;
                const commitCount =
                    payload.size ||
                    payload.distinct_size ||
                    payload.commits?.length ||
                    1;

                return {
                    repo: e.repo.name,
                    message: `Pushed ${commitCount} commit${commitCount > 1 ? "s" : ""}`,
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
            repos: repos.slice(0, 6).map((repo) => ({
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
        console.error("Failed to fetch GitHub stats:", error);
        return null;
    }
}
