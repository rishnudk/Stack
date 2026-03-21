"use client";
import Image from "next/image";
import { MessageCircle, Repeat2, Share, Bookmark, Heart } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostMenu } from "./PostMenu";
import { PostContent } from "./PostContent";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import type { Session } from "next-auth";

export function PostCard({
  name,
  username,
  time,
  text,
  imageUrl,
  postId,
  likeCount: initialLikeCount = 0,
  commentCount = 0,
  isDetailView = false,
  avatarUrl,
  userId,
  keyword = "show",
  isSaved: initialIsSaved = false,
  session: propSession,
}: {
  name: string;
  username: string;
  time: string;
  text: string;
  imageUrl?: string;
  postId?: string;
  likeCount?: number;
  commentCount?: number;
  isDetailView?: boolean;
  avatarUrl?: string;
  userId?: string;
  keyword?: string;
  isSaved?: boolean;
  session?: Session | null;
}) {
  // Use prop session if provided, otherwise fall back to hook
  const { data: hookSession } = useSession();
  const session = propSession !== undefined ? propSession : hookSession;
  const isGuest = !session;

  const router = useRouter();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isDeleted, setIsDeleted] = useState(false);

  const isOwner = session?.user?.id === userId;

  // Guest prompt helper — shows a toast nudging sign-in
  const promptSignIn = (action: string) => {
    toast(
      <span>
        <b>Sign in</b> to {action}.{" "}
        <a href="/signin" className="underline font-medium text-green-400">
          Sign in →
        </a>
      </span>,
      { duration: 3000 }
    );
  };

  const handleLike = () => {
    if (isGuest) {
      promptSignIn("like posts");
      return;
    }
    if (isLiked) setLikeCount((prev) => prev - 1);
    else setLikeCount((prev) => prev + 1);
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    if (isGuest) {
      promptSignIn("save posts");
      return;
    }
    setIsSaved((prev) => !prev);
  };

  const handleCommentClick = () => {
    if (isGuest) {
      promptSignIn("comment on posts");
      return;
    }
    if (!isDetailView && postId) {
      router.push(`/feed/post/${postId}`);
    }
  };

  const handleProfileClick = () => {
    if (userId) router.push(`/profile?userId=${userId}`);
  };

  const handleFollowClick = () => {
    if (isGuest) {
      promptSignIn("follow developers");
      return;
    }
  };

  const isLongText = text.length > 200;

  if (isDeleted) return null;

  return (
    <div className="border-b border-neutral-800 p-3 text-white bg-black">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <Image
            src={avatarUrl || "/profile.png"}
            alt="user"
            width={36}
            height={36}
            className="w-9 h-9 object-cover rounded-full cursor-pointer"
            onClick={handleProfileClick}
          />

          <div className="flex flex-col leading-tight">
            {/* Name + Follow */}
            <div className="flex items-center gap-2">
              <p
                onClick={handleProfileClick}
                className="font-semibold text-sm cursor-pointer hover:underline"
              >
                {name}
              </p>

              {!isOwner && (
                <button
                  onClick={handleFollowClick}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Follow
                </button>
              )}
            </div>

            {/* Username + keyword + time */}
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span>@{username}</span>
              <span className="text-neutral-400">#{keyword}</span>
              <span>· {time}</span>
            </div>

            {/* Post text */}
            <div className="mt-1">
              <p
                className={`text-sm text-neutral-200 whitespace-pre-wrap ${
                  !isExpanded && !isDetailView && isLongText ? "line-clamp-3" : ""
                }`}
              >
                <PostContent text={text} />
              </p>

              {!isExpanded && !isDetailView && isLongText && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-neutral-400 mt-1"
                >
                  ...more
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Post menu — only for authenticated users */}
        {postId && !isGuest && (
          <PostMenu
            postId={postId}
            isSaved={isSaved}
            isOwner={isOwner}
            onSaveToggle={setIsSaved}
            onDelete={() => setIsDeleted(true)}
          />
        )}
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="mt-3 rounded-xl overflow-hidden border border-neutral-800 ml-12 max-w-sm">
          <Image
            src={imageUrl}
            alt="post image"
            width={500}
            height={350}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Actions */}
      {!isDetailView && (
        <div className="flex items-center gap-8 mt-3 ml-11">

          {/* Comment */}
          <button
            onClick={handleCommentClick}
            className={`flex items-center gap-1 group ${isGuest ? "opacity-60" : ""}`}
            title={isGuest ? "Sign in to comment" : "Comment"}
          >
            <MessageCircle
              size={16}
              className="text-neutral-400 group-hover:text-blue-500"
            />
            {commentCount > 0 && (
              <span className="text-xs text-neutral-400">{commentCount}</span>
            )}
          </button>

          {/* Like */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 group ${isGuest ? "opacity-60" : ""}`}
            title={isGuest ? "Sign in to like" : "Like"}
          >
            <Heart
              size={16}
              className={`${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-neutral-400 group-hover:text-red-500"
              }`}
            />
            {likeCount > 0 && (
              <span className="text-xs text-neutral-400">{likeCount}</span>
            )}
          </button>

          {/* Reshare */}
          <button
            className="flex items-center gap-1 group opacity-60"
            disabled
          >
            <Repeat2 size={16} className="text-neutral-400" />
            <span className="text-xs text-neutral-400">0</span>
          </button>

          {/* Share */}
          <button className="flex items-center gap-1 group">
            <Share
              size={16}
              className="text-neutral-400 group-hover:text-neutral-200"
            />
            <span className="text-xs text-neutral-400">0</span>
          </button>

          {/* Bookmark */}
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-1 group p-1 rounded-full hover:bg-neutral-800 ${
              isGuest ? "opacity-60" : ""
            }`}
            title={isGuest ? "Sign in to save" : "Save post"}
          >
            <Bookmark
              size={16}
              className={`${
                isSaved
                  ? "fill-blue-500 text-blue-500"
                  : "text-neutral-400 group-hover:text-blue-500"
              }`}
            />
          </button>
        </div>
      )}

      {/* Guest sign-in nudge strip — visible only when detail view */}
      {isDetailView && isGuest && (
        <div className="ml-11 mt-3 text-xs text-neutral-500">
          <Link href="/signin" className="text-green-400 hover:underline font-medium">
            Sign in
          </Link>{" "}
          to like, comment, and follow developers.
        </div>
      )}
    </div>
  );
}
