"use client"

import Image from "next/image"
import {ArticleActions} from "../../feed/components/article/ArticleActions"
import ArticleCommentBox from "../../feed/components/article/ArticleCommentBox"
import { useParams } from "next/navigation"
import { trpc } from "@/utils/trpc"
import { Loader2, MessageSquare } from "lucide-react"
import { Comment } from "../../feed/components/Comment"

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

  const utils = trpc.useUtils()
  const handleCommentAdded = () => {
    utils.articles.getComments.invalidate({ articleId: article?.id as string })
    utils.articles.getArticleBySlug.invalidate({ slug: slug as string })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
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

      <div className="w-full px-6 py-16">

        {/* AUTHOR */}
        <div className="flex flex-col items-center gap-3 text-center">

          <Image
            src={(article as any).authorImage || "/avatar.jpg"}
            alt="author"
            width={10}
            height={10}
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
            width={90}
            height={50}
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
                <Comment
                  key={comment.id}
                  comment={comment}
                  targetId={article.id}
                  type="article"
                  onCommentAdded={handleCommentAdded}
                />
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