"use client"

import { trpc } from "@/utils/trpc"
import { ArticleList } from "../feed/components/article/ArticleList"
import { Loader2, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { LeftSidebar } from "@/components/layout/left-sidebar/LeftSidebar"
import { RightSidebar } from "@/components/layout/right-sidebar/RightSidebar"

export default function ArticleListingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<"global" | "my">("global")

  const { data: globalArticles, isLoading: isLoadingGlobal, error: errorGlobal } = trpc.articles.getArticles.useQuery({
    limit: 50
  }, { enabled: activeTab === "global" })

  const { data: myArticles, isLoading: isLoadingMy, error: errorMy } = trpc.articles.getMyArticles.useQuery({
    limit: 50
  }, { enabled: activeTab === "my" && !!session })

  const isLoading = activeTab === "global" ? isLoadingGlobal : isLoadingMy
  const error = activeTab === "global" ? errorGlobal : errorMy
  const articles = activeTab === "global" ? globalArticles : myArticles

  return (
    <div className="w-full">
      {/* Header / Tabs */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-neutral-800">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/feed')}
              className="p-2 hover:bg-neutral-900 rounded-full transition-colors text-neutral-400 hover:text-white"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold text-white">Articles</h1>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pb-20">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-600" />
          </div>
        ) : error ? (
          <div className="text-center py-20 px-6">
            <p className="text-red-400 font-medium">Failed to load articles</p>
            <p className="text-neutral-500 text-sm mt-1">{error.message}</p>
          </div>
        ) : articles?.articles && articles.articles.length > 0 ? (
          <ArticleList articles={articles.articles} />
        ) : (
          <div className="text-center py-20 px-6">
            <p className="text-neutral-400 font-medium">No articles found</p>
            <p className="text-neutral-500 text-sm mt-1">
              {activeTab === "my" ? "You haven't written any articles yet." : "Be the first to share your knowledge!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
