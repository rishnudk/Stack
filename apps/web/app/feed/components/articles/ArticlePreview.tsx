"use client";

import React from "react";

interface PreviewProps {
    title: string;
    description: string;
    content: string;
    tags: string[];
    coverImage: string | null;
    authorName?: string;
}

export function ArticlePreview({ title, description, content, tags, coverImage, authorName = "You" }: PreviewProps) {
    return (
        <div className="max-w-3xl mx-auto py-10 w-full">
            <h1 className="text-4xl font-bold mb-4">
                {title || "Untitled Article"}
            </h1>

            <p className="text-sm text-zinc-400 mb-8">
                by {authorName} on {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>

            {coverImage && (
                <img 
                    src={coverImage} 
                    alt={title || "Cover"} 
                    className="w-full max-h-[400px] object-cover rounded-xl mb-8 border border-neutral-800" 
                />
            )}

            {description && (
                <div className="mb-8 p-4 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-300 italic">
                    {description}
                </div>
            )}

            <article className="prose prose-invert max-w-none mb-12 whitespace-pre-wrap leading-relaxed outline-none">
                {content || "Your completed article text will appear here..."}
            </article>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-blue-400 mt-8 mb-4">
                    {tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-blue-900/20 border border-blue-900/30 rounded-full">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}
