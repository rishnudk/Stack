"use client"

import Image from "next/image"
import Link from "next/link"
import { MessageCircle, Heart, Bookmark } from "lucide-react"
import { Article } from "@stack/types"
import { trpc } from "@/utils/trpc"
import { useState } from "react"
import { useSession } from "next-auth/react"

interface Props {
    article: Article
}

export default function ArticleCard({ article }: Props) {
    const { data: session } = useSession()
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setLikeCount] = useState(article.likes || 0)
    const [isSaved, setIsSaved] = useState(false)

    const toggleLikeMutation = trpc.articles.toggleLike.useMutation()
    const toggleSaveMutation = trpc.articles.toggleSave.useMutation()

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!session) return

        setIsLiked(!isLiked)
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
        
        toggleLikeMutation.mutate({ articleId: article.id })
    }

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!session) return
        
        setIsSaved(!isSaved)
        toggleSaveMutation.mutate({ articleId: article.id })
    }

    return (
        <Link
            href={`/feed/components/articles/${article.slug}`}
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
                <div className="flex gap-6 text-zinc-500 text-sm mt-2">
                    <span className="flex items-center gap-1 group">
                        <MessageCircle size={16} className="group-hover:text-blue-500 transition-colors" /> {article.comments || 0}
                    </span>

                    <button 
                        onClick={handleLike}
                        className="flex items-center gap-1 group hover:text-red-500 transition-colors"
                        title="Like article"
                    >
                        <Heart 
                            size={16} 
                            className={`transition-all ${isLiked ? "fill-red-500 text-red-500" : "group-hover:text-red-500"}`}
                        /> 
                        <span className={isLiked ? "text-red-500" : ""}>{likeCount}</span>
                    </button>

                    <button 
                        onClick={handleBookmark}
                        className="flex items-center gap-1 group hover:text-blue-500 transition-colors"
                        title="Save article"
                    >
                        <Bookmark 
                            size={16} 
                            className={`transition-all ${isSaved ? "fill-blue-500 text-blue-500" : "group-hover:text-blue-500"}`}
                        />
                    </button>
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