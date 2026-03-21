"use client"

import { useState } from "react"
import { ArticleCard } from "./ArticleCard"
import { Article } from "@stack/types"

type Props = {
    articles: Article[]
}

const PAGE_SIZE = 10

export function ArticleList({ articles }: Props) {

    const [page, setPage] = useState(1)

    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE

    const paginatedArticles = articles.slice(start, end)

    const totalPages = Math.ceil(articles.length / PAGE_SIZE)

    return (
        <div className="flex flex-col">

            {/* ARTICLES */}
            {paginatedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
            ))}

            {/* PAGINATION */}
            {articles.length > PAGE_SIZE && (
                <div className="flex justify-center gap-4 mt-8">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 rounded-lg bg-zinc-800 disabled:opacity-40"
                    >
                        Prev
                    </button>

                    <span className="text-zinc-400">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 rounded-lg bg-zinc-800 disabled:opacity-40"
                    >
                        Next
                    </button>

                </div>
            )}

        </div>
    )
}
