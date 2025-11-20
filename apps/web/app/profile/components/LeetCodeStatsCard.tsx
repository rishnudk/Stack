"use client";

import { trpc } from "@/utils/trpc";
import { TrendingUp, Award, Flame, Calendar } from "lucide-react";

interface LeetCodeStatsCardProps {
  username?: string;
}

export function LeetCodeStatsCard({ username }: LeetCodeStatsCardProps) {
  const { data: stats, isLoading, error } = trpc.devStats.getLeetCodeStats.useQuery(
    { username: username || "" },
    { enabled: !!username }
  );

  if (!username) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">💻</span>
          LeetCode Stats
        </h3>
        <p className="text-neutral-500 text-sm">Add your LeetCode username to see stats</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="text-2xl">💻</span>
          LeetCode Stats
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
          <span className="text-2xl">💻</span>
          LeetCode Stats
        </h3>
        <p className="text-neutral-500 text-sm">Unable to load LeetCode stats</p>
        <p className="text-neutral-600 text-xs mt-1">Check if username is correct</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4 hover:border-orange-500/50 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-2xl">💻</span>
          LeetCode
        </h3>
        <a
          href={`https://leetcode.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-400 hover:text-orange-300 text-xs font-medium"
        >
          View Profile →
        </a>
      </div>

      {/* Total Problems Solved */}
      <div className="mb-4 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm">Total Solved</span>
          <span className="text-2xl font-bold text-orange-400">{stats.problems.total}</span>
        </div>
      </div>

      {/* Problems Breakdown */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="text-xs text-neutral-400">Easy</div>
          <div className="text-lg font-bold text-green-400">{stats.problems.easy}</div>
        </div>
        <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div className="text-xs text-neutral-400">Medium</div>
          <div className="text-lg font-bold text-yellow-400">{stats.problems.medium}</div>
        </div>
        <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
          <div className="text-xs text-neutral-400">Hard</div>
          <div className="text-lg font-bold text-red-400">{stats.problems.hard}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="space-y-2">
        {/* Streak */}
        <div className="flex items-center justify-between p-2 bg-neutral-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm text-neutral-300">Current Streak</span>
          </div>
          <span className="font-bold text-white">{stats.streak} days</span>
        </div>

        {/* Active Days */}
        <div className="flex items-center justify-between p-2 bg-neutral-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" />
            <span className="text-sm text-neutral-300">Active Days</span>
          </div>
          <span className="font-bold text-white">{stats.totalActiveDays}</span>
        </div>

        {/* Ranking */}
        {stats.ranking > 0 && (
          <div className="flex items-center justify-between p-2 bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-purple-400" />
              <span className="text-sm text-neutral-300">Ranking</span>
            </div>
            <span className="font-bold text-white">#{stats.ranking.toLocaleString()}</span>
          </div>
        )}

        {/* Reputation */}
        {stats.reputation > 0 && (
          <div className="flex items-center justify-between p-2 bg-neutral-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-400" />
              <span className="text-sm text-neutral-300">Reputation</span>
            </div>
            <span className="font-bold text-white">{stats.reputation}</span>
          </div>
        )}
      </div>
    </div>
  );
}
