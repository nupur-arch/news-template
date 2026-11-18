"use client";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
export function ArticleProgress() {
  const { scrollYProgress } = useScroll();
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) =>
    setPercent(Math.round(value * 100)),
  );
  return (
    <div
      className="reading-progress"
      role="progressbar"
      aria-label="Article reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <motion.div style={{ scaleX: scrollYProgress }} />
    </div>
  );
}
