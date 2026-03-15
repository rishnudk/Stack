"use client"

import Image from "next/image"
import ArticleActions from "../../feed/components/feedbox/ArticleActions"
import ArticleCommentBox from "../../feed/components/feedbox/ArticleCommentBox"
import { useParams } from "next/navigation"
import { trpc } from "@/utils/trpc"
import { Loader2, MessageSquare } from "lucide-react"

export default function ArticlePage() {
  const { slug } = useParams()
  const { data: article, isLoading, error } = trpc.articles.getArticleBySlug.useQuery({ 
    slug: slug as string 
  })

  // Fetch comments
  const { data: comments, isLoading: isLoadingComments } = trpc.articles.getComments.useQuery(
    { articleId: article?.id as string },
    { enabled: !!article?.id }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold text-white">Article not found</h1>
        <p className="text-zinc-400">{error?.message || "Something went wrong"}</p>
      </div>
    )
  }

  return (
    <div className="relative">

      {/* ACTION BUTTONS */}
      <ArticleActions 
        articleId={article.id} 
        likesCount={article.likes} 
        commentsCount={article.comments} 
      />

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* AUTHOR */}
        <div className="flex flex-col items-center gap-3 text-center">

          <Image
            src={article.authorImage}
            alt="author"
            width={60}
            height={60}
            className="rounded-full aspect-square object-cover"
          />

          <div className="font-semibold text-white">
            {article.author}
          </div>

          <div className="text-sm text-zinc-400">
            {article.date}
          </div>

        </div>

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-center mt-6">
          {article.title}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-zinc-400 text-center mt-4 text-lg">
          {article.description}
        </p>

        {/* HERO IMAGE */}
        <div className="mt-10 rounded-xl overflow-hidden">
          <Image
            src={article.thumbnail}
            alt="article"
            width={900}
            height={500}
            className="w-full object-cover"
          />
        </div>

        {/* ARTICLE CONTENT */}
        <div className="prose prose-invert mt-10 max-w-none">
          <div 
            className="text-zinc-300 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />
        </div>

        <div className="mt-16 border-t border-zinc-800 pt-10">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <MessageSquare size={20} />
            Comments ({article.comments})
          </h3>

          {/* COMMENT BOX */}
          <ArticleCommentBox articleId={article.id} />

          {/* COMMENTS LIST */}
          <div className="mt-10 space-y-8">
            {isLoadingComments ? (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
              </div>
            ) : comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Image
                    src={comment.user.image || "/avatar.jpg"}
                    alt={comment.user.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full h-10 w-10 aspect-square object-cover"
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">
                        {comment.user.name}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-zinc-500 italic py-10">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}