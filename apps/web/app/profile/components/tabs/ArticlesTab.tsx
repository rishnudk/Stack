"use client";

import { useState } from "react";
import { Article } from "@stack/types";
import { ArticleCard } from "./ArticleCard";

type Props = {
  articles: Article[];
};

export function ArticlesList({ articles }: Props) {
  const [visibleCount, setVisibleCount] = useState(4);

  const visibleArticles = articles.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="w-full">

      {visibleArticles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}

      {visibleCount < articles.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleShowMore}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition"
          >
            Show More
          </button>
        </div>
      )}

    </div>
  );
}
