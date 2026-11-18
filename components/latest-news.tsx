import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { Reveal, SectionHeading, StoryImage } from "./editorial-motion";
export function LatestNews({ articles }: { articles: Article[] }) {
  // Round-robin categories keep the news desk varied when an API groups its feed.
  const groups = Array.from(new Set(articles.map((a) => a.category.id)));
  const latest = [...articles].sort(
    (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
  );
  const selected: Article[] = [];
  for (let row = 0; selected.length < 5 && row < latest.length; row++)
    for (const id of groups) {
      const article = latest.filter((a) => a.category.id === id)[row];
      if (article && selected.length < 5) selected.push(article);
    }
  return (
    <section id="latest" className="news-desk page-section">
      <SectionHeading
        number="01"
        label="The latest"
        title="The world moves. Stay curious."
        note="Fresh perspectives, beyond the headline."
      />
      {!selected.length ? (
        <p className="section-empty">
          The news desk is preparing the next edition.
        </p>
      ) : (
        <div className="latest-grid">
          {selected.map((article, index) => (
            <Reveal
              key={article.id}
              index={index}
              className={index === 0 ? "latest-lead" : "latest-small"}
            >
              <article className="desk-story">
                <Link href={`/articles/${article.slug}`} className="story-link">
                  <StoryImage
                    src={article.image}
                    alt={article.imageAlt}
                    sizes={
                      index === 0
                        ? "(max-width: 768px) 90vw, 48vw"
                        : "(max-width: 768px) 45vw, 24vw"
                    }
                  />
                  <div className="story-caption">
                    <span className="eyebrow">
                      {article.category.name}
                      <span className="caption-divider">/</span>
                      <time dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt)}
                      </time>
                    </span>
                    <h3>{article.title.replace(/\n/g, " ")}</h3>
                    {index === 0 && <p>{article.summary}</p>}
                    <span className="story-byline">{article.author}</span>
                    <span className="story-arrow" aria-hidden="true">
                      <ArrowUpRight size={19} />
                    </span>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
