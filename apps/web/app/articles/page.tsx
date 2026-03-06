import { Article } from "@stack/types"
import ArticleCard from "./[slug]/components/ArticleCard"

const articles: Article[] = [
  {
    slug: "blockchain-bank-stops-working",
    author: "MD Ayaan Siddiqui",
    date: "Mar 06, 2026",
    title: "Blockchain Isn't Important, Until Your Bank Stops Working",
    description:
      "Why blockchain suddenly matters when traditional finance breaks...",
    tags: ["Web3", "Crypto", "Blockchain"],
    image: "/articles/blockchain.png",
  },
  {
    slug: "third-era-ai-development",
    author: "Shikhil Saxena",
    date: "Mar 06, 2026",
    title: "The third era of AI software development",
    description: "How AI tools are reshaping development workflows.",
    tags: ["AI", "Software"],
  },
]

export default function ArticlesPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">

      <h1 className="text-2xl font-bold mb-6">
        Articles
      </h1>

      <div className="flex flex-col gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  )
}