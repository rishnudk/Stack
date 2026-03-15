"use client"

import Image from "next/image"
import { useState } from "react"
import { trpc } from "@/utils/trpc"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

type Props = {
  articleId: string
}

export default function ArticleCommentBox({ articleId }: Props) {
  const [comment, setComment] = useState("")
  const { data: session } = useSession()
  const utils = trpc.useUtils()

  const addCommentMutation = trpc.articles.addComment.useMutation({
    onSuccess: () => {
      setComment("")
      toast.success("Comment posted!")
      utils.articles.getComments.invalidate({ articleId })
      utils.articles.getArticleBySlug.invalidate()
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to post comment")
    }
  })

  const handleSubmit = () => {
    if (!comment.trim()) return
    if (!session) {
      toast.error("You must be logged in to comment")
      return
    }
    addCommentMutation.mutate({
      articleId,
      content: comment.trim()
    })
  }

  return (
    <div className="flex items-start gap-4 mt-10" id="comment-box">

      {/* USER AVATAR */}
      <div className="relative w-10 h-10 shrink-0">
        <Image
          src={session?.user?.image || "/user.jpg"}
          alt="user"
          fill
          className="rounded-full object-cover"
        />
      </div>

      {/* COMMENT INPUT */}
      <div className="flex flex-col gap-3 flex-1">

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-sm focus:outline-none text-white placeholder:text-zinc-500"
          rows={3}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={addCommentMutation.isPending}
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
          </button>
        </div>

      </div>
    </div>
  )
}