"use client";

import { useState } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { trpc } from "@/utils/trpc";
import { PostCard } from "../../feed/components/feedbox/PostCard";
import { ProjectCard } from "./ProjectCard";
import { formatPostTime } from "@/utils/formatTime";
import { AddProjectModal } from "./AddProjectModal";
import { Plus } from "lucide-react";

interface ProfileContentProps {
  userId: string;
  isOwnProfile: boolean;
}

export function ProfileContent({ userId, isOwnProfile }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<"work" | "posts" | "resume" | "articles" | "projects">("work");
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  // Pagination / Limit State
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllArticles, setShowAllArticles] = useState(false);

  // Fetch user's posts
  const { data: posts, isLoading: postsLoading } = trpc.posts.getUserPosts.useQuery(
    { userId },
    { enabled: activeTab === "posts" }
  );

  // Fetch user data for Work/Projects
  const { data: user } = trpc.users.getUserById.useQuery(
    { userId },
    { enabled: activeTab === "work" || activeTab === "projects" }
  );

  // Fetch GitHub pinned repos
  const { data: pinnedRepos, isLoading: reposLoading } = trpc.users.getGithubPinnedRepos.useQuery(
    { username: user?.githubUsername || "" },
    { enabled: activeTab === "projects" || activeTab === "work" }
  );

  // Fetch Full GitHub Stats for Work Tab
  const { data: githubStats, isLoading: githubStatsLoading } = trpc.devStats.getGitHubStats.useQuery(
    { username: user?.githubUsername || "" },
    { enabled: activeTab === "work" && !!user?.githubUsername }
  );

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen border-x border-neutral-800 bg-black text-white relative">
      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
      />

      {/* Profile Header */}
      <ProfileHeader userId={userId} isOwnProfile={isOwnProfile} />

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
        <button
          onClick={() => setActiveTab("work")}
          className={`flex-1 py-4 font-semibold transition-colors relative ${activeTab === "work"
            ? "text-white"
            : "text-neutral-500 hover:text-neutral-300"
            }`}
        >
          Work
          {activeTab === "work" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-4 font-semibold transition-colors relative ${activeTab === "posts"
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
          onClick={() => setActiveTab("resume")}
          className={`flex-1 py-4 font-semibold transition-colors relative ${activeTab === "resume"
            ? "text-white"
            : "text-neutral-500 hover:text-neutral-300"
            }`}
        >
          Resume
          {activeTab === "resume" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("articles")}
          className={`flex-1 py-4 font-semibold transition-colors relative ${activeTab === "articles"
            ? "text-white"
            : "text-neutral-500 hover:text-neutral-300"
            }`}
        >
          Articles
          {activeTab === "articles" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex-1 py-4 font-semibold transition-colors relative ${activeTab === "projects"
            ? "text-white"
            : "text-neutral-500 hover:text-neutral-300"
            }`}
        >
          Projects
          {activeTab === "projects" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-t-full"></div>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="pb-16">
        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div>
            {postsLoading ? (
              <div className="p-8 text-center text-neutral-500">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-4">
                {(posts as any[]).slice(0, showAllPosts ? posts.length : 2).map((post: any) => (
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
                    isSaved={post.isSaved}
                  />
                ))}

                {posts.length > 2 && (
                  <div className="px-6 pb-6">
                    <button
                      onClick={() => setShowAllPosts(!showAllPosts)}
                      className="w-full py-3 rounded-xl border border-neutral-800 text-neutral-300 hover:bg-neutral-900 transition-colors font-medium text-sm text-center"
                    >
                      {showAllPosts ? "Show less" : `Show all ${posts.length} posts`}
                    </button>
                  </div>
                )}
              </div>
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Projects</h3>
                <p className="text-neutral-400 text-sm">
                  {user?.githubUsername ? (
                    <>
                      Explore repositories from{" "}
                      <a
                        href={`https://github.com/${user.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        @{user.githubUsername}
                      </a>
                    </>
                  ) : "Check out these featured projects."}
                </p>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => setIsAddProjectModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full text-sm font-medium transition-colors border border-neutral-700 border-b-neutral-900"
                >
                  <Plus size={16} />
                  Add Project
                </button>
              )}
            </div>

            {/* Project Cards */}
            {reposLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-neutral-900 border border-neutral-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : pinnedRepos && pinnedRepos.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pinnedRepos.slice(0, showAllProjects ? pinnedRepos.length : 2).map((repo) => (
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
                {pinnedRepos.length > 2 && (
                  <button
                    onClick={() => setShowAllProjects(!showAllProjects)}
                    className="w-full py-3 mt-2 rounded-xl border border-neutral-800 text-neutral-300 hover:bg-neutral-900 transition-colors font-medium text-sm text-center"
                  >
                    {showAllProjects ? "Show less" : `Show all ${pinnedRepos.length} projects`}
                  </button>
                )}
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
          </div>
        )}

        {/* Resume Tab */}
        {activeTab === "resume" && (
          <div className="p-8 text-center text-neutral-500">
            <p className="text-lg mb-2">Resume</p>
            <p className="text-sm">
              {isOwnProfile ? "Upload your resume here!" : "This user hasn't uploaded a resume yet."}
            </p>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === "articles" && (
          <div className="p-8 text-center text-neutral-500">
            <p className="text-lg mb-2">Articles</p>
            <p className="text-sm">
              {isOwnProfile ? "Write your first article!" : "This user hasn't published any articles yet."}
            </p>
          </div>
        )}

        {/* Work Tab */}
        {activeTab === "work" && (
          <div className="p-6 space-y-6">
            {githubStatsLoading ? (
              <div className="p-8 text-center text-neutral-500">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : githubStats ? (
              <div className="space-y-6">
                {/* GitHub Stats Header */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">GitHub Activity</h3>
                      <p className="text-neutral-400 text-sm">Overview of recent open source contributions</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{githubStats.publicRepos}</div>
                        <div className="text-xs text-neutral-500">Repositories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{githubStats.totalStars}</div>
                        <div className="text-xs text-neutral-500">Total Stars</div>
                      </div>
                    </div>
                  </div>

                  {/* Simplified Graph Representation (Commit Graph) */}
                  <div className="mb-4 bg-black/50 rounded-lg p-4 border border-neutral-800">
                    <h4 className="text-sm font-medium text-neutral-300 mb-3 flex items-center justify-between">
                      <span>Contribution Activity</span>
                      <span className="text-xs text-neutral-500">Last 3 Months</span>
                    </h4>
                    <div className="flex flex-wrap gap-1 opacity-70">
                      {/* Placeholder for a real calendar graph */}
                      {Array.from({ length: 60 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-sm ${Math.random() > 0.7
                            ? 'bg-green-500'
                            : Math.random() > 0.4
                              ? 'bg-green-800'
                              : 'bg-neutral-800'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Recent Commits List */}
                  {githubStats.recentCommits && githubStats.recentCommits.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-neutral-300 mb-3">Recent Commits</h4>
                      <div className="space-y-3">
                        {githubStats.recentCommits.slice(0, 3).map((commit: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <div className="truncate max-w-[70%] text-neutral-300">
                              <span className="font-medium text-blue-400 mr-2">{commit.repo}</span>
                              {commit.message}
                            </div>
                            <div className="text-neutral-500 text-xs whitespace-nowrap ml-4">
                              {new Date(commit.date).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Pinned Repos / Projects */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Top Repositories</h3>
                  {reposLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-32 bg-neutral-900 border border-neutral-800 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : pinnedRepos && pinnedRepos.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pinnedRepos.slice(0, showAllProjects ? pinnedRepos.length : 2).map((repo) => (
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
                      {pinnedRepos.length > 2 && (
                        <button
                          onClick={() => setShowAllProjects(!showAllProjects)}
                          className="w-full py-3 mt-2 rounded-xl border border-neutral-800 text-neutral-300 hover:bg-neutral-900 transition-colors font-medium text-sm text-center"
                        >
                          {showAllProjects ? "Show less" : `Show all ${pinnedRepos.length} repositories`}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-neutral-900 border border-neutral-800 rounded-lg">
                      <p className="text-neutral-400 text-sm">No pinned repositories found.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">�</div>
                <h3 className="text-xl font-bold text-white mb-2">No Work Data</h3>
                <p className="text-neutral-400 mb-4">
                  {isOwnProfile
                    ? "Add your GitHub username in Edit Profile to showcase your work"
                    : "This user hasn't connected their GitHub profile yet"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
