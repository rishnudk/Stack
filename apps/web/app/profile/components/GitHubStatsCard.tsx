"use client";

import { trpc } from "@/utils/trpc";
import { GitBranch, Star, GitFork, Code, Activity } from "lucide-react";

interface GitHubStatsCardProps {
  username?: string;
}

interface GitHubCommit {
  repo: string;
  message: string;
  date: string;
}

interface GitHubRepo {
  name: string;
  url: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
}

// Then use:
// .map((commit: GitHubCommit, index: number) => ...)
// .map((repo: GitHubRepo, index: number) => ...)

export function GitHubStatsCard({ username }: GitHubStatsCardProps) {
  const { data: stats, isLoading, error } = trpc.devStats.getGitHubStats.useQuery(
    { username: username || "" },
    { enabled: !!username }
  );

  if (!username) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">🐙</span>
          GitHub Stats
        </h3>
        <p className="text-neutral-500 text-sm">Add your GitHub username to see stats</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-2xl">🐙</span>
          GitHub Stats
        </h3>
        <div className="space-y-3">
          <div className="h-4 bg-neutral-800 rounded animate-pulse"></div>
          <div className="h-4 bg-neutral-800 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-neutral-800 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">🐙</span>
          GitHub Stats
        </h3>
        <p className="text-neutral-500 text-sm">Unable to load GitHub stats</p>
        <p className="text-neutral-600 text-xs mt-1">Check if username is correct</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4 hover:border-purple-500/50 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-2xl">🐙</span>
          GitHub
        </h3>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 text-xs font-medium"
        >
          View Profile →
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <GitBranch size={14} className="text-purple-400" />
            <span className="text-xs text-neutral-400">Repos</span>
          </div>
          <div className="text-xl font-bold text-purple-400">{stats.publicRepos}</div>
        </div>
        <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Star size={14} className="text-yellow-400" />
            <span className="text-xs text-neutral-400">Stars</span>
          </div>
          <div className="text-xl font-bold text-yellow-400">{stats.totalStars}</div>
        </div>
      </div>

      {/* Followers/Following */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2 bg-neutral-800/50 rounded-lg">
          <div className="text-xs text-neutral-400">Followers</div>
          <div className="text-lg font-bold text-white">{stats.followers}</div>
        </div>
        <div className="p-2 bg-neutral-800/50 rounded-lg">
          <div className="text-xs text-neutral-400">Following</div>
          <div className="text-lg font-bold text-white">{stats.following}</div>
        </div>
      </div>

      {/* Recent Commits */}
      {stats.recentCommits && stats.recentCommits.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
            <Activity size={14} />
            Recent Commits
          </h4>
          <div className="space-y-2">
            {stats.recentCommits.slice(0, 3).map((commit: GitHubCommit, index: number) => (
              <div key={index} className="p-2 bg-neutral-800/50 rounded-lg">
                <div className="text-xs text-neutral-400 truncate">{commit.repo}</div>
                <div className="text-xs text-neutral-300 truncate mt-1">{commit.message}</div>
                <div className="text-xs text-neutral-500 mt-1">
                  {new Date(commit.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Repos */}
      {stats.repos && stats.repos.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
            <Code size={14} />
            Top Repositories
          </h4>
          <div className="space-y-2">
            {stats.repos.slice(0, 3).map((repo: GitHubRepo, index: number) => (
              <a
                key={index}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white truncate">{repo.name}</span>
                  {repo.language && (
                    <span className="text-xs text-neutral-400 ml-2">{repo.language}</span>
                  )}
                </div>
                {repo.description && (
                  <p className="text-xs text-neutral-400 truncate mb-1">{repo.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Star size={12} />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork size={12} />
                    {repo.forks}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
