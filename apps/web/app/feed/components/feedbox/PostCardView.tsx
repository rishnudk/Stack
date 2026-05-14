"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Repeat2, Share, Bookmark, Heart, Code } from "lucide-react";
import { PostMenu } from "./PostMenu";
import { PostContent } from "./PostContent";
import { useRouter } from "next/navigation";

type PostCardViewProps = {
  name: string;
  username: string;
  time: string;
  text: string;
  imageUrl?: string;
  postId?: string;
  commentCount: number;
  likeCount: number;
  reshareCount: number;
  isDetailView: boolean;
  avatarUrl?: string;
  keyword: string;
  isSaved: boolean;
  isLiked: boolean;
  isReshared: boolean;
  isOwner: boolean;
  isGuest: boolean;
  isExpanded: boolean;
  isLongText: boolean;
  onExpand: () => void;
  onProfileClick: () => void;
  onFollowClick: () => void;
  onCommentClick: () => void;
  onLike: () => void;
  onReshare: () => void;
  onShare: () => void;
  onBookmark: () => void;
  onSaveToggle: (next: boolean) => void;
  onDelete: () => void;
};

export function PostCardView({
  name,
  username,
  time,
  text,
  imageUrl,
  postId,
  commentCount,
  likeCount,
  reshareCount,
  isDetailView,
  avatarUrl,
  keyword,
  isSaved,
  isLiked,
  isReshared,
  isOwner,
  isGuest,
  isExpanded,
  isLongText,
  onExpand,
  onProfileClick,
  onFollowClick,
  onCommentClick,
  onLike,
  onReshare,
  onShare,
  onBookmark,
  onSaveToggle,
  onDelete,
}: PostCardViewProps) {
  const router = useRouter();

  const embedRegex = /\[PROJECT_EMBED:(.+?)\]/;
  const match = text.match(embedRegex);
  let projectEmbed: any = null;
  let cleanText = text;
  
  if (match) {
    try {
      projectEmbed = JSON.parse(match[1]);
      cleanText = text.replace(embedRegex, '').trim();
    } catch (e) {
      // Invalid JSON, ignore
    }
  }

  // Recalculate isLongText based on cleanText
  const isActuallyLongText = cleanText.length > 200;

  return (
    <div className="border-b border-neutral-800 p-3 text-white bg-black">
      <div className="flex justify-between items-start">
        <div className="flex gap-2 w-full">
          <Image
            src={avatarUrl || "/profile.jpg"}
            alt="user"
            width={36}
            height={36}
            className="w-9 h-9 object-cover rounded-full cursor-pointer flex-shrink-0"
            onClick={onProfileClick}
          />

          <div className="flex flex-col leading-tight w-full min-w-0">
            <div className="flex items-center gap-2">
              <p
                onClick={onProfileClick}
                className="font-semibold text-sm cursor-pointer hover:underline truncate"
              >
                {name}
              </p>

              {!isOwner && (
                <button
                  onClick={onFollowClick}
                  className="text-xs text-blue-400 hover:underline shrink-0"
                >
                  Follow
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="truncate">@{username}</span>
              <span className="text-neutral-400 shrink-0">#{keyword}</span>
              <span className="shrink-0">· {time}</span>
            </div>

            <div className="mt-1">
              <p
                className={`text-sm text-neutral-200 whitespace-pre-wrap break-words ${
                  !isExpanded && !isDetailView && isActuallyLongText ? "line-clamp-3" : ""
                }`}
              >
                <PostContent text={cleanText} />
              </p>

              {!isExpanded && !isDetailView && isActuallyLongText && (
                <button onClick={onExpand} className="text-xs text-neutral-400 mt-1">
                  ...more
                </button>
              )}
            </div>

            {projectEmbed && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  if (projectEmbed.id && projectEmbed.userId) {
                    router.push(`/profile?userId=${projectEmbed.userId}&tab=projects&projectId=${projectEmbed.id}`);
                  } else if (projectEmbed.url) {
                    window.open(projectEmbed.url, "_blank");
                  }
                }}
                className="mt-3 block p-3 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all hover:bg-neutral-800/50 cursor-pointer max-w-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Code size={16} className="text-blue-400 shrink-0" />
                  <span className="font-semibold text-white text-sm truncate">{projectEmbed.name}</span>
                </div>
                {projectEmbed.description && (
                  <p className="text-neutral-400 text-xs line-clamp-2 mb-2">{projectEmbed.description}</p>
                )}
                {projectEmbed.url && (
                  <span className="text-neutral-500 text-xs truncate block hover:underline text-blue-400/80">{projectEmbed.url}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {postId && !isGuest && (
          <div className="shrink-0 ml-2">
            <PostMenu
              postId={postId}
              isSaved={isSaved}
              isOwner={isOwner}
              onSaveToggle={onSaveToggle}
              onDelete={onDelete}
            />
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="mt-3 rounded-xl overflow-hidden border border-neutral-800 ml-11 max-w-sm">
          <Image
            src={imageUrl}
            alt="post image"
            width={500}
            height={350}
            className="w-full h-auto"
          />
        </div>
      )}

      {!isDetailView && (
        <div className="flex items-center gap-8 mt-3 ml-11">
          <button
            onClick={onCommentClick}
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

          <button
            onClick={onLike}
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

          <button
            onClick={onReshare}
            className={`flex items-center gap-1 group ${isGuest ? "opacity-60" : ""}`}
            title={isGuest ? "Sign in to reshare" : "Reshare"}
          >
            <Repeat2
              size={16}
              className={
                isReshared
                  ? "text-green-500"
                  : "text-neutral-400 group-hover:text-green-500"
              }
            />
            {reshareCount > 0 && (
              <span className="text-xs text-neutral-400">{reshareCount}</span>
            )}
          </button>

          <button onClick={onShare} className="flex items-center gap-1 group" title="Share link">
            <Share size={16} className="text-neutral-400 group-hover:text-neutral-200" />
          </button>

          <button
            onClick={onBookmark}
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
