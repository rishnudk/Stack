"use client";
import Image from "next/image";
import { Ellipsis, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostDetailView } from "./PostDetailView";


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
}) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

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
router.push(`/feed/post/${postId}`);    }
  };

  return (
    <div className="flex flex-col border-b border-neutral-800 bg-black text-white p-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <Image src={avatarUrl || "/profile.png"} alt="user" width={40} height={40} className="rounded-full" />
          <div>
            <p className="font-semibold">
              {name} <span className="text-neutral-500">@{username} · {time}</span>
            </p>
            <p className="text-neutral-200 mt-1">{text}</p>
          </div>
        </div>
        <Ellipsis className="text-neutral-400" size={18} />
      </div>

      {imageUrl && (
        <div className="mt-3 rounded-2xl overflow-hidden border border-neutral-800">
          <Image src={imageUrl} alt="post image" width={500} height={350} />
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
              className={`transition-all ${
                isLiked
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
