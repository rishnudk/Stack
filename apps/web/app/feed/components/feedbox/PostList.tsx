"use client";
import { formatPostTime } from "@/utils/formatTime";
import { PostCard } from "./PostCard";
import { trpc } from "@/utils/trpc";

export function PostList() {
  const { data, isLoading } = trpc.posts.getPosts.useQuery({ limit: 10 });

  if (isLoading) {
    return <div className="text-white p-4">Loading posts...</div>;
  }

  const posts = (data?.posts || []) as any[];

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          postId={post.id}
          userId={post.author.id}
          name={post.author.name || "Unknown"}
          username={post.author.email?.split("@")[0] || "user"}
          time={formatPostTime(new Date(post.createdAt))}
          text={post.content}
          imageUrl={post.images?.[0]}
          likeCount={post.likes.length}
          commentCount={post.comments.length}
          avatarUrl={post.author.avatarUrl || post.author.image || undefined}
        />
      ))}
    </div>
  );
}
