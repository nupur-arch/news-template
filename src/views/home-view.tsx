import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { PageShell } from "@/components/site-shell";
import { articles } from "@/src/data/articles";
import { siteConfig } from "@/src/config/site";
import { ArticleBanner } from "@/components/article-banner";

export default function HomeView() {
  return <PageShell>
    <ArticleBanner articles={articles} />
    <section className="shell section"><div className="section-heading"><div><span className="kicker">Mais recentes</span><h2>Informação para colocar em prática</h2></div><Link href="/busca">Ver todas as publicações</Link></div><div className="article-grid">{articles.slice(0, 6).map((article) => <ArticleCard key={article.slug} article={article} />)}</div></section>
    {siteConfig.categories.map((category) => <section className="shell category-row" key={category.slug}><div className="section-heading"><div><span className="kicker">{category.topics.join(" · ")}</span><h2>{category.name}</h2></div><Link href={`/categoria/${category.slug}`}>Ver categoria</Link></div><div className="article-grid article-grid--four">{articles.filter((article) => article.category === category.slug).map((article) => <ArticleCard key={article.slug} article={article} />)}</div></section>)}
    <section className="editor-picks"><div className="shell section"><div className="section-heading"><div><span className="kicker">Seleção editorial</span><h2>Para guardar e consultar</h2></div></div><div className="article-grid">{articles.filter((article) => article.editorPick).slice(0, 3).map((article) => <ArticleCard key={article.slug} article={article} />)}</div></div></section>
    <section className="shell newsletter-demo"><span className="demo-label">Demonstração</span><div><span className="kicker">Newsletter</span><h2>Uma leitura organizada na sua caixa de entrada.</h2><p>Prévia visual do boletim semanal. O cadastro será ativado em uma próxima etapa.</p></div><form><label htmlFor="demo-email">Seu e-mail</label><div><input id="demo-email" type="email" placeholder="voce@exemplo.com" disabled /><button type="button" disabled>Quero receber</button></div></form></section>
  </PageShell>;
}
