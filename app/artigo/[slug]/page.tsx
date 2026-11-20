import { notFound } from "next/navigation";
import { PageShell } from "@/components/site-shell";
import { articles, getArticle } from "@/src/data/articles";
import { getCategory } from "@/src/config/site";
import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { YoutubePreview } from "@/components/youtube-preview";
import { ShareButton } from "@/components/share-button";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://contabemorganizada.com";
const videoIdFrom = (url: string) => new URL(url).searchParams.get("v");

async function getVideoMeta(url?: string) {
  if (!url) return null;
  try { const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, { next: { revalidate: 86400 } }); return response.ok ? await response.json() as { title: string } : null; } catch { return null; }
}

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = getArticle((await params).slug); if (!article) return {};
  const canonical = `${siteUrl}/artigo/${article.slug}`;
  return { title: article.title, description: article.excerpt, alternates: { canonical }, openGraph: { title: article.title, description: article.excerpt, url: canonical, type: "article", images: [{ url: article.image.src, alt: article.image.alt }] } };
}
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug); if (!article) notFound();
  const index = articles.indexOf(article); const previous = articles[index - 1]; const next = articles[index + 1];
  const related = articles.filter((item) => item.category === article.category && item.slug !== article.slug).slice(0, 3);
  const videoMeta = await getVideoMeta(article.youtubeUrl); const videoId = article.youtubeUrl ? videoIdFrom(article.youtubeUrl) : null;
  const canonical = `${siteUrl}/artigo/${article.slug}`;
  return <PageShell><article className="article-page shell"><header><span className="category-chip">{getCategory(article.category)?.name} · {article.subtopic}</span><h1>{article.title}</h1><p className="dek">{article.excerpt}</p><div className="card-meta"><time>{article.date}</time><span>{article.readTime} de leitura</span></div></header><div className="article-hero"><ImageWithFallback src={article.image.src} alt={article.image.alt} fill priority sizes="(max-width: 900px) 100vw, 900px" /></div><div className="prose">{article.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{videoMeta && videoId && <YoutubePreview videoId={videoId} title={videoMeta.title} />}<aside>Conteúdo informativo. Não substitui um contador.</aside></div><ShareButton url={canonical} title={article.title} /></article><section className="shell related"><span className="kicker">Continue lendo</span><h2>Artigos relacionados</h2><div className="article-grid">{related.map((item) => <ArticleCard key={item.slug} article={item} />)}</div><nav className="article-pagination" aria-label="Navegação entre artigos">{previous ? <Link href={`/artigo/${previous.slug}`}><small>Anterior</small>{previous.title}</Link> : <span />}{next && <Link href={`/artigo/${next.slug}`}><small>Próximo</small>{next.title}</Link>}</nav></section></PageShell>;
}
