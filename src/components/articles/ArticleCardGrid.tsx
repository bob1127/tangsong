import type { MedusaArticle } from "@lib/blog/types"
import ArticleCard from "./ArticleCard"

type ArticleCardGridProps = {
  articles: MedusaArticle[]
}

export default function ArticleCardGrid({ articles }: ArticleCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
