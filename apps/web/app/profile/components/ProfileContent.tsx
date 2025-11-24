"use client";

import { useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { trpc } from "@/utils/trpc";
import { PostCard } from "../../feed/components/feedbox/PostCard";
import { ProjectCard } from "./ProjectCard";
import { formatPostTime } from "@/utils/formatTime";

interface ProfileContentProps {
  userId: string;
  isOwnProfile: boolean;
}

export function ProfileContent({ userId, isOwnProfile }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<"posts" | "projects" | "about">("posts");

  // Fetch user's posts
  const { data: posts, isLoading: postsLoading } = trpc.posts.getUserPosts.useQuery(
    { userId },
    { enabled: activeTab === "posts" }
  );

  // Fetch user data for About section
  const { data: user } = trpc.users.getUserById.useQuery(
    { userId },
    { enabled: activeTab === "about" || activeTab === "projects" }
  );

  // Fetch GitHub pinned repos
  const { data: pinnedRepos, isLoading: reposLoading } = trpc.users.getGithubPinnedRepos.useQuery(
    { username: user?.githubUsername || "" },
    { enabled: activeTab === "projects" && !!user?.githubUsername }
  );

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen border-x border-neutral-800 bg-black text-white">
      {/* Profile Header */}
      <ProfileHeader userId={userId} isOwnProfile={isOwnProfile} />

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-4 font-semibold transition-colors relative ${
            activeTab === "posts"
              ? "text-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Posts
          {activeTab === "posts" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex-1 py-4 font-semibold transition-colors relative ${
            activeTab === "projects"
              ? "text-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          Projects
          {activeTab === "projects" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`flex-1 py-4 font-semibold transition-colors relative ${
            activeTab === "about"
              ? "text-white"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          About
          {activeTab === "about" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div>
            {postsLoading ? (
              <div className="p-8 text-center text-neutral-500">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : posts && posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  userId={post.author.id}
                  name={post.author.name || "Unknown"}
                  username={post.author.email?.split("@")[0] || "user"}
                  time={formatPostTime(new Date(post.createdAt))}
                  text={post.content}
                  imageUrl={post.images?.[0]}
                  postId={post.id}
                  likeCount={post.likes.length}
                  commentCount={post.comments.length}
                  avatarUrl={post.author.avatarUrl || post.author.image || undefined}
                />
              ))
            ) : (
              <div className="p-8 text-center text-neutral-500">
                <p className="text-lg mb-2">No posts yet</p>
                <p className="text-sm">
                  {isOwnProfile ? "Share your first thought!" : "This user hasn't posted anything yet."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="p-6 space-y-6">
            {user?.githubUsername ? (
              <>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">GitHub Projects</h3>
                  <p className="text-neutral-400 text-sm">
                    Explore repositories from{" "}
                    <a
                      href={`https://github.com/${user.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      @{user.githubUsername}
                    </a>
                  </p>
                </div>

                {/* Project Cards */}
                {reposLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-32 bg-neutral-900 border border-neutral-800 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : pinnedRepos && pinnedRepos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pinnedRepos.map((repo) => (
                      <ProjectCard
                        key={repo.name}
                        name={repo.name}
                        description={repo.description}
                        url={repo.url}
                        stargazerCount={repo.stargazerCount}
                        language={repo.primaryLanguage}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-lg">
                    <p className="text-neutral-400 text-sm mb-2">
                      No pinned repositories found.
                    </p>
                    <p className="text-xs text-neutral-500">
                      Pin repositories on your GitHub profile to see them here.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
                <p className="text-neutral-400 mb-4">
                  {isOwnProfile
                    ? "Add your GitHub username in Edit Profile to showcase your projects"
                    : "This user hasn't added their GitHub profile yet"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="p-6 space-y-6">
            {/* Bio Section */}
            {user?.bio && (
              <div>
                <h3 className="text-lg font-bold text-white mb-2">About</h3>
                <p className="text-neutral-300 leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Headline */}
            {user?.headline && (
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Headline</h3>
                <p className="text-neutral-300">{user.headline}</p>
              </div>
            )}

            {/* Skills */}
            {user?.skills && user.skills.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-sm font-medium border border-blue-600/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Info */}
            {(user?.company || user?.location) && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Work & Location</h3>
                <div className="space-y-2">
                  {user.company && (
                    <div className="flex items-center gap-2 text-neutral-300">
                      <span className="text-neutral-500">Company:</span>
                      <span>{user.company}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-2 text-neutral-300">
                      <span className="text-neutral-500">Location:</span>
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Developer Profiles */}
            {(user?.githubUsername || user?.leetcodeUsername) && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Developer Profiles</h3>
                <div className="space-y-2">
                  {user.githubUsername && (
                    <a
                      href={`https://github.com/${user.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                    >
                      <span className="text-neutral-500">GitHub:</span>
                      <span className="text-blue-400 hover:underline">@{user.githubUsername}</span>
                    </a>
                  )}
                  {user.leetcodeUsername && (
                    <a
                      href={`https://leetcode.com/${user.leetcodeUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                    >
                      <span className="text-neutral-500">LeetCode:</span>
                      <span className="text-orange-400 hover:underline">@{user.leetcodeUsername}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!user?.bio && !user?.headline && !user?.skills?.length && !user?.company && !user?.location && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-xl font-bold text-white mb-2">No Information Yet</h3>
                <p className="text-neutral-400">
                  {isOwnProfile
                    ? "Add your bio, skills, and other information in Edit Profile"
                    : "This user hasn't added their information yet"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
