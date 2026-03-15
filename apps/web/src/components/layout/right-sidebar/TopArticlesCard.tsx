"use client"
import Image from "next/image"
import Link from "next/link"
import { trpc } from "@/utils/trpc"

export function TopArticlesCard() {
  const { data: articles = [], isLoading } = trpc.articles.getTopArticles.useQuery()

  if (isLoading) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 animate-pulse">
        <div className="h-4 w-32 bg-zinc-800 rounded mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-24 w-full bg-zinc-800 rounded-lg" />
              <div className="h-3 w-full bg-zinc-800 rounded" />
              <div className="h-2 w-2/3 bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (articles.length === 0) return null

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
      <h2 className="text-sm font-semibold text-white mb-3">
        Top Articles
      </h2>

      <div className="flex flex-col gap-4">
        {articles.map((article) => (
          <Link 
            key={article.id} 
            href={`/article/${article.slug}`}
            className="group flex flex-col gap-2 hover:opacity-80 transition-opacity"
          >
            {article.thumbnail && (
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-zinc-800">
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="flex flex-col">
              <h3 className="text-xs font-medium text-white line-clamp-2 group-hover:text-green-500 transition-colors">
                {article.title}
              </h3>
              <p className="text-[10px] text-zinc-500 mt-1">
                By {article.authorName} · {article.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
