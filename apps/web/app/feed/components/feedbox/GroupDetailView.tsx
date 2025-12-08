"use client";
import Image from "next/image";
import { ArrowLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreatePostBox } from "./CreatePostBox";
import { PostCard } from "./PostCard";
import { trpc } from "@/utils/trpc";

interface GroupDetailViewProps {
  groupId: string;
}

export function GroupDetailView({ groupId }: GroupDetailViewProps) {
  const router = useRouter();

  // Fetch group details
  const { data: group, isLoading: isLoadingGroup, error: groupError } =
    trpc.groups.getGroupById.useQuery({ groupId });

  // Fetch group posts
  const { data: posts, isLoading: isLoadingPosts, error: postsError } =
    trpc.groups.getGroupPosts.useQuery({ groupId });

  const handleBack = () => {
    router.push("/feed");
  };

  // Loading state
  if (isLoadingGroup) {
    return (
      <div className="w-full max-w-2xl mx-auto min-h-screen border-x border-neutral-800 bg-black text-white">
        <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-neutral-800">
          <div className="flex items-center gap-4 p-4 animate-pulse">
            <div className="p-2 w-9 h-9 bg-neutral-800 rounded-full" />
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-neutral-800 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-neutral-800 rounded w-1/3" />
                <div className="h-4 bg-neutral-800 rounded w-1/4" />
              </div>
            </div>
            <div className="w-20 h-9 bg-neutral-800 rounded-full" />
          </div>
          <div className="px-4 pb-3">
            <div className="h-4 bg-neutral-800 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (groupError || !group) {
    return (
      <div className="w-full max-w-2xl mx-auto min-h-screen border-x border-neutral-800 bg-black text-white">
        <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-neutral-800">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-red-500 font-semibold">
            {groupError ? "Failed to load group" : "Group not found"}
          </p>
          {groupError && (
            <p className="text-neutral-400 text-sm mt-2">{groupError.message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen border-x border-neutral-800 bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-neutral-800">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3 flex-1">
            {group.image ? (
              <Image
                src={group.image}
                alt={group.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center font-bold">
                {group.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg">{group.name}</h1>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Users size={14} />
                <span>{group.memberCount.toLocaleString()} members</span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-full font-semibold text-sm transition-colors">
            {group.isMember ? "Joined" : "Join"}
          </button>
        </div>
        {group.description && (
          <div className="px-4 pb-3">
            <p className="text-neutral-400 text-sm">{group.description}</p>
          </div>
        )}
      </div>

      {/* Create Post Box */}
      <CreatePostBox />

      {/* Group Posts */}
      <div className="flex flex-col">
        {isLoadingPosts ? (
          // Loading skeleton for posts
          <div className="flex flex-col">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b border-neutral-800 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-neutral-800 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-neutral-800 rounded w-1/4" />
                    <div className="h-4 bg-neutral-800 rounded w-full" />
                    <div className="h-4 bg-neutral-800 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : postsError ? (
          <div className="p-8 text-center">
            <p className="text-red-500 font-semibold">Failed to load posts</p>
            <p className="text-neutral-400 text-sm mt-2">{postsError.message}</p>
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-neutral-400">No posts yet</p>
            <p className="text-neutral-500 text-sm mt-2">Be the first to post in this group!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              postId={post.id}
              name={post.name}
              username={post.username}
              time={post.time}
              text={post.text}
              imageUrl={post.imageUrl}
              avatarUrl={post.avatarUrl}
              userId={post.userId}
              likeCount={post.likeCount}
              commentCount={post.commentCount}
            />
          ))
        )}
      </div>
    </div>
  );
}
