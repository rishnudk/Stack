import { TRPCError } from "@trpc/server";

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
