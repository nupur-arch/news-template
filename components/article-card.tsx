import Link from "next/link";
import type { Article } from "@/src/data/articles";
import { getCategory } from "@/src/config/site";
import { ImageWithFallback } from "./image-with-fallback";

export function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <article className={`article-card fade-up ${large ? "article-card--large" : ""}`}>
      <Link href={`/artigo/${article.slug}`} className="card-image" aria-label={article.title}>
        <ImageWithFallback src={article.image.src} alt={article.image.alt} fill sizes={large ? "(max-width: 900px) 100vw, 45vw" : "(max-width: 600px) 100vw, 33vw"} />
      </Link>
      <div className="card-content">
        <span className="meta">{getCategory(article.category)?.name} · {article.subtopic}</span>
        <h2><Link href={`/artigo/${article.slug}`}>{article.title}</Link></h2>
        <p>{article.excerpt}</p>
        <div className="card-meta"><time>{article.date}</time><span>{article.readTime} de leitura</span></div>
      </div>
    </article>
  );
}
