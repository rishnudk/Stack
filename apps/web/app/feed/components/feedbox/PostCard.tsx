"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { trpc } from "@/utils/trpc";
import type { Session } from "next-auth";
import { PostCardView } from "./PostCardView";

type PostCardProps = {
  name: string;
  username: string;
  time: string;
  text: string;
  imageUrl?: string;
  postId?: string;
  likeCount?: number;
  commentCount?: number;
  reshareCount?: number;
  isDetailView?: boolean;
  avatarUrl?: string;
  userId?: string;
  keyword?: string;
  isSaved?: boolean;
  isLiked?: boolean;
  isReshared?: boolean;
  session?: Session | null;
};

export function PostCard({
  name,
  username,
  time,
  text,
  imageUrl,
  postId,
  likeCount: initialLikeCount = 0,
  commentCount = 0,
  reshareCount: initialReshareCount = 0,
  isDetailView = false,
  avatarUrl,
  userId,
  keyword = "show",
  isSaved: initialIsSaved = false,
  isLiked: initialIsLiked = false,
  isReshared: initialIsReshared = false,
  session: propSession,
}: PostCardProps) {
  // Use prop session if provided, otherwise fall back to hook
  const { data: hookSession } = useSession();
  const session = propSession !== undefined ? propSession : hookSession;
  const isGuest = !session;

  const router = useRouter();

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isReshared, setIsReshared] = useState(initialIsReshared);
  const [reshareCount, setReshareCount] = useState(initialReshareCount);
  const [isDeleted, setIsDeleted] = useState(false);

  const toggleLikeMutation = trpc.likes.toggleLike.useMutation({
    onError: (err) => {
      toast.error("Failed to like post");
      // Rollback
      setIsLiked(isLiked);
      setLikeCount(likeCount);
    }
  });

  const isOwner = session?.user?.id === userId;

  const toggleReshareMutation = trpc.posts.toggleReshare.useMutation({
    onError: (err) => {
      toast.error(err.message || "Failed to reshare post");
    },
  });

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

    // Toggle local state (Optimistic Update)
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    // Persist to DB
    if (postId) {
      toggleLikeMutation.mutate({ postId });
    }
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

  const handleReshare = async () => {
    if (isGuest) {
      promptSignIn("reshare posts");
      return;
    }
    if (!postId) return;

    const prevIsReshared = isReshared;
    const prevReshareCount = reshareCount;
    const nextIsReshared = !prevIsReshared;

    setIsReshared(nextIsReshared);
    setReshareCount((prev) => (nextIsReshared ? prev + 1 : Math.max(prev - 1, 0)));

    try {
      const result = await toggleReshareMutation.mutateAsync({ postId });
      setIsReshared(result.isReshared);
      setReshareCount(result.reshareCount);
      toast.success(result.isReshared ? "Reposted" : "Repost removed");
    } catch {
      setIsReshared(prevIsReshared);
      setReshareCount(prevReshareCount);
    }
  };

  const handleShare = async () => {
    if (!postId) return;
    const shareUrl = `${window.location.origin}/feed/post/${postId}`;
    const shareTitle = `${name} on Stack`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text,
          url: shareUrl,
        });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Post link copied");
    } catch {
      toast.error("Unable to share this post right now");
    }
  };

  const isLongText = text.length > 200;

  if (isDeleted) return null;

  return (
    <PostCardView
      name={name}
      username={username}
      time={time}
      text={text}
      imageUrl={imageUrl}
      postId={postId}
      commentCount={commentCount}
      likeCount={likeCount}
      reshareCount={reshareCount}
      isDetailView={isDetailView}
      avatarUrl={avatarUrl}
      keyword={keyword}
      isSaved={isSaved}
      isLiked={isLiked}
      isReshared={isReshared}
      isOwner={isOwner}
      isGuest={isGuest}
      isExpanded={isExpanded}
      isLongText={isLongText}
      onExpand={() => setIsExpanded(true)}
      onProfileClick={handleProfileClick}
      onFollowClick={handleFollowClick}
      onCommentClick={handleCommentClick}
      onLike={handleLike}
      onReshare={handleReshare}
      onShare={handleShare}
      onBookmark={handleBookmark}
      onSaveToggle={setIsSaved}
      onDelete={() => setIsDeleted(true)}
    />
  );
}
