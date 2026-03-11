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

export function ArticleCard({ article }: Props) {
    const { data: session } = useSession()
    const [isLiked, setIsLiked] = useState(false) // You can enhance this by checking if the user already liked it from the DB
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
            href={`/article/${article.slug}`}
            className="flex justify-between gap-4 p-4 border-b border-neutral-800 hover:bg-neutral-900/50 transition-colors bg-black"
        >
            <div className="flex flex-col gap-2 w-full">

                {/* author */}
                <p className="text-sm text-neutral-400">
                    {article.author} on {new Date(article.date || Date.now()).toLocaleDateString()}
                </p>

                {/* title */}
                <h2 className="text-lg font-bold text-white leading-tight">
                    {article.title}
                </h2>

                {/* description */}
                <p className="text-sm text-neutral-300 line-clamp-2">
                    {article.description}
                </p>

                {/* tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-xs text-blue-400 mt-1">
                        {article.tags.map((tag) => (
                            <span key={tag}>#{tag}</span>
                        ))}
                    </div>
                )}

                {/* stats */}
                <div className="flex gap-6 text-neutral-500 text-sm mt-3 pt-2 border-t border-neutral-800/50">
                    <span className="flex items-center gap-1.5 group hover:text-blue-500 transition-colors">
                        <MessageCircle size={16} /> {article.comments || 0}
                    </span>

                    <button 
                        onClick={handleLike}
                        className={`flex items-center gap-1.5 group hover:text-red-500 transition-colors ${isLiked ? "text-red-500" : ""}`}
                        title="Like article"
                    >
                        <Heart 
                            size={16} 
                            className={`transition-all ${isLiked ? "fill-red-500" : ""}`}
                        /> 
                        <span>{likeCount}</span>
                    </button>

                    <button 
                        onClick={handleBookmark}
                        className={`flex items-center gap-1.5 group hover:text-blue-500 transition-colors ${isSaved ? "text-blue-500" : ""}`}
                        title="Save article"
                    >
                        <Bookmark 
                            size={16} 
                            className={`transition-all ${isSaved ? "fill-blue-500" : ""}`}
                        />
                    </button>
                </div>
            </div>

            {/* image */}
            {article.image && (
                <div className="shrink-0 mt-6">
                    <Image
                        src={article.image}
                        alt={article.title}
                        width={120}
                        height={120}
                        className="rounded-xl object-cover h-[120px] w-[120px] border border-neutral-800"
                    />
                </div>
            )}
        </Link>
    )
}
