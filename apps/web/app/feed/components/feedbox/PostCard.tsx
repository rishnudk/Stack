"use client";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostMenu } from "./PostMenu";
import { PostContent } from "./PostContent";
import { useSession } from "next-auth/react";

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
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isDeleted, setIsDeleted] = useState(false);

  const isOwner = session?.user?.id === userId;

  const handleLike = () => {
    if (isLiked) setLikeCount(prev => prev - 1);
    else setLikeCount(prev => prev + 1);

    setIsLiked(!isLiked);
  };

  const handleCommentClick = () => {
    if (!isDetailView && postId) {
      router.push(`/feed/post/${postId}`);
    }
  };

  const handleProfileClick = () => {
    if (userId) router.push(`/profile?userId=${userId}`);
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
          <button className="text-xs text-blue-400 hover:underline">
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

  {postId && (
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
        <div className="flex items-center gap-6 mt-3 ml-11">

          <button
            onClick={handleLike}
            className="flex items-center gap-1 group"
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
              <span className="text-xs text-neutral-400">
                {likeCount}
              </span>
            )}
          </button>

          <button
            onClick={handleCommentClick}
            className="flex items-center gap-1 group"
          >
            <MessageCircle
              size={16}
              className="text-neutral-400 group-hover:text-blue-500"
            />

            {commentCount > 0 && (
              <span className="text-xs text-neutral-400">
                {commentCount}
              </span>
            )}
          </button>

        </div>
      )}
    </div>
  );
}