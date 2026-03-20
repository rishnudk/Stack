const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

export interface PinnedRepo {
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
}

export interface ContributionDay {
  date: string;
  count: number;
  color: string;
}

export interface ContributionData {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
}

export async function getPinnedRepos(username: string): Promise<PinnedRepo[]> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn("GITHUB_TOKEN is not set in environment variables");
    return [];
  }

  const query = `
    query UserPinnedItems($username: String!) {
      user(login: $username) {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              stargazerCount
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(GITHUB_GRAPHQL_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "stack-app",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    console.log(`[github.service] getPinnedRepos response status:`, response.status);

    if (!response.ok) {
      console.error(`GitHub GraphQL API error (pinned repos): ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();

    if (data.errors) {
      console.error("GitHub GraphQL Error:", data.errors);
      return [];
    }

    if (!data.data?.user?.pinnedItems?.nodes) {
      return [];
    }

    return data.data.user.pinnedItems.nodes;
  } catch (error) {
    console.error("Failed to fetch GitHub pinned repos:", error);
    return [];
  }
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function getContributionGraph(
  username: string
): Promise<ContributionData> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn("GITHUB_TOKEN is not set in environment variables");
    return { totalContributions: 0, weeks: [] };
  }

  const query = `
    query UserContributionCalendar($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  let lastError: any = null;
  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetchWithTimeout(GITHUB_GRAPHQL_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "stack-app",
        },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
      }, 15000); // 15s timeout for contributions

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(`GitHub GraphQL Error: ${JSON.stringify(data.errors)}`);
      }

      const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;

      if (!calendar) {
        return { totalContributions: 0, weeks: [] };
      }

      return {
        totalContributions: calendar.totalContributions,
        weeks: calendar.weeks.map((week: any) => ({
          contributionDays: week.contributionDays.map((day: any) => ({
            date: day.date,
            count: day.contributionCount,
            color: day.color,
          })),
        })),
      };
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${i + 1} failed for getContributionGraph:`, error);
      // Wait a bit before retrying
      if (i < 2) await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }

  console.error("Failed to fetch GitHub contribution graph after 3 attempts:", lastError);
  return { totalContributions: 0, weeks: [] };
}


