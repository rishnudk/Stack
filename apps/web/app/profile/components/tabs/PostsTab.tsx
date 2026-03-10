import { PostCard } from "../../../feed/components/feedbox/PostCard";
import { formatPostTime } from "@/utils/formatTime";

interface PostsTabProps {
    posts: any[];
    isLoading: boolean;
    isOwnProfile: boolean;
}

export function PostsTab({ posts, isLoading, isOwnProfile }: PostsTabProps) {
    if (isLoading) {
        return (
            <div className="p-8 text-center text-neutral-500">
                Loading posts...
            </div>
        );
    }

    if (!posts?.length) {
        return (
            <div className="p-8 text-center text-neutral-500">
                {isOwnProfile
                    ? "Share your first thought!"
                    : "This user hasn't posted anything yet."}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    userId={post.author.id}
                    name={post.author.name || "Unknown"}
                    username={post.author.email?.split("@")[0] || "user"}
                    time={formatPostTime(new Date(post.createdAt))}
                    text={post.content}
                    imageUrl={post.images?.[0]}
                    postId={post.id}
                    likeCount={post.likes.length}
                    commentCount={post.comments.length}
                    avatarUrl={post.author.avatarUrl || post.author.image || undefined}
                    isSaved={post.isSaved}
                />
            ))}
        </div>
    );
}