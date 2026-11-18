"use client";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useInView,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Globe2,
  Landmark,
  Pause,
  Play,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Article, Category } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { EditorialImage } from "./editorial-image";
const icons = {
  world: Globe2,
  culture: Landmark,
  science: Sparkles,
  sports: Trophy,
};
function CategoryDot({
  category,
  active,
  progress,
  onClick,
  reduced,
}: {
  category: Category;
  active: boolean;
  progress: MotionValue<number>;
  onClick: () => void;
  reduced: boolean;
}) {
  const Icon = icons[category.icon];
  const dash = useTransform(() => 100 - (active ? progress.get() : 0));
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return (
    <motion.button
      className={`category-dot ${active ? "active" : ""}`}
      aria-label={`Show ${category.name} stories`}
      aria-pressed={active}
      onClick={onClick}
      animate={offset}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        setOffset({
          x: (e.clientX - r.left - r.width / 2) * 0.22,
          y: (e.clientY - r.top - r.height / 2) * 0.22,
        });
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      <svg viewBox="0 0 48 48" className="dot-progress" aria-hidden="true">
        <motion.circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          pathLength="100"
          strokeDasharray="100"
          strokeDashoffset={dash}
        />
      </svg>
      <Icon size={18} />
      <span className="dot-tooltip">{category.name}</span>
    </motion.button>
  );
}
export function Hero({
  articles,
  categories,
}: {
  articles: Article[];
  categories: Category[];
}) {
  const groups = categories
    .map((category) => ({
      category,
      articles: articles
        .filter((a) => a.category.id === category.id)
        .slice(0, 5),
    }))
    .filter((g) => g.articles.length);
  const [groupIndex, setGroupIndex] = useState(0),
    [cardIndex, setCardIndex] = useState(0),
    [hovered, setHovered] = useState(false),
    [focused, setFocused] = useState(false),
    [stopped, setStopped] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const inView = useInView(heroRef, { amount: 0.1 });
  const cardsRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [reduced, setReduced] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(media.matches);
      setMotionReady(true);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const elapsed = useRef(0),
    previous = useRef<number | null>(null);
  useEffect(() => {
    const rail =
      cardsRef.current?.querySelector<HTMLElement>(".selected-group");
    if (!rail) return;
    const revealSelectedCard = () => {
      const card = rail.children[cardIndex] as HTMLElement | undefined;
      if (!card || rail.scrollWidth <= rail.clientWidth + 1) return;
      const padding = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
      rail.scrollTo({
        left: cardIndex === 0 ? 0 : card.offsetLeft - padding,
        behavior: "instant",
      });
    };
    revealSelectedCard();
    const observer = new ResizeObserver(revealSelectedCard);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [groupIndex, cardIndex]);
  const activeGroup = groups[groupIndex];
  const active = activeGroup?.articles[cardIndex] ?? activeGroup?.articles[0];
  const paused =
    hovered || focused || stopped || reduced || !motionReady || !inView;
  const selectGroup = (index: number) => {
    setGroupIndex(index);
    setCardIndex(0);
    elapsed.current = 0;
    previous.current = null;
    progress.set(0);
    cardsRef.current
      ?.querySelectorAll<HTMLElement>(".card-group")
      .forEach((rail) => {
        rail.scrollLeft = 0;
      });
  };
  useEffect(() => {
    if (paused || groups.length < 2) {
      previous.current = null;
      return;
    }
    let frame: number;
    const tick = (time: number) => {
      if (document.hidden) {
        previous.current = null;
        frame = requestAnimationFrame(tick);
        return;
      }
      if (previous.current !== null)
        elapsed.current += Math.min(time - previous.current, 100);
      previous.current = time;
      if (elapsed.current >= 8000) {
        elapsed.current = 0;
        setGroupIndex((i) => (i + 1) % groups.length);
        setCardIndex(0);
      }
      progress.set((elapsed.current / 8000) * 100);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, groups.length, progress]);
  if (!active)
    return (
      <section className="state-page">
        <span className="eyebrow">A moment between editions</span>
        <h1>The next story is on its way.</h1>
        <p>Check back soon for a fresh perspective.</p>
      </section>
    );
  const nextArticle = (direction: number) => {
    const next = cardIndex + direction;
    if (next < 0) {
      const g = (groupIndex - 1 + groups.length) % groups.length;
      selectGroup(g);
      setCardIndex(groups[g].articles.length - 1);
    } else if (next >= activeGroup.articles.length)
      selectGroup((groupIndex + 1) % groups.length);
    else {
      setCardIndex(next);
      elapsed.current = 0;
      progress.set(0);
    }
  };
  return (
    <section
      ref={heroRef}
      className="hero"
      aria-label="Featured news"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
    >
      <div className="hero-background" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id}
            className="hero-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.2 : 1.1 }}
          >
            <EditorialImage
              src={active.image}
              alt=""
              fill
              priority={active.id === articles[0]?.id}
              sizes="100vw"
              className={reduced ? "" : "ken-burns"}
            />
          </motion.div>
        </AnimatePresence>
        <div className="hero-shade" />
      </div>
      <div className="hero-top">
        <button
          className="round-button"
          aria-label="Previous story"
          onClick={() => nextArticle(-1)}
        >
          <ArrowLeft size={17} />
        </button>
        <div className="quick-links">
          <a href="#latest">
            The latest <ArrowUpRight size={12} />
          </a>
          <span />
          <a href="#perspectives">
            Our perspective <ArrowUpRight size={12} />
          </a>
        </div>
        <button
          className="round-button"
          aria-label="Next story"
          onClick={() => nextArticle(1)}
        >
          <ArrowRight size={17} />
        </button>
      </div>
      <div
        className="hero-copy"
        data-trending={active.trending !== undefined}
        aria-live={paused ? "polite" : "off"}
        aria-atomic="true"
      >
        {active.trending !== undefined && (
          <div
            className="trending"
            role="img"
            aria-label={`${active.trending} percent trending`}
          >
            <svg viewBox="0 0 110 110" aria-hidden="true">
              <circle
                cx="55"
                cy="55"
                r="48"
                fill="none"
                stroke="#ffffff35"
                strokeWidth="3"
              />
              <motion.circle
                key={active.id}
                cx="55"
                cy="55"
                r="48"
                fill="none"
                stroke="#FFC21A"
                strokeWidth="6"
                strokeLinecap="round"
                pathLength="100"
                strokeDasharray="100"
                initial={{
                  strokeDashoffset: reduced ? 100 - active.trending : 100,
                }}
                animate={{ strokeDashoffset: 100 - active.trending }}
                transition={{ duration: reduced ? 0.2 : 1.4 }}
              />
            </svg>
            <div>
              <strong>
                {active.trending}
                <span>%</span>
              </strong>
              <small>TRENDING NOW</small>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span className="category-chip">
              <span />
              {active.category.name}
              <span className="chip-divider" />
              {active.category.number}
              <span className="chip-context"> / THE BIG PICTURE</span>
            </span>
            <h1>
              {active.title.split("\n").map((line, index) => (
                <span className="headline-mask" key={index}>
                  <motion.span
                    initial={reduced ? { opacity: 0 } : { y: "110%" }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: reduced ? 0.2 : 0.7,
                      delay: reduced ? 0 : index * 0.09,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <p className="story-meta">
              {active.location}
              <span> / </span>
              {formatDate(active.publishedAt)}
              <span> / </span>
              {active.author}
            </p>
            <p className="hero-summary">{active.summary}</p>
            <Link className="read-button" href={`/articles/${active.slug}`}>
              Read the story
              <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
      <div
        ref={cardsRef}
        className="hero-cards"
        aria-label="Stories by category"
      >
        {groups.map((group, index) => (
          <motion.div
            key={group.category.id}
            className={`card-group ${index === groupIndex ? "selected-group" : ""}`}
            aria-hidden={index !== groupIndex}
            inert={index !== groupIndex}
            initial={index === groupIndex ? "visible" : "hidden"}
            animate={index === groupIndex ? "visible" : "hidden"}
            variants={{
              visible: {
                visibility: "visible",
                transition: {
                  staggerChildren: reduced ? 0 : 0.065,
                  delayChildren: reduced ? 0 : 0.3,
                },
              },
              hidden: {
                transition: {
                  staggerChildren: reduced ? 0 : 0.035,
                  staggerDirection: -1,
                },
                transitionEnd: { visibility: "hidden" },
              },
            }}
          >
            {group.articles.map((article, articleIndex) => (
              <motion.article
                className={`news-card card-${articleIndex} ${articleIndex === 0 ? "yellow-card" : ""} ${active.id === article.id ? "featured-card" : ""}`}
                key={article.id}
                variants={{
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      type: reduced ? "tween" : "spring",
                      stiffness: 180,
                      damping: 23,
                    },
                  },
                  hidden: {
                    y: reduced ? 0 : 35,
                    opacity: 0,
                    transition: { duration: 0.18 },
                  },
                }}
                whileHover={reduced ? {} : { y: -9 }}
              >
                <button
                  className="card-select"
                  aria-label={`Feature: ${article.title.replace(/\n/g, " ")}`}
                  aria-pressed={active.id === article.id}
                  onClick={() => {
                    setCardIndex(articleIndex);
                    elapsed.current = 0;
                    progress.set(0);
                  }}
                >
                  <span className="card-category">
                    {article.category.name}
                    <span>{String(articleIndex + 1).padStart(2, "0")}</span>
                  </span>
                  <h2>{article.title.replace(/\n/g, " ")}</h2>
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt)}
                  </time>
                </button>
                <Link
                  className="card-read"
                  href={`/articles/${article.slug}`}
                  aria-label={`Read ${article.title.replace(/\n/g, " ")}`}
                >
                  <ArrowUpRight size={15} />
                </Link>
              </motion.article>
            ))}
          </motion.div>
        ))}
      </div>
      <div className="hero-bottom">
        <div className="author-chip">
          <span className="author-avatar">
            {active.author
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
          <span>
            <small>THE STORY BY</small>
            {active.author}
          </span>
        </div>
        <div className="category-controls" aria-label="Choose a news category">
          {groups.map((g, index) => (
            <CategoryDot
              key={g.category.id}
              category={g.category}
              active={index === groupIndex}
              progress={progress}
              onClick={() => selectGroup(index)}
              reduced={reduced}
            />
          ))}
          <button
            className="autoplay-toggle"
            aria-label={stopped ? "Resume autoplay" : "Pause autoplay"}
            aria-pressed={stopped}
            onClick={() => setStopped((v) => !v)}
          >
            {stopped ? <Play size={12} /> : <Pause size={12} />}
          </button>
        </div>
        <span className="editors-chip">
          <span className="editors-star">✳</span>
          {active.editorsPick ? "The editor’s pick" : "Worth your attention"}
        </span>
      </div>
      <span className="hero-edition">NO. 017 / A WIDER VIEW</span>
    </section>
  );
}
export function EditionIntro() {
  return (
    <div className="edition-intro">
      <span>
        <span className="live-dot" /> THE WORLD, IN PERSPECTIVE
      </span>
      <a href="#latest">
        SCROLL TO EXPLORE <ArrowDown size={12} />
      </a>
      <span>
        17 NOVEMBER 2026 <span className="intro-separator">/</span> TUESDAY
        EDITION
      </span>
    </div>
  );
}
