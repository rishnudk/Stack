"use client";

import { trpc } from "@/utils/trpc";
import { LeetCodeStatsCard } from "./LeetCodeStatsCard";
import { GitHubStatsCard } from "./GitHubStatsCard";

interface DevStatsSidebarProps {
  userId: string;
}

export function DevStatsSidebar({ userId }: DevStatsSidebarProps) {
  // Fetch user data to get leetcode and github usernames
  const { data: user } = trpc.users.getUserById.useQuery({ userId });

  return (
    <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
      {/* LeetCode Stats Card */}
      {user?.leetcodeUsername && (
        <LeetCodeStatsCard username={user.leetcodeUsername} />
      )}

      {/* GitHub Stats Card */}
      {user?.githubUsername && (
        <GitHubStatsCard username={user.githubUsername} />
      )}

      {/* Achievements - Placeholder */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          Achievements
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-sm font-medium text-white">100 Day Streak</div>
              <div className="text-xs text-neutral-400">Keep it going!</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <span className="text-2xl">⭐</span>
            <div>
              <div className="text-sm font-medium text-white">Problem Solver</div>
              <div className="text-xs text-neutral-400">500+ problems solved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - Placeholder */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          Recent Activity
        </h3>
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-neutral-800/50 rounded-lg">
            <div className="text-neutral-300">Solved "Two Sum"</div>
            <div className="text-neutral-500 text-xs">2 hours ago</div>
          </div>
          <div className="p-2 bg-neutral-800/50 rounded-lg">
            <div className="text-neutral-300">Pushed to repo/project</div>
            <div className="text-neutral-500 text-xs">5 hours ago</div>
          </div>
          <div className="p-2 bg-neutral-800/50 rounded-lg">
            <div className="text-neutral-300">Posted about React</div>
            <div className="text-neutral-500 text-xs">1 day ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}
