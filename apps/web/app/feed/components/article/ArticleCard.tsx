"use client"

import Link from "next/link"
import Image from "next/image"
import { MessageCircle, Heart, Bookmark } from "lucide-react"
import { Article } from "@stack/types"

type Props = {
  article: Article
}

export function ArticleCard({ article }: Props) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-zinc-800 py-6 px-6">

      {/* LEFT */}
      <div className="flex flex-col gap-3 flex-1">

        {/* AUTHOR */}
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <Image
            src={article.image!}
            alt="author"
            width={32}
            height={32}
            className="rounded-full"
          />

          <span className="font-medium text-zinc-200">
            {article.author}
          </span>

          <span>on {article.date}</span>
        </div>

        {/* TITLE */}
        <Link href={`/article/${article.slug}`}>
          <h2 className="text-lg font-semibold text-white hover:text-zinc-300 hover:underline cursor-pointer">
            {article.title}
          </h2>
        </Link>

        {/* META */}
        <div className="flex items-center gap-6 text-sm text-zinc-400">

          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            {article.comments}
          </div>

          <div className="flex items-center gap-1">
            <Heart size={16} />
            {article.likes}
          </div>

          <Bookmark size={16} />

          {/* TAGS */}
          <div className="flex gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-zinc-800 px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* RIGHT IMAGE */}
      <Link href={`/article/${article.slug}`}>
        <div className="w-[110px] h-[70px] relative rounded-md overflow-hidden shrink-0">
          <Image
            src={article.thumbnail}
            alt="post"
            fill
            className="object-cover"
          />
        </div>
      </Link>

    </div>
  )
}