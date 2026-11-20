import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/site-shell";
import { articles } from "@/src/data/articles";
import { searchArticles } from "@/src/lib/search";
import { siteConfig } from "@/src/config/site";
import Link from "next/link";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; categoria?: string }> }) {
  const params = await searchParams; const q = params.q?.trim() ?? ""; const category = siteConfig.categories.find((item) => item.slug === params.categoria);
  const matches = q ? searchArticles(q) : articles; const results = category ? matches.filter((article) => article.category === category.slug) : matches;
  const searchHref = (slug?: string) => `/busca?${new URLSearchParams({ ...(q ? { q } : {}), ...(slug ? { categoria: slug } : {}) }).toString()}`;
  return <PageShell><section className="page-head shell search-page-head"><span className="kicker">Arquivo editorial</span><h1>Busca</h1><form className="search-form" action="/busca"><label htmlFor="q">O que você quer entender?</label><div><input id="q" name="q" defaultValue={q} placeholder="Ex.: declaração, notas, prazos" /><button type="submit">Buscar</button></div></form></section><section className="shell search-results-section"><div className="filter-chips" aria-label="Filtrar por categoria"><Link className={!category ? "is-active" : ""} href={searchHref()}>Todas</Link>{siteConfig.categories.map((item) => <Link className={category?.slug === item.slug ? "is-active" : ""} key={item.slug} href={searchHref(item.slug)}>{item.name}</Link>)}</div><p className="result-count">{q ? `${results.length} resultado${results.length === 1 ? "" : "s"} para “${q}”${category ? ` em ${category.name}` : ""}` : `${results.length} publicações${category ? ` em ${category.name}` : " recentes"}`}</p><div className="article-grid">{results.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>{!results.length && <div className="empty-state"><strong>Nenhum resultado</strong><p>Tente retirar um filtro ou usar um termo mais amplo.</p></div>}</section></PageShell>;
}
