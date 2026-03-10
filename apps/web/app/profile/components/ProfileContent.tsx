"use client";

import { useState, useEffect } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { trpc } from "@/utils/trpc";
import { PostCard } from "../../feed/components/feedbox/PostCard";
import { ProjectCard } from "./tabs/ProjectCard";
import { formatPostTime } from "@/utils/formatTime";
import { ProfileTopBar } from "./ProfileTopBar";
import { EditProfileTab } from "./EditProfileTab";
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

  const { data: pinnedRepos, isLoading: reposLoading } =
    trpc.users.getGithubPinnedRepos.useQuery({ username: "" });

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
            isOwnProfile={isOwnProfile}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
}
