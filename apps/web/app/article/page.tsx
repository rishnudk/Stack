"use client"

import { trpc } from "@/utils/trpc"
import { ArticleList } from "../feed/components/feedbox/ArticleList"
import { Loader2, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ArticleListingPage() {
  const router = useRouter()
  const { data: articles, isLoading, error } = trpc.articles.getArticles.useQuery({
    limit: 50
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/feed')}
              className="p-2 hover:bg-neutral-900 rounded-full transition-colors text-neutral-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold">Articles</h1>
          </div>
        </div>

        {/* ARTICLES */}
        {error ? (
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800">
            <p className="text-red-400 font-medium">Failed to load articles</p>
            <p className="text-neutral-500 text-sm mt-1">{error.message}</p>
          </div>
        ) : articles?.articles && articles.articles.length > 0 ? (
          <div className="bg-neutral-900/30 rounded-2xl border border-neutral-800 overflow-hidden px-4">
            <ArticleList articles={articles.articles} />
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800">
            <p className="text-neutral-400 font-medium">No articles yet</p>
            <p className="text-neutral-500 text-sm mt-1">Be the first one to share your knowledge!</p>
            <Link href="/article/create">
                <button className="mt-6 text-blue-500 hover:underline">Start writing →</button>
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
