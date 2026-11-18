"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import type { Article, Category } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { SectionHeading, StoryImage } from "./editorial-motion";
import { useMotionPreference } from "./motion-preference";
function CategoryStrip({
  category,
  articles,
  index,
}: {
  category: Category;
  articles: Article[];
  index: number;
}) {
  const rail = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const [dragging, setDragging] = useState(false);
  const gesture = useRef<{
    id: number;
    x: number;
    y: number;
    scroll: number;
    dragged: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const finish = (event: React.PointerEvent<HTMLDivElement>) => {
    if (gesture.current?.id !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    gesture.current = null;
    setDragging(false);
  };
  const scroll = (direction: number) =>
    rail.current?.scrollBy({
      left: direction * rail.current.clientWidth * 0.8,
      behavior: reduced ? "instant" : "smooth",
    });
  return (
    <section id={category.id} className="category-strip">
      <div className="strip-heading">
        <SectionHeading
          number={String(index + 3).padStart(2, "0")}
          label="Explore the desk"
          title={category.name}
        />
        <div className="strip-controls">
          <span className="eyebrow">
            {String(articles.length).padStart(2, "0")} STORIES / DRAG TO EXPLORE
          </span>
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={`Previous ${category.name} stories`}
          >
            <ArrowLeft size={17} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={`Next ${category.name} stories`}
          >
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
      {articles.length ? (
        <div
          ref={rail}
          className={`category-rail ${dragging ? "is-dragging" : ""}`}
          role="region"
          aria-label={`${category.name} stories, horizontally scrollable`}
          tabIndex={0}
          data-lenis-prevent
          onDragStart={(event) => event.preventDefault()}
          onPointerDown={(event) => {
            suppressClick.current = false;
            if (event.pointerType !== "mouse" || event.button !== 0) return;
            gesture.current = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              scroll: event.currentTarget.scrollLeft,
              dragged: false,
            };
          }}
          onPointerMove={(event) => {
            const state = gesture.current;
            if (!state || state.id !== event.pointerId) return;
            const dx = event.clientX - state.x;
            if (
              !state.dragged &&
              Math.abs(dx) > 6 &&
              Math.abs(dx) > Math.abs(event.clientY - state.y)
            ) {
              state.dragged = true;
              suppressClick.current = true;
              setDragging(true);
              event.currentTarget.setPointerCapture(event.pointerId);
            }
            if (state.dragged) {
              event.preventDefault();
              event.currentTarget.scrollLeft = state.scroll - dx;
            }
          }}
          onPointerUp={finish}
          onPointerCancel={finish}
          onLostPointerCapture={() => {
            gesture.current = null;
            setDragging(false);
          }}
          onClickCapture={(event) => {
            if (suppressClick.current && event.detail !== 0) {
              event.preventDefault();
              event.stopPropagation();
              suppressClick.current = false;
            }
          }}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return;
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              scroll(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
        >
          {articles.map((article, storyIndex) => (
            <article className="strip-story" key={article.id}>
              <Link
                href={`/articles/${article.slug}`}
                className="story-link"
                draggable={false}
              >
                <StoryImage
                  src={article.image}
                  alt={article.imageAlt}
                  sizes="(max-width: 768px) 75vw, 28vw"
                  position={`${35 + storyIndex * 8}% 50%`}
                />
                <div className="strip-story-meta eyebrow">
                  <span>
                    {String(storyIndex + 1).padStart(2, "0")} / {category.name}
                  </span>
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt)}
                  </time>
                </div>
                <h3>{article.title.replace(/\n/g, " ")}</h3>
                <div className="strip-story-bottom">
                  <span>{article.author}</span>
                  <span className="story-arrow" aria-hidden="true">
                    <ArrowUpRight size={17} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="section-empty">
          Stories from this desk are on their way.
        </p>
      )}
    </section>
  );
}
export function CategoryStrips({
  categories,
  articles,
}: {
  categories: Category[];
  articles: Article[];
}) {
  return (
    <div className="category-desks page-section">
      {categories.map((category, index) => (
        <CategoryStrip
          key={category.id}
          category={category}
          articles={articles.filter((a) => a.category.id === category.id)}
          index={index}
        />
      ))}
    </div>
  );
}
