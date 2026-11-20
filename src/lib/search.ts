import { articles } from "@/src/data/articles";
import { getCategory } from "@/src/config/site";
import { normalizeSearch } from "./normalize-search";

export function searchArticles(query: string, limit = articles.length) {
  const normalized = normalizeSearch(query); if (!normalized) return articles.slice(0, limit);
  return articles.map((article) => {
    const title = normalizeSearch(article.title);
    const haystack = normalizeSearch(`${article.title} ${article.excerpt} ${getCategory(article.category)?.name ?? ""} ${article.subtopic}`);
    return { article, score: title.startsWith(normalized) ? 0 : title.includes(normalized) ? 1 : haystack.includes(normalized) ? 2 : 9 };
  }).filter(({ score }) => score < 9).sort((a, b) => a.score - b.score).slice(0, limit).map(({ article }) => article);
}
