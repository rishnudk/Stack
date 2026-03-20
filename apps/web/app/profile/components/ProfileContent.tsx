"use client";

import { useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { trpc } from "@/utils/trpc";
import { ProfileTab } from "@/types/profile-tab";
import { ProfileTabs } from "./ProfileTabs";
import { PostsTab } from "./tabs/PostsTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { ProfileTopBar } from "./ProfileTopBar";
import { EditProfileTab } from "./EditProfileTab";

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

  console.log("[ProfileContent] user data:", user);
  console.log("[ProfileContent] githubUsername:", githubUsername);
  console.log("[ProfileContent] pinnedRepos:", pinnedRepos, "loading:", reposLoading);
  console.log("[ProfileContent] contributionGraph:", contributionGraph);

  return (
    <div className="container">
      <ProfileTopBar 
        name={user?.name || ""} 
        avatar={user?.image || user?.avatarUrl || ""} 
        followers={user?._count?.followers ?? 0}
        following={user?._count?.following ?? 0}
        isOwnProfile={isOwnProfile}
        onEditProfile={() => setActiveTab("edit-profile" as any)}
      />
      {activeTab === "edit-profile" ? (
        <div className="pt-4">
          <EditProfileTab currentUser={user} onCancel={() => setActiveTab("posts")} />
        </div>
      ) : (
        <>
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
                contributions={contributionGraph || null}
                contributionsLoading={graphLoading}
                isOwnProfile={isOwnProfile}
                githubUsername={githubUsername}
                userId={userId}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
