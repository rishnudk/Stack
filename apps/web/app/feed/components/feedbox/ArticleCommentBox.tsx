"use client"

import Image from "next/image"
import { useState } from "react"

type Props = {
  userImage: string
}

export default function CommentBox({ userImage }: Props) {
  const [comment, setComment] = useState("")

  const handleSubmit = () => {
    if (!comment.trim()) return
    console.log(comment)
    setComment("")
  }

  return (
    <div className="flex items-start gap-4 mt-10">

      {/* USER AVATAR */}
      <Image
        src={userImage}
        alt="user"
        width={40}
        height={40}
        className="rounded-full"
      />

      {/* COMMENT INPUT */}
      <div className="flex flex-col gap-3 flex-1">

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-sm focus:outline-none"
          rows={3}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium"
          >
            Post Comment
          </button>
        </div>

      </div>
    </div>
  )
}