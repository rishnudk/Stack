"use client";

import { trpc } from "@/utils/trpc";
import { LeetCodeStatsCard } from "./LeetCodeStatsCard";
import { GitHubStatsCard } from "./GitHubStatsCard";
import { AchievementsCard } from "./AchievementsCard";
import { RecentActivityCard } from "./RecentActivityCard";

interface DevStatsSidebarProps {
  userId: string;
}

export function DevStatsSidebar({ userId }: DevStatsSidebarProps) {
  // Fetch user data to get leetcode and github usernames
  const { data: user } = trpc.users.getUserById.useQuery({ userId });

  return (
    <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* LeetCode Stats Card */}
      {user?.leetcodeUsername && (
        <LeetCodeStatsCard username={user.leetcodeUsername} />
      )}

      {/* GitHub Stats Card */}
      {user?.githubUsername && (
        <GitHubStatsCard username={user.githubUsername} />
      )}

      {/* Achievements - Dynamic */}
      {/* <AchievementsCard userId={userId} /> */}

      {/* Recent Activity - Dynamic */}
      <RecentActivityCard userId={userId} />
    </div>
  );
}
