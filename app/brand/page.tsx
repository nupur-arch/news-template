import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";
export const metadata: Metadata = {
  title: "Brand study",
  description:
    "The Daily Standard identity: a folded newspaper with an S-shaped headline cutout.",
  robots: { index: false, follow: false },
};
const surfaces = [
  { id: "paper", label: "01 / Paper", color: "#FFFFFF" },
  { id: "ink", label: "02 / Ink", color: "#0E0E0E" },
  { id: "yellow", label: "03 / Signal", color: "#FFC21A" },
];
export default function BrandPage() {
  return (
    <main id="main" className="brand-review">
      <Link href="/" className="brand-back">
        <ArrowLeft size={15} /> Back to the edition
      </Link>
      <header className="brand-review-intro">
        <span className="eyebrow">THE DAILY STANDARD / IDENTITY STUDY</span>
        <h1>
          A standard
          <br />
          of its own.
        </h1>
        <p>
          A folded newspaper, with an <strong>S-shaped headline cutout</strong>.
          The offset fold gives the mark its signature notch; one clear idea,
          drawn in one ink.
        </p>
      </header>
      <section
        aria-label="Logo variants on three backgrounds"
        className="brand-surfaces"
      >
        {surfaces.map((surface) => (
          <article
            key={surface.id}
            className={`brand-surface brand-surface--${surface.id}`}
          >
            <div className="brand-surface-label eyebrow">
              <span>{surface.label}</span>
              <span>{surface.color}</span>
            </div>
            <div className="brand-sample brand-sample-full">
              <span className="eyebrow">FULL / HORIZONTAL LOCKUP</span>
              <Logo variant="full" />
            </div>
            <div className="brand-sample brand-sample-mark">
              <span className="eyebrow">COMPACT / THE FOLDED S</span>
              <Logo variant="mark" />
            </div>
            <div className="brand-sample brand-sample-stacked">
              <span className="eyebrow">STACKED / VERTICAL LOCKUP</span>
              <Logo variant="stacked" />
            </div>
            <div className="brand-sample brand-sample-mono">
              <span className="eyebrow">SINGLE INK / NO ACCENT</span>
              <Logo variant="full" monochrome />
            </div>
          </article>
        ))}
      </section>
      <section
        className="brand-scale-section"
        aria-labelledby="brand-scale-heading"
      >
        <div className="brand-section-heading">
          <span className="eyebrow">04 / OPTICAL SCALE</span>
          <h2 id="brand-scale-heading">From tab to masthead.</h2>
          <p>
            The fold and headline remain separate at small sizes. Every sample
            uses the same paths.
          </p>
        </div>
        <div className="brand-scale-ruler">
          {[16, 24, 32, 48, 96, 400].map((size) => (
            <div
              className="brand-scale-sample"
              key={size}
              style={{ width: `min(${Math.max(size, 48)}px, 100%)` }}
            >
              <Logo
                variant="mark"
                style={{ width: `min(${size}px, 100%)`, height: "auto" }}
              />
              <span className="eyebrow">{size} PX</span>
            </div>
          ))}
        </div>
      </section>
      <section className="brand-assets" aria-labelledby="brand-assets-heading">
        <span className="eyebrow">05 / IN THE DETAILS</span>
        <h2 id="brand-assets-heading">One mark. Everywhere.</h2>
        <div>
          <a href="/favicon.svg" download>
            Adaptive SVG favicon
            <ArrowUpRight size={16} />
          </a>
          <a href="/apple-touch-icon.png" download>
            Apple touch icon · 180 × 180
            <ArrowUpRight size={16} />
          </a>
          <a href="/og-logo.png" download>
            Social image · 1200 × 630
            <ArrowUpRight size={16} />
          </a>
        </div>
        <p>
          Use <code>Logo</code> with <code>{'variant="full"'}</code>,{" "}
          <code>{'"mark"'}</code>, or <code>{'"stacked"'}</code>. Add{" "}
          <code>monochrome</code> for a single ink. The logo inherits{" "}
          <code>currentColor</code>; the fold and period use{" "}
          <code>--logo-accent</code>, falling back to the site accent. Motion is
          suppressed when reduced motion is requested.
        </p>
      </section>
    </main>
  );
}
