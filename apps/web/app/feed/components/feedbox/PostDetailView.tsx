"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/utils/trpc";
import { PostCard } from "./PostCard";
import { Comment } from "../Comment";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { formatPostTime } from "@/utils/formatTime";

interface PostDetailViewProps {
  postId: string;
}

export function PostDetailView({ postId }: PostDetailViewProps) {
  const router = useRouter();
  const [commentText, setCommentText] = useState("");

  const { data: post, isLoading: postLoading } = trpc.posts.getPostById.useQuery({ postId });
  const { data: comments, refetch: refetchComments } = trpc.comments.getComments.useQuery({ postId });
  const addCommentMutation = trpc.comments.addComment.useMutation();

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    await addCommentMutation.mutateAsync({
      postId,
      content: commentText,
    });

    setCommentText("");
    refetchComments();
  };

  if (postLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-neutral-400">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-neutral-400">Post not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-neutral-800 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/feed")}
            className="p-2 hover:bg-neutral-900 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold">Post</h1>
        </div>
      </div>

      {/* Original Post */}
      <div className="border-b border-neutral-800">
        <PostCard
          userId={post.author.id}
          name={post.author.name || "Unknown"}
          username={post.author.email?.split("@")[0] || "user"}
          time={formatPostTime(new Date(post.createdAt))}
          text={post.content}
          imageUrl={post.images?.[0]}
          postId={post.id}
          likeCount={post.likes.length}
          commentCount={post.comments.length}
          isDetailView={true}
          avatarUrl={post.author.avatarUrl || post.author.image || undefined}
        />
      </div>

      {/* Add Comment Section */}
      <div className="border-b border-neutral-800 p-4">
        <div className="flex gap-3">
          <img src="/profile.png" alt="user" className="w-10 h-10 rounded-full" />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              placeholder="Add a comment..."
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim() || addCommentMutation.isPending}
              className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              postId={postId}
              onCommentAdded={refetchComments}
            />
          ))
        ) : (
          <div className="p-8 text-center text-neutral-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}