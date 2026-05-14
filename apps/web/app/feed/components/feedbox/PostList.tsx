"use client";
import { formatPostTime } from "@/utils/formatTime";
import { PostCard } from "./PostCard";
import { ArticleCard } from "../article/ArticleCard";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";
import type { Session } from "next-auth";
import Link from "next/link";

interface PostListProps {
  session?: Session | null;
  activeTab?: string;
}

export function PostList({ session, activeTab = "Newest" }: PostListProps = {}) {
  // Only fetch if they're not a guest trying to view Following, or if they are just viewing other tabs
  const isGuestOnFollowing = !session && activeTab === "Following";

  const { data: postsData, isLoading: postsLoading } = trpc.posts.getPosts.useQuery(
    { limit: 20, feedType: activeTab as any },
    { enabled: !isGuestOnFollowing }
  );

  const { data: articlesData, isLoading: articlesLoading } = trpc.articles.getArticles.useQuery(
    { limit: 20 },
    { enabled: activeTab !== "Following" } // Articles don't have a following concept yet, so skip them on Following tab to avoid mixing
  );

  const feedItems = useMemo(() => {
    if (isGuestOnFollowing) return [];

    const posts = (postsData?.posts || []).map((post: any) => ({ ...post, _feedType: "post" }));

    // If we're on Following tab, we decided to skip articles above (so it'll be undefined/empty)
    const rawArticles = Array.isArray(articlesData)
      ? articlesData
      : (articlesData as any)?.articles || (articlesData as any)?.items || [];

    const articles = activeTab === "Following" 
        ? [] // Don't mix articles into following feed for now
        : rawArticles.map((article: any) => ({ ...article, _feedType: "article" }));

    const combined = [...posts, ...articles].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || Date.now()).getTime();
      const dateB = new Date(b.createdAt || b.date || Date.now()).getTime();
      
      // If Trending, we don't want to override the backend sorting with strict date sorting for posts.
      // But since we have articles mixed in, we might need to. 
      // Actually, if it's trending, we should trust the backend order for posts, and maybe just append articles?
      // For simplicity, if it's Trending, let's just stick to the backend post order, but we have mixed items.
      // Since `getPosts` sorted by trending, let's keep the posts order and interleave articles by date?
      // Actually, if activeTab === "Trending", maybe we shouldn't sort them by date and lose the likes sort.
      // Let's just sort by date if it's Newest or Following. If Trending, we might want a different strategy.
      // But we don't have "likes" on articles easily comparable. Let's just sort by date for Newest/Following.
      if (activeTab === "Trending") {
          // Keep original order as much as possible. Since articles are sorted by date, and posts by likes.
          // This might be tricky. Let's just return 0 to keep relative order, and put articles at the end.
          if (a._feedType === b._feedType) return 0;
          return a._feedType === "post" ? -1 : 1; 
      }
      
      return dateB - dateA;
    });

    return combined;
  }, [postsData, articlesData, isGuestOnFollowing, activeTab]);

  if (isGuestOnFollowing) {
    return (
      <div className="text-neutral-500 p-8 text-center text-sm flex flex-col items-center gap-2">
        <p>Sign in to see posts from developers you follow.</p>
        <Link href="/signin" className="px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors mt-2">
          Sign In
        </Link>
      </div>
    );
  }

  if (postsLoading && (articlesLoading || activeTab === "Following")) {
    return <div className="text-neutral-500 p-8 text-center text-sm">Loading feed...</div>;
  }

  return (
    <div>
      {feedItems.map((item: any) => {
        if (item._feedType === "article") {
          return (
            <div key={`article-${item.id}`}>
              <ArticleCard article={item} />
            </div>
          );
        }

        return (
          <PostCard
            key={`post-${item.id}`}
            postId={item.id}
            userId={item.author.id}
            name={item.author.name || "Unknown"}
            username={item.author.email?.split("@")[0] || "user"}
            time={formatPostTime(new Date(item.createdAt))}
            text={item.content}
            imageUrl={item.images?.[0]}
            likeCount={item.likes?.length || 0}
            commentCount={item.comments?.length || 0}
            reshareCount={item.reshares?.length || 0}
            avatarUrl={item.author.avatarUrl || item.author.image || undefined}
            isSaved={item.isSaved}
            isLiked={item.isLiked}
            isReshared={item.isReshared}
            session={session}
          />
        );
      })}

      {feedItems.length === 0 && !postsLoading && !articlesLoading && (
        <div className="text-neutral-500 p-8 text-center text-sm">
          {activeTab === "Following" 
            ? "You aren't following anyone who has posted yet." 
            : "No posts yet. Be the first to share something!"}
        </div>
      )}
    </div>
  );
}
