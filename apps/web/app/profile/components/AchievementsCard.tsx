"use client";

import { trpc } from "@/utils/trpc";
import { Trophy, ExternalLink } from "lucide-react";

interface AchievementsCardProps {
  userId: string;
}

export function AchievementsCard({ userId }: AchievementsCardProps) {
  // Fetch user data to get usernames
  const { data: user } = trpc.users.getUserById.useQuery({ userId });

  // Fetch LeetCode stats
  const { data: leetcodeStats } = trpc.devStats.getLeetCodeStats.useQuery(
    { username: user?.leetcodeUsername || "" },
    { enabled: !!user?.leetcodeUsername }
  );

  // Fetch GitHub stats
  const { data: githubStats } = trpc.devStats.getGitHubStats.useQuery(
    { username: user?.githubUsername || "" },
    { enabled: !!user?.githubUsername }
  );

  const achievements = [];

  // LeetCode Achievements
  if (leetcodeStats) {
    // Streak achievement
    if (leetcodeStats.streak >= 30) {
      achievements.push({
        icon: "🔥",
        title: `${leetcodeStats.streak} Day Streak`,
        description: "LeetCode consistency!",
        color: "orange",
      });
    }

    // Problem solver achievement
    if (leetcodeStats.problems.total >= 100) {
      achievements.push({
        icon: "⭐",
        title: "Problem Solver",
        description: `${leetcodeStats.problems.total}+ problems solved`,
        color: "yellow",
      });
    }

    // Ranking achievement
    if (leetcodeStats.ranking && leetcodeStats.ranking <= 100000) {
      achievements.push({
        icon: "🏅",
        title: "Top Ranked",
        description: `Rank #${leetcodeStats.ranking.toLocaleString()}`,
        color: "purple",
      });
    }
  }

  // GitHub Achievements
  if (githubStats) {
    // Star collector
    if (githubStats.totalStars >= 50) {
      achievements.push({
        icon: "⭐",
        title: "Star Collector",
        description: `${githubStats.totalStars} total stars`,
        color: "yellow",
      });
    }

    // Active contributor
    if (githubStats.publicRepos >= 20) {
      achievements.push({
        icon: "💻",
        title: "Active Contributor",
        description: `${githubStats.publicRepos} public repos`,
        color: "blue",
      });
    }

    // Popular developer
    if (githubStats.followers >= 50) {
      achievements.push({
        icon: "👥",
        title: "Popular Developer",
        description: `${githubStats.followers} followers`,
        color: "green",
      });
    }
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      orange: "bg-orange-500/10 border-orange-500/20",
      yellow: "bg-yellow-500/10 border-yellow-500/20",
      purple: "bg-purple-500/10 border-purple-500/20",
      blue: "bg-blue-500/10 border-blue-500/20",
      green: "bg-green-500/10 border-green-500/20",
    };
    return colors[color] || "bg-neutral-500/10 border-neutral-500/20";
  };

  if (!user?.leetcodeUsername && !user?.githubUsername) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Trophy size={20} className="text-yellow-500" />
          Achievements
        </h3>
        <p className="text-sm text-neutral-500">
          Add your LeetCode and GitHub usernames to see achievements!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <Trophy size={20} className="text-yellow-500" />
        Achievements
      </h3>

      {/* Platform Achievement Links */}
      <div className="space-y-2 mb-4">
        {/* GitHub Achievements */}
        {user?.githubUsername && (
          <a
            href={`https://github.com/${user.githubUsername}?tab=achievements`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg border border-neutral-700 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <img
                src={`https://github.com/${user.githubUsername}.png?size=40`}
                alt="GitHub"
                className="w-10 h-10 rounded-full border-2 border-blue-500/50"
              />
              <div>
                <div className="text-sm font-medium text-white">GitHub Achievements</div>
                <div className="text-xs text-neutral-400">View all badges & trophies</div>
              </div>
            </div>
            <ExternalLink size={16} className="text-neutral-500 group-hover:text-blue-400 transition-colors" />
          </a>
        )}

        {/* LeetCode Medals */}
        {user?.leetcodeUsername && (
          <a
            href={`https://leetcode.com/${user.leetcodeUsername}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg border border-neutral-700 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-orange-500/50 bg-orange-500/10 flex items-center justify-center">
                <span className="text-xl">🏅</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">LeetCode Medals</div>
                <div className="text-xs text-neutral-400">View all achievements</div>
              </div>
            </div>
            <ExternalLink size={16} className="text-neutral-500 group-hover:text-orange-400 transition-colors" />
          </a>
        )}
      </div>

      {/* Stats-based Achievement Cards */}
      {achievements.length > 0 && (
        <>
          <div className="border-t border-neutral-800 pt-3 mb-2">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">
              Milestones
            </div>
          </div>
          <div className="space-y-2">
            {(achievements as any[]).map((achievement: any, index: number) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded-lg border ${getColorClasses(achievement.color)}`}
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {achievement.title}
                  </div>
                  <div className="text-xs text-neutral-400 truncate">
                    {achievement.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
