"use client";
import Image from "next/image";
import { Ellipsis, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostDetailView } from "./PostDetailView";
import { StackLogos } from "./StackLogos";
import { PostMenu } from "./PostMenu";
import { PostContent } from "./PostContent";
import { useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
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
  skills = [],
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
  skills?: string[];
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
    if (isLiked) {
      setLikeCount(prev => prev - 1);
    } else {
      setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCommentClick = () => {
    if (!isDetailView && postId) {
      router.push(`/feed/post/${postId}`);
    }
  };

  const handleProfileClick = () => {
    if (userId) {
      router.push(`/profile?userId=${userId}`);
    }
  };

  const isLongText = text.length > 200; // Heuristic for long text

  if (isDeleted) return null;

  return (
    <div className="flex flex-col border-b border-neutral-800 bg-black text-white p-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <Image
            src={avatarUrl || "/profile.png"}
            alt="user"
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded-full cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleProfileClick}
          />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <p onClick={handleProfileClick} className="font-semibold cursor-pointer hover:underline flex items-center">
                {name}
              </p>
              <StackLogos skills={skills} isOwnPost={isOwner} />
              <span className="text-neutral-500 text-sm ml-1">· {time}</span>
            </div>
            <div className="mt-1">
              <p
                className={`text-neutral-200 whitespace-pre-wrap ${!isExpanded && !isDetailView && isLongText ? "line-clamp-3" : ""
                  }`}
              >
                <PostContent text={text} />
              </p>
              {!isExpanded && !isDetailView && isLongText && (
                <div className="flex">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-neutral-400 hover:text-blue-800 text-sm mt-1"
                  >
                    ...more
                  </button>
                </div>
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

      {imageUrl && (
        <div className="mt-3 rounded-2xl overflow-hidden border border-neutral-800 ml-12">
          <Image src={imageUrl} alt="post image" width={500} height={350} className="w-full h-auto" />
        </div>
      )}

      {/* Action Buttons - Only show if not in detail view */}
      {!isDetailView && (
        <div className="flex items-center gap-6 mt-4 ml-12">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 group transition-colors"
          >
            <Heart
              size={18}
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

          {/* Comment Button */}
          <button
            onClick={handleCommentClick}
            className="flex items-center gap-2 group transition-colors"
          >
            <MessageCircle
              size={18}
              className="text-neutral-400 group-hover:text-blue-500 transition-colors"
            />
            {commentCount > 0 && (
              <span className="text-sm text-neutral-400">{commentCount}</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
