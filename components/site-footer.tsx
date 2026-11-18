"use client";
import Link from "next/link";
import { ArrowUpRight, ArrowUp } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Category } from "@/lib/types";
import { useMotionPreference } from "./motion-preference";
export function SiteFooter({ categories }: { categories: Category[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useMotionPreference();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["28%", "0%"]);
  return (
    <footer ref={ref} className="site-footer">
      <div className="footer-top">
        <p>
          Independent minds.
          <br />
          <span>A shared world.</span>
        </p>
        <nav aria-label="Footer navigation">
          {categories.map((c) => (
            <Link key={c.id} href={`/#${c.id}`}>
              {c.name}
              <ArrowUpRight size={13} />
            </Link>
          ))}
          <Link href="/#newsletter">
            The newsletter
            <ArrowUpRight size={13} />
          </Link>
        </nav>
        <a className="back-to-top" href="#main">
          Back to top
          <ArrowUp size={16} />
        </a>
      </div>
      <Link
        href="/"
        className="footer-wordmark"
        aria-label="The Daily Standard, home"
      >
        <motion.span style={{ y: reduced ? 0 : y }}>
          the daily
          <br />
          <span>
            standard<span className="brand-period">.</span>
          </span>
        </motion.span>
      </Link>
      <div className="footer-bottom">
        <span className="eyebrow">© 2026 THE DAILY STANDARD</span>
        <span className="eyebrow">A WIDER VIEW OF THE WORLD.</span>
        <span className="eyebrow">INDEPENDENT BY PERSPECTIVE.</span>
      </div>
    </footer>
  );
}
