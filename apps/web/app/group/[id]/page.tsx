'use client';
import Image from "next/image";
import { ArrowLeft, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreatePostBox } from "@/app/feed/components/feedbox/CreatePostBox";
import { PostCard } from "@/app/feed/components/feedbox/PostCard";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";

interface GroupDetailPageProps {
  params: {
    id: string;
  };
}

export default function GroupDetailPage({ params }: GroupDetailPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const groupId = params.id;

  // Fetch group details
  const { data: group, isLoading: isLoadingGroup, error: groupError } =
    trpc.groups.getGroupById.useQuery({ groupId });

  // Fetch group posts
  const { data: posts, isLoading: isLoadingPosts, error: postsError } =
    trpc.groups.getGroupPosts.useQuery({ groupId });

  const joinGroupMutation = trpc.groups.joinGroup.useMutation({
    onSuccess: () => {
      trpc.useUtils().groups.getGroupById.invalidate({ groupId });
    }
  });

  const handleJoin = () => {
    if (!session) {
      router.push('/signin');
      return;
    }
    joinGroupMutation.mutate({ groupId });
  };

  const handleBack = () => {
    router.push("/group");
  };

  // Loading state
  if (isLoadingGroup) {
    return (
      <div className="w-full min-h-screen border-x border-neutral-800 bg-black text-white pb-20">
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
        </div>
      </div>
    );
  }

  // Error state
  if (groupError || !group) {
    return (
      <div className="w-full min-h-screen border-x border-neutral-800 bg-black text-white pb-20">
        <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-neutral-800">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-bold text-lg">Group</h1>
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
    <div className="w-full min-h-screen border-x border-neutral-800 bg-black text-white pb-20">
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
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-neutral-800 text-blue-400 font-bold">
                <Users size={24} />
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg">{group.name}</h1>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <Users size={14} />
                <span>{group.memberCount.toLocaleString()} members</span>
                <span className="text-neutral-600">•</span>
                <span className="capitalize">{group.privacy.toLowerCase()} Group</span>
              </div>
            </div>
          </div>
          {!group.isMember && (
            <button 
              onClick={handleJoin}
              disabled={joinGroupMutation.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 disabled:text-neutral-500 rounded-full font-semibold text-sm transition-colors"
            >
              {joinGroupMutation.isPending ? "Joining..." : "Join"}
            </button>
          )}
          {group.isMember && (
            <button className="px-4 py-2 bg-neutral-800 text-white rounded-full font-semibold text-sm transition-colors cursor-default">
              Joined
            </button>
          )}
        </div>
        {group.description && (
          <div className="px-4 pb-3">
            <p className="text-neutral-400 text-sm">{group.description}</p>
          </div>
        )}
      </div>

      {/* Create Post Box - Only if member or public */}
      {(group.isMember || group.privacy === "PUBLIC") && (
        <CreatePostBox session={session as any} groupId={groupId} />
      )}

      {/* Private group message */}
      {!group.isMember && group.privacy === "PRIVATE" && (
        <div className="p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center mb-4">
            <Users size={32} className="text-neutral-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">This group is private</h2>
          <p className="text-neutral-400 max-w-sm">
            You need to join this group to see its posts and interact with other members.
          </p>
        </div>
      )}

      {/* Group Posts */}
      {(group.isMember || group.privacy === "PUBLIC") && (
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
            posts.map((post: any) => (
              <PostCard
                key={post.id}
                postId={post.id}
                name={post.name}
                username={post.username}
                time={post.time}
                text={post.text}
                imageUrl={post.imageUrl ?? undefined}
                avatarUrl={post.avatarUrl ?? undefined}
                userId={post.userId}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                isSaved={post.isSaved || false}
                isLiked={post.isLiked}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
