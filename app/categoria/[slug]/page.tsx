import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/site-shell";
import { articles } from "@/src/data/articles";
import { getCategory, siteConfig } from "@/src/config/site";

export function generateStaticParams() { return siteConfig.categories.map(({ slug }) => ({ slug })); }
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const category = getCategory(slug); if (!category) notFound();
  const categoryArticles = articles.filter((article) => article.category === slug);
  return <PageShell><section className="page-head shell"><span className="kicker">Categoria</span><h1>{category.name}</h1><p>Conteúdos sobre {category.topics.join(" e ")}.</p><div className="chips">{category.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></section><section className="shell section"><div className="article-grid">{categoryArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>{!categoryArticles.length && <p className="empty-state">Novos conteúdos serão publicados em breve.</p>}</section></PageShell>;
}
