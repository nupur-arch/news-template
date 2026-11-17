import type { Article, Banner } from "@/lib/types";
import { siteConfig } from "@/content/site.config";
type ApiArticle = {
  id: string | number;
  slug: string;
  title: string;
  category_id: string;
  summary?: string;
  body?: string;
  image_url?: string;
  image_alt?: string;
  author?: string;
  location?: string;
  published_at: string;
  trending_percent?: number;
  featured?: boolean;
  editors_pick?: boolean;
};
export function mapApiArticle(raw: ApiArticle): Article {
  const category = siteConfig.categories.find(
    (item) => item.id === raw.category_id,
  );
  if (
    !category ||
    !raw.slug ||
    !raw.title ||
    !Number.isFinite(Date.parse(raw.published_at))
  )
    throw new Error("Invalid article received from API");
  const image =
    raw.image_url?.startsWith("/images/") && !raw.image_url.includes("..")
      ? raw.image_url
      : "/images/fallback.svg";
  return {
    id: String(raw.id),
    slug: raw.slug,
    title: raw.title,
    category,
    summary: raw.summary ?? "",
    body: raw.body ?? "",
    image,
    imageAlt: raw.image_alt ?? raw.title,
    author: raw.author ?? "Standard Editorial",
    location: raw.location ?? "Global",
    publishedAt: raw.published_at,
    trending:
      typeof raw.trending_percent === "number" &&
      Number.isFinite(raw.trending_percent)
        ? Math.min(100, Math.max(0, raw.trending_percent))
        : undefined,
    featured: raw.featured ?? false,
    editorsPick: raw.editors_pick ?? false,
  };
}
export const mapApiBanner = (raw: Banner): Banner => ({
  id: String(raw.id),
  label: raw.label,
  text: raw.text,
  href: /^(\/(?!\/)|#|https:\/\/)/.test(raw.href) ? raw.href : "/",
});
