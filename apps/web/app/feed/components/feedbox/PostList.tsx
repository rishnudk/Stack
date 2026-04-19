"use client";
import { formatPostTime } from "@/utils/formatTime";
import { PostCard } from "./PostCard";
import { ArticleCard } from "../article/ArticleCard";
import { trpc } from "@/utils/trpc";
import { useMemo } from "react";
import type { Session } from "next-auth";

interface PostListProps {
  session?: Session | null;
}

export function PostList({ session }: PostListProps = {}) {
  const { data: postsData, isLoading: postsLoading } = trpc.posts.getPosts.useQuery({ limit: 20 });
  const { data: articlesData, isLoading: articlesLoading } = trpc.articles.getArticles.useQuery({ limit: 20 });

  const feedItems = useMemo(() => {
    const posts = (postsData?.posts || []).map((post: any) => ({ ...post, _feedType: "post" }));

    const rawArticles = Array.isArray(articlesData)
      ? articlesData
      : (articlesData as any)?.articles || (articlesData as any)?.items || [];

    const articles = rawArticles.map((article: any) => ({ ...article, _feedType: "article" }));

    const combined = [...posts, ...articles].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || Date.now()).getTime();
      const dateB = new Date(b.createdAt || b.date || Date.now()).getTime();
      return dateB - dateA;
    });

    return combined;
  }, [postsData, articlesData]);

  if (postsLoading && articlesLoading) {
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
            avatarUrl={item.author.avatarUrl || item.author.image || undefined}
            isSaved={item.isSaved}
            isLiked={item.isLiked}
            session={session}
          />
        );
      })}

      {feedItems.length === 0 && !postsLoading && !articlesLoading && (
        <div className="text-neutral-500 p-8 text-center text-sm">
          No posts yet. Be the first to share something!
        </div>
      )}
    </div>
  );
}
