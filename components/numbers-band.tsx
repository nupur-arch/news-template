"use client";
import { SectionHeading } from "./editorial-motion";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import type { Article, Category, Banner } from "@/lib/types";
import { useMotionPreference } from "./motion-preference";
function Count({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useMotionPreference();
  useEffect(() => {
    if (!visible || !ref.current) return;
    if (reduced) {
      ref.current.textContent = String(value).padStart(2, "0");
      return;
    }
    const control = animate(0, value, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (current) => {
        if (ref.current)
          ref.current.textContent = String(Math.round(current)).padStart(
            2,
            "0",
          );
      },
    });
    return () => control.stop();
  }, [visible, reduced, value]);
  return (
    <div className="edition-stat">
      <span className="sr-only">
        {value} {label}
      </span>
      <strong ref={ref} aria-hidden="true">
        {String(value).padStart(2, "0")}
      </strong>
      <span className="eyebrow" aria-hidden="true">
        {label}
      </span>
    </div>
  );
}
export function NumbersBand({
  articles,
  categories,
  banners,
}: {
  articles: Article[];
  categories: Category[];
  banners: Banner[];
}) {
  const populated = categories.filter((c) =>
    articles.some((a) => a.category.id === c.id),
  );
  return (
    <section id="perspectives" className="numbers-band">
      <div className="numbers-intro">
        <SectionHeading
          number={String(categories.length + 3).padStart(2, "0")}
          label="This edition, in perspective"
          title="Many points of view. One shared world."
        />
        {banners.slice(0, 1).map((b) => (
          <a key={b.id} href={b.href} className="eyebrow">
            {b.text} ↗
          </a>
        ))}
      </div>
      <div className="edition-stats">
        <Count value={articles.length} label="Stories to explore" />
        <Count value={populated.length} label="Editorial desks" />
        <Count
          value={new Set(articles.map((a) => a.author)).size}
          label="Distinct voices"
        />
        <Count
          value={new Set(articles.map((a) => a.location)).size}
          label="Places in focus"
        />
      </div>
    </section>
  );
}
