"use client";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { EditorialImage } from "./editorial-image";
import { SectionHeading } from "./editorial-motion";
import { useMotionPreference } from "./motion-preference";
function Pick({
  article,
  index,
  total,
  progress,
}: {
  article: Article;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduced = useMotionPreference();
  const start = index / Math.max(1, total);
  const end = Math.min(1, (index + 1) / Math.max(1, total));
  const scale = useTransform(
    progress,
    [start, end],
    [1, index === total - 1 ? 1 : 0.94],
  );
  const dim = useTransform(
    progress,
    [start, end],
    [0, index === total - 1 ? 0 : 0.3],
  );
  return (
    <div
      className="pick-pin"
      style={{ top: "calc(var(--header-height) + 12px)" }}
    >
      <motion.article
        className={`pick-card pick-tone-${index % 2}`}
        style={{ scale: reduced ? 1 : scale }}
      >
        <div className="pick-copy">
          <span className="eyebrow">
            THE EDITOR’S PICK <span>/{String(index + 1).padStart(2, "0")}</span>
          </span>
          <span className="pick-category eyebrow">
            {article.category.name} / {article.location}
          </span>
          <h3>{article.title.replace(/\n/g, " ")}</h3>
          <p>{article.summary}</p>
          <div className="pick-bottom">
            <span className="eyebrow">
              {article.author}
              <br />
              {formatDate(article.publishedAt)}
            </span>
            <Link
              href={`/articles/${article.slug}`}
              className="pick-read"
              aria-label={`Read editor’s pick: ${article.title.replace(/\n/g, " ")}`}
            >
              <ArrowUpRight size={25} />
            </Link>
          </div>
        </div>
        <div className="pick-photo">
          <EditorialImage
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="(max-width: 768px) 90vw, 48vw"
          />
          <span className="pick-photo-caption eyebrow">
            A WIDER VIEW / {article.category.number}
          </span>
        </div>
        <motion.div
          className="pick-dim"
          style={{ opacity: reduced ? 0 : dim }}
          aria-hidden="true"
        />
      </motion.article>
    </div>
  );
}
export function EditorsPicks({ articles }: { articles: Article[] }) {
  const picks = articles.filter((a) => a.editorsPick).slice(0, 4);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  return (
    <section id="editors-picks" className="editors-section page-section">
      <SectionHeading
        number="02"
        label="Selected by the editors"
        title="Good stories deserve a little more time."
        note="Pause here. There’s more to the story."
      />
      {picks.length ? (
        <div className="pick-deck" ref={ref}>
          {picks.map((article, index) => (
            <Pick
              key={article.id}
              article={article}
              index={index}
              total={picks.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      ) : (
        <p className="section-empty">
          Our editors are curating their next selection.
        </p>
      )}
    </section>
  );
}
