"use client";

import { trpc } from "@/utils/trpc";
import { Activity, GitCommit, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityCardProps {
  userId: string;
}

export function RecentActivityCard({ userId }: RecentActivityCardProps) {
  // Fetch user data
  const { data: user } = trpc.users.getUserById.useQuery({ userId });

  // Fetch user's recent posts
  const { data: posts } = trpc.posts.getUserPosts.useQuery({ userId });

  // Fetch GitHub stats for recent commits
  const { data: githubStats } = trpc.devStats.getGitHubStats.useQuery(
    { username: user?.githubUsername || "" },
    { enabled: !!user?.githubUsername }
  );

  // Combine activities
  const activities: Array<{
    type: "post" | "commit";
    icon: any;
    text: string;
    date: Date;
  }> = [];

  // Add recent posts
  if (posts && posts.length > 0) {
    posts.slice(0, 3).forEach((post) => {
      const preview = post.content.substring(0, 50);
      activities.push({
        type: "post",
        icon: MessageSquare,
        text: `Posted: "${preview}${post.content.length > 50 ? "..." : ""}"`,
        date: new Date(post.createdAt),
      });
    });
  }

  // Add recent GitHub commits
  if (githubStats?.recentCommits && githubStats.recentCommits.length > 0) {
    githubStats.recentCommits.slice(0, 3).forEach((commit: any) => {
      activities.push({
        type: "commit",
        icon: GitCommit,
        text: `${commit.repo}: ${commit.message}`,
        date: new Date(commit.date),
      });
    });
  }

  // Sort by date (most recent first)
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Take top 5 activities
  const recentActivities = activities.slice(0, 5);

  if (recentActivities.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Activity size={20} className="text-blue-500" />
          Recent Activity
        </h3>
        <p className="text-sm text-neutral-500">
          No recent activity. Start posting or coding!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-4">
      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <Activity size={20} className="text-blue-500" />
        Recent Activity
      </h3>
      <div className="space-y-2">
        {(recentActivities as any[]).map((activity: any, index: number) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="p-2 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors">
              <div className="flex items-start gap-2">
                <Icon size={16} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-neutral-300 truncate">
                    {activity.text}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {formatDistanceToNow(activity.date, { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
