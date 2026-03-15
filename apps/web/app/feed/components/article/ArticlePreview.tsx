"use client"

import Image from "next/image"
import { Tag } from "lucide-react"

interface ArticlePreviewProps {
    title: string
    description: string
    content: string
    tags: string[]
    coverImage: string | null
    authorName: string
}

export function ArticlePreview({
    title,
    description,
    content,
    tags,
    coverImage,
    authorName,
}: ArticlePreviewProps) {
    return (
        <div className="w-full max-w-4xl mx-auto bg-black text-white p-6 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Cover Image */}
            {coverImage ? (
                <div className="relative w-full h-[250px] mb-8 rounded-xl overflow-hidden group">
                    <Image
                        src={coverImage}
                        alt="Cover"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                </div>
            ) : (
                <div className="w-full h-32 bg-neutral-900/50 rounded-xl mb-8 border border-neutral-800 border-dashed flex items-center justify-center text-neutral-500 italic">
                    No cover image selected
                </div>
            )}

            {/* Header */}
            <div className="space-y-4 mb-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                    {title || <span className="text-neutral-700 italic">Untitled Article</span>}
                </h1>
                
                <p className="text-xl text-neutral-400 font-medium leading-relaxed">
                    {description || <span className="text-neutral-800 italic">No description provided yet...</span>}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-neutral-800/50">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white uppercase shadow-lg shadow-blue-900/20">
                            {authorName.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-neutral-200">{authorName}</span>
                            <span className="text-xs text-neutral-500">Author • Preview Mode</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-blue max-w-none">
                {content ? (
                    <div 
                        className="text-neutral-300 leading-relaxed text-lg space-y-6"
                        dangerouslySetInnerHTML={{ __html: content }} 
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-600 border border-neutral-900 rounded-xl bg-neutral-950/20">
                        <p className="italic">The article content will be rendered here...</p>
                        <p className="text-sm mt-2">Start writing in the editor to see your work come to life.</p>
                    </div>
                )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <div className="mt-16 pt-8 border-t border-neutral-800 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span 
                            key={tag} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-sm text-neutral-400 hover:text-blue-400 hover:border-blue-900/50 hover:bg-blue-950/20 transition-all duration-300"
                        >
                            <Tag size={12} />
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}
