"use client"

import { notFound } from "next/navigation"
import { trpc } from "@/utils/trpc"
import { Comment } from "../../Comment"
import { useState } from "react"
import { Send } from "lucide-react"

export default function ArticlePage({
    params,
}: {
    params: { slug: string }
}) {
    const { data: article, isLoading } = trpc.articles.getArticleBySlug.useQuery({ slug: params.slug })
    const { data: comments, refetch: refetchComments } = trpc.articles.getComments.useQuery(
        { articleId: article?.id || "" },
        { enabled: !!article?.id }
    )
    
    const addCommentMutation = trpc.articles.addComment.useMutation()
    const [commentText, setCommentText] = useState("")

    const handleAddComment = async () => {
        if (!commentText.trim() || !article) return

        await addCommentMutation.mutateAsync({
            articleId: article.id,
            content: commentText,
        })

        setCommentText("")
        refetchComments()
    }

    if (isLoading) {
        return <div className="max-w-3xl mx-auto py-10 flex justify-center text-zinc-400">Loading article...</div>
    }

    if (!article) return notFound()

    return (
        <div className="max-w-3xl mx-auto py-10">
            <h1 className="text-3xl font-bold mb-4">
                {article.title}
            </h1>

            <p className="text-sm text-zinc-400 mb-8">
                by {article.author} on {article.date}
            </p>

            {article.image && (
                <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full max-h-[400px] object-cover rounded-xl mb-8" 
                />
            )}

            <article className="prose prose-invert mb-12 whitespace-pre-wrap">
                {article.content}
            </article>

            {/* Comments Section */}
            <div className="border-t border-zinc-800 pt-8 mt-8">
                <h2 className="text-xl font-bold mb-6">Comments</h2>
                
                {/* Add Comment Input */}
                <div className="flex gap-3 mb-8">
                    <img src="/profile.png" alt="user" className="w-10 h-10 rounded-full" />
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleAddComment()
                                }
                            }}
                            placeholder="Add a comment..."
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={!commentText.trim() || addCommentMutation.isPending}
                            className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={16} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Comments List */}
                <div>
                    {comments && comments.length > 0 ? (
                        comments.map((comment: any) => (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                targetId={article.id}
                                type="article"
                                onCommentAdded={refetchComments}
                            />
                        ))
                    ) : (
                        <div className="py-8 text-center text-zinc-500">
                            <p>No comments yet. Be the first to comment!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}