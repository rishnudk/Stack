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
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

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

export async function getContributionGraph(
  username: string
): Promise<ContributionDay[]> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn("GITHUB_TOKEN is not set in environment variables");
    return [];
  }

  const query = `
    query UserContributionCalendar($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
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
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("GitHub GraphQL Error:", data.errors);
      return [];
    }

    return (
      data.data?.user?.contributionsCollection?.contributionCalendar?.weeks?.flatMap(
        (week: { contributionDays: Array<{ date: string; contributionCount: number }> }) =>
          week.contributionDays.map((day) => ({
            date: day.date,
            count: day.contributionCount,
          }))
      ) ?? []
    );
  } catch (error) {
    console.error("Failed to fetch GitHub contribution graph:", error);
    return [];
  }
}
