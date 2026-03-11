"use client";

import { useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { trpc } from "@/utils/trpc";
import { ProfileTab } from "@/types/profile-tab";
import { ProfileTabs } from "./ProfileTabs";
import { PostsTab } from "./tabs/PostsTab";
import { ProjectsTab } from "./tabs/ProjectsTab";

interface ProfileContentProps {
  userId: string;
  isOwnProfile: boolean;
  initialTab?: "posts" | "resume" | "articles" | "projects" | "edit-profile";
}

export function ProfileContent({ userId, isOwnProfile, initialTab }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab || "posts");

  const { data: posts, isLoading: postsLoading } =
    trpc.posts.getUserPosts.useQuery({ userId });

  const { data: user } = trpc.users.getUserById.useQuery(
    { userId },
    { enabled: !!userId }
  );

  const githubUsername = user?.githubUsername ?? "";

  const { data: pinnedRepos, isLoading: reposLoading } =
    trpc.users.getGithubPinnedRepos.useQuery(
      { username: githubUsername },
      { enabled: !!githubUsername }
    );

  const { data: contributionGraph, isLoading: graphLoading } =
    trpc.users.getContributionGraph.useQuery(
      { username: githubUsername },
      { enabled: !!githubUsername }
    );

  return (
    <div className="container">
      <ProfileHeader userId={userId} isOwnProfile={isOwnProfile} />

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="pt-4">
        {activeTab === "posts" && (
          <PostsTab
            posts={posts || []}
            isLoading={postsLoading}
            isOwnProfile={isOwnProfile}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsTab
            repos={pinnedRepos || []}
            loading={reposLoading}
            contributions={contributionGraph || []}
            contributionsLoading={graphLoading}
            isOwnProfile={isOwnProfile}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
}
