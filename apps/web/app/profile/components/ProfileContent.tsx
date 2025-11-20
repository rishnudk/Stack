"use client";

import { useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { trpc } from "@/utils/trpc";
import { PostCard } from "../../feed/components/feedbox/PostCard";
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
                  name={post.author.name || "Unknown"}
                  username={post.author.email?.split("@")[0] || "user"}
                  time={formatPostTime(new Date(post.createdAt))}
                  text={post.content}
                  imageUrl={post.images?.[0]}
                  postId={post.id}
                  likeCount={post.likes.length}
                  commentCount={post.comments.length}
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
          <div className="p-8 text-center text-neutral-500">
            <p className="text-lg mb-2">🚀 Projects</p>
            <p className="text-sm">GitHub projects will appear here</p>
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">About</h3>
              <p className="text-neutral-400">
                Full Stack Developer passionate about building amazing web experiences.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Skills</h3>
              <p className="text-neutral-400">
                React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
