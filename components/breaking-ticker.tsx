"use client";
import Link from "next/link";
import { Pause, Play, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { Article } from "@/lib/types";
export function BreakingTicker({ articles }: { articles: Article[] }) {
  const [paused, setPaused] = useState(false);
  const stories = articles.slice(0, 4);
  if (!stories.length) return null;
  return (
    <aside
      className={`breaking-ticker ${paused ? "ticker-paused" : ""}`}
      aria-label="Breaking news"
    >
      <span className="ticker-label">
        <span />
        On the wire
      </span>
      <div className="ticker-window">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <div
              className="ticker-copy"
              key={copy}
              aria-hidden={copy === 1}
              inert={copy === 1}
            >
              {stories.map((article) => (
                <Link href={`/articles/${article.slug}`} key={article.id}>
                  <span className="eyebrow">{article.category.name}</span>
                  {article.title.replace(/\n/g, " ")}
                  <ArrowUpRight size={13} />
                  <span className="ticker-separator">✳</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        aria-label={
          paused ? "Resume breaking news ticker" : "Pause breaking news ticker"
        }
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play size={13} /> : <Pause size={13} />}
      </button>
    </aside>
  );
}
