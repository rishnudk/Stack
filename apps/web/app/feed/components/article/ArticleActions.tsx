"use client"

import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react"
import { trpc } from "@/utils/trpc"
import { toast } from "sonner"
import { useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  articleId: string
  likesCount: number
  commentsCount: number
}

export function ArticleActions({ articleId, likesCount, commentsCount }: Props) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likes, setLikes] = useState(likesCount)

  const toggleLike = trpc.articles.toggleLike.useMutation({
    onSuccess: (data) => {
      setIsLiked(data.liked)
      setLikes(prev => data.liked ? prev + 1 : prev - 1)
      toast.success(data.liked ? "Article liked" : "Like removed")
    },
    onError: () => {
      toast.error("Failed to update like")
    }
  })

  const toggleSave = trpc.articles.toggleSave.useMutation({
    onSuccess: (data) => {
      setIsSaved(data.saved)
      toast.success(data.saved ? "Article saved" : "Article removed from bookmarks")
    },
    onError: () => {
      toast.error("Failed to update bookmark")
    }
  })

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard!")
  }

  return (
    <div className="fixed left-[calc(50%+550px)] top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 items-center">
      
      {/* LIKE */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => toggleLike.mutate({ articleId })}
          disabled={toggleLike.isPending}
          className={cn(
            "p-3 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors",
            isLiked && "text-red-500 border-red-500/50 bg-red-500/10"
          )}
        >
          <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
        </button>
        <span className="text-xs text-zinc-400">{likes}</span>
      </div>

      {/* COMMENTS */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => document.getElementById('comment-box')?.scrollIntoView({ behavior: 'smooth' })}
          className="p-3 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-zinc-400"
        >
          <MessageCircle size={24} />
        </button>
        <span className="text-xs text-zinc-400">{commentsCount}</span>
      </div>

      {/* SAVE */}
      <button
        onClick={() => toggleSave.mutate({ articleId })}
        disabled={toggleSave.isPending}
        className={cn(
          "p-3 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors",
          isSaved ? "text-blue-500 border-blue-500/50 bg-blue-500/10" : "text-zinc-400"
        )}
      >
        <Bookmark size={24} fill={isSaved ? "currentColor" : "none"} />
      </button>

      {/* SHARE */}
      <button
        onClick={handleShare}
        className="p-3 rounded-full border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-zinc-400"
      >
        <Share2 size={24} />
      </button>

    </div>
  )
}
