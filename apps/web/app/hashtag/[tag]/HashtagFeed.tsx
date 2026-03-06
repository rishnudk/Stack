"use client";

import { trpc } from "@/utils/trpc";
import { PostCard } from "../../feed/components/feedbox/PostCard";
import { formatPostTime } from "@/utils/formatTime";
import { Hash } from "lucide-react";

export function HashtagFeed({ tag }: { tag: string }) {
    const { data, isLoading } = trpc.posts.getPostsByHashtag.useQuery(
        { tag, limit: 20 },
        { staleTime: 60_000 }
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 p-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-3 p-4 border-b border-neutral-800">
                        <div className="w-10 h-10 rounded-full bg-neutral-800 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-32 rounded bg-neutral-800" />
                            <div className="h-3 w-full rounded bg-neutral-800" />
                            <div className="h-3 w-3/4 rounded bg-neutral-800" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const posts = data?.posts ?? [];

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-500 gap-3">
                <Hash size={40} className="text-neutral-700" />
                <p className="text-lg font-semibold text-white">No posts yet</p>
                <p className="text-sm">Be the first to post using <span className="text-sky-400">#{tag}</span></p>
            </div>
        );
    }

    return (
        <div>
            {posts.map((post: any) => (
                <PostCard
                    key={post.id}
                    postId={post.id}
                    userId={post.author.id}
                    name={post.author.name || "Unknown"}
                    username={post.author.email?.split("@")[0] || "user"}
                    time={formatPostTime(new Date(post.createdAt))}
                    text={post.content}
                    imageUrl={post.images?.[0]}
                    likeCount={post.likes.length}
                    commentCount={post.comments.length}
                    avatarUrl={post.author.avatarUrl || post.author.image || undefined}
                    isSaved={post.isSaved}
                />
            ))}
        </div>
    );
}
