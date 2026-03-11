"use client";

import Image from "next/image";
import { Heart, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { formatPostTime } from "@/utils/formatTime";

interface CommentProps {
  comment: any;
  targetId: string;
  type?: "post" | "article";
  onCommentAdded: () => void;
  depth?: number;
}

export function Comment({ comment, targetId, type = "post", onCommentAdded, depth = 0 }: CommentProps) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);

  const addPostCommentMutation = trpc.comments.addComment.useMutation();
  const togglePostLikeMutation = trpc.comments.toggleCommentLike.useMutation();

  const addArticleCommentMutation = trpc.articles.addComment.useMutation();
  const toggleArticleLikeMutation = trpc.articles.toggleCommentLike.useMutation();

  const isPending = type === "post" ? addPostCommentMutation.isPending : addArticleCommentMutation.isPending;
  const isLikePending = type === "post" ? togglePostLikeMutation.isPending : toggleArticleLikeMutation.isPending;

  const handleReply = async () => {
    if (!replyText.trim()) return;

    if (type === "post") {
      await addPostCommentMutation.mutateAsync({
        postId: targetId,
        content: replyText,
        parentId: comment.id,
      });
    } else {
      await addArticleCommentMutation.mutateAsync({
        articleId: targetId,
        content: replyText,
        parentId: comment.id,
      });
    }

    setReplyText("");
    setShowReplyBox(false);
    onCommentAdded();
  };

  const handleLike = async () => {
    let result;
    if (type === "post") {
      result = await togglePostLikeMutation.mutateAsync({ commentId: comment.id });
    } else {
      result = await toggleArticleLikeMutation.mutateAsync({ commentId: comment.id });
    }

    if (result.liked) {
      setIsLiked(true);
      setLikeCount((prev: number) => prev + 1);
    } else {
      setIsLiked(false);
      setLikeCount((prev: number) => prev - 1);
    }
  };

  // Limit nesting depth for UI purposes
  const maxDepth = 3;
  const shouldIndent = depth < maxDepth;

  return (
    <div className={`border-b border-neutral-800 ${shouldIndent ? `ml-${depth * 12}` : ""}`}>
      <div className="p-4">
        <div className="flex gap-3">
          <Image
            src="/profile.png"
            alt="user"
            width={depth === 0 ? 40 : 32}
            height={depth === 0 ? 40 : 32}
            className="rounded-full"
          />
          <div className="flex-1">
            {/* Comment Header */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.user.name || "Unknown"}</span>
              <span className="text-neutral-500 text-sm">
                @{comment.user.email?.split("@")[0] || "user"}
              </span>
              <span className="text-neutral-500 text-sm">·</span>
              <span className="text-neutral-500 text-sm">
                {formatPostTime(new Date(comment.createdAt))}
              </span>
            </div>

            {/* Comment Content */}
            <p className="text-neutral-200 mt-1">{comment.content}</p>

            {/* Action Buttons */}
            <div className="flex items-center gap-6 mt-3">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className="flex items-center gap-2 group transition-colors"
                disabled={isLikePending}
              >
                <Heart
                  size={16}
                  className={`transition-all ${isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-neutral-400 group-hover:text-red-500"
                    }`}
                />
                {likeCount > 0 && (
                  <span className={`text-sm ${isLiked ? "text-red-500" : "text-neutral-400"}`}>
                    {likeCount}
                  </span>
                )}
              </button>

              {/* Reply Button */}
              <button
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="flex items-center gap-2 group transition-colors"
              >
                <MessageCircle
                  size={16}
                  className={`transition-colors ${showReplyBox
                    ? "text-blue-500"
                    : "text-neutral-400 group-hover:text-blue-500"
                    }`}
                />
                <span className="text-sm text-neutral-400">Reply</span>
              </button>
            </div>

            {/* Reply Input Box */}
            {showReplyBox && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleReply();
                    }
                  }}
                  placeholder="Write a reply..."
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                />
                <button
                  onClick={handleReply}
                  disabled={!replyText.trim() || isPending}
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-800 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 border-l-2 border-neutral-800">
          {comment.replies.map((reply: any) => (
            <Comment
              key={reply.id}
              comment={reply}
              targetId={targetId}
              type={type}
              onCommentAdded={onCommentAdded}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
