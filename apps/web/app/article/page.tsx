"use client"

import { trpc } from "@/utils/trpc"
import { ArticleList } from "../feed/components/feedbox/ArticleList"
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
    <div className="flex justify-center min-h-screen bg-black">
      <div className="flex w-full max-w-7xl">
        
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-[320px] p-4">
          <LeftSidebar session={session} />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col items-center border-x border-neutral-800">
          <div className="w-full max-w-[700px] min-h-screen px-0">
            
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

                <div className="flex px-6">
                    <button
                        onClick={() => setActiveTab("global")}
                        className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === "global" ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
                    >
                        Explore
                        {activeTab === "global" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-500 rounded-full" />}
                    </button>
                    {session && (
                        <button
                            onClick={() => setActiveTab("my")}
                            className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === "my" ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
                        >
                            My Articles
                            {activeTab === "my" && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-500 rounded-full" />}
                        </button>
                    )}
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
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-[320px] p-3">
          <RightSidebar session={session} />
        </aside>

      </div>
    </div>
  )
}
