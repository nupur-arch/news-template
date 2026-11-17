import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/header";
import { Hero, EditionIntro } from "@/components/hero";
import { siteConfig } from "@/content/site.config";
import { getArticles, getBanners } from "@/services/news";
import { formatDate } from "@/lib/format";
export default async function Home() {
  const [articles, banners] = await Promise.all([getArticles(), getBanners()]);
  return (
    <>
      <Header articles={articles} />
      <main id="main">
        <Hero
          articles={articles.filter((a) => a.featured)}
          categories={siteConfig.categories}
        />
        <EditionIntro />
        <section id="latest" className="latest-section">
          <div className="section-heading">
            <span className="eyebrow">01 / The news desk</span>
            <h2>
              The world doesn’t stand still.
              <br />
              <span>Neither do we.</span>
            </h2>
            <span className="eyebrow">YOUR NEXT PERSPECTIVE ↓</span>
          </div>
          {siteConfig.categories.map((c) => (
            <div className="category-section" id={c.id} key={c.id}>
              <div className="category-heading">
                <span className="eyebrow">{c.number}</span>
                <h3>{c.name}</h3>
                <ArrowUpRight size={24} />
              </div>
              <div className="story-list">
                {articles
                  .filter((a) => a.category.id === c.id)
                  .map((a) => (
                    <Link href={`/articles/${a.slug}`} key={a.id}>
                      <time className="eyebrow" dateTime={a.publishedAt}>
                        {formatDate(a.publishedAt)}
                      </time>
                      <h4>{a.title.replace(/\n/g, " ")}</h4>
                      <span>{a.author}</span>
                      <ArrowUpRight size={18} />
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </section>
        <section id="perspectives" className="perspectives">
          <span className="eyebrow">Independent by perspective</span>
          <h2>
            A little curiosity.
            <br />A wider world.
          </h2>
          <p>
            We look beyond the headline, bringing together stories about the
            people, ideas, and places moving our world forward.
          </p>
          {banners.map((b) => (
            <Link key={b.id} href={b.href}>
              {b.label} — {b.text}
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </section>
      </main>
      <footer>
        <Link href="/" className="wordmark">
          the daily standard<span className="brand-period">.</span>
        </Link>
        <span className="eyebrow">© 2026 THE DAILY STANDARD</span>
        <span className="eyebrow">AN INDEPENDENT PERSPECTIVE.</span>
      </footer>
    </>
  );
}
