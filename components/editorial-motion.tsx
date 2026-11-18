"use client";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useMotionPreference } from "./motion-preference";
import { EditorialImage } from "./editorial-image";
export function SectionHeading({
  number,
  label,
  title,
  note,
}: {
  number: string;
  label: string;
  title: string;
  note?: string;
}) {
  const reduced = useMotionPreference();
  return (
    <div className="desk-heading">
      <span className="eyebrow">
        <span className="section-number">{number}</span> / {label}
      </span>
      <motion.h2
        aria-label={title}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ staggerChildren: reduced ? 0 : 0.055 }}
      >
        {title.split(" ").map((word, index) => (
          <span
            className="word-mask"
            aria-hidden="true"
            key={`${index}-${word}`}
          >
            <motion.span
              variants={{
                hidden: { y: "110%", opacity: 0 },
                visible: { y: 0, opacity: 1 },
              }}
              transition={{
                duration: reduced ? 0.15 : 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}&nbsp;
            </motion.span>
          </span>
        ))}
      </motion.h2>
      {note && <p className="heading-note">{note}</p>}
    </div>
  );
}
export function Reveal({
  children,
  index = 0,
  className = "",
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
}) {
  const reduced = useMotionPreference();
  return (
    <motion.div
      className={`desk-reveal ${className}`}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduced ? 0.15 : 0.65,
        delay: reduced ? 0 : Math.min(index, 4) * 0.075,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
export function StoryImage({
  src,
  alt,
  sizes,
  position = "50% 50%",
}: {
  src: string;
  alt: string;
  sizes: string;
  position?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMotionPreference();
  const visible = useInView(ref, { once: true, amount: 0.15 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  return (
    <div ref={ref} className="story-image">
      <motion.div className="story-parallax" style={{ y: reduced ? 0 : y }}>
        <EditorialImage
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          draggable={false}
          style={{ objectPosition: position }}
        />
      </motion.div>
      <motion.div
        className="image-reveal-mask"
        aria-hidden="true"
        initial={false}
        animate={{ y: visible ? "-101%" : "0%", opacity: reduced ? 0 : 1 }}
        transition={{ duration: reduced ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
