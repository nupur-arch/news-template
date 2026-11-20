"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Article } from "@/src/data/articles";
import { getCategory } from "@/src/config/site";
import { ImageWithFallback } from "./image-with-fallback";

export function ArticleBanner({ articles }: { articles: Article[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const goTo = useCallback((index: number) => {
    const next = (index + articles.length) % articles.length;
    track.current?.children[next]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActive(next);
  }, [articles.length]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => goTo(active + 1), 6000);
    return () => window.clearInterval(timer);
  }, [active, goTo, paused]);

  return (
    <section className="banner" aria-label="Destaques" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)} onKeyDown={(event) => { if (event.key === "ArrowRight") goTo(active + 1); if (event.key === "ArrowLeft") goTo(active - 1); }} tabIndex={0}>
      <div ref={track} className="banner-track" onScroll={(event) => { const node = event.currentTarget; setActive(Math.round(node.scrollLeft / node.clientWidth)); }}>
        {articles.map((article) => (
          <Link key={article.slug} href={`/artigo/${article.slug}`} className="banner-slide">
            <ImageWithFallback src={article.image.src} alt={article.image.alt} fill priority={article === articles[0]} sizes="100vw" />
            <span className="banner-shade" />
            <span className="banner-copy"><span className="banner-category">{getCategory(article.category)?.name}</span><strong>{article.title}</strong><span>{article.excerpt}</span><b>Ler artigo</b></span>
          </Link>
        ))}
      </div>
      <button className="banner-arrow banner-arrow--prev" onClick={() => goTo(active - 1)} aria-label="Artigo anterior">‹</button>
      <button className="banner-arrow banner-arrow--next" onClick={() => goTo(active + 1)} aria-label="Próximo artigo">›</button>
      <div className="banner-thumbs" aria-label="Selecionar destaque">
        {articles.map((article, index) => <button key={article.slug} className={index === active ? "is-active" : ""} onClick={() => goTo(index)} aria-label={`Mostrar: ${article.title}`}><ImageWithFallback src={article.image.src} alt="" fill sizes="72px" /><span className="thumb-progress" style={{ animationPlayState: paused ? "paused" : "running" }} /></button>)}
      </div>
    </section>
  );
}
