"use client"

import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Heart, Bookmark } from "lucide-react"
import { Article } from "@stack/types"

interface Props {
    article: Article
}

export default function ArticleCard({ article }: Props) {
    return (
        <Link
            href={`/articles/${article.slug}`}
            className="flex justify-between gap-4 p-4 rounded-xl hover:bg-zinc-900 transition"
        >
            <div className="flex flex-col gap-2">

                {/* author */}
                <p className="text-sm text-zinc-400">
                    {article.author} on {article.date}
                </p>

                {/* title */}
                <h2 className="text-lg font-semibold">
                    {article.title}
                </h2>

                {/* description */}
                <p className="text-sm text-zinc-400 line-clamp-2">
                    {article.description}
                </p>

                {/* tags */}
                <div className="flex gap-2 text-xs text-zinc-500">
                    {article.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                    ))}
                </div>

                {/* stats */}
                <div className="flex gap-4 text-zinc-500 text-sm mt-2">
                    <span className="flex items-center gap-1">
                        <MessageCircle size={14} /> 0
                    </span>

                    <span className="flex items-center gap-1">
                        <Heart size={14} /> 0
                    </span>

                    <span className="flex items-center gap-1">
                        <Bookmark size={14} /> 0
                    </span>
                </div>
            </div>

            {/* image */}
            {article.image && (
                <Image
                    src={article.image}
                    alt={article.title}
                    width={140}
                    height={80}
                    className="rounded-lg object-cover"
                />
            )}
        </Link>
    )
}