import { Header } from "@/components/header";
import { Hero, EditionIntro } from "@/components/hero";
import { BreakingTicker } from "@/components/breaking-ticker";
import { LatestNews } from "@/components/latest-news";
import { EditorsPicks } from "@/components/editors-picks";
import { CategoryStrips } from "@/components/category-strips";
import { NumbersBand } from "@/components/numbers-band";
import { Newsletter } from "@/components/newsletter";
import { SiteFooter } from "@/components/site-footer";
import { siteConfig } from "@/content/site.config";
import { getArticles, getBanners } from "@/services/news";
export default async function Home() {
  const [articles, banners] = await Promise.all([getArticles(), getBanners()]);
  return (
    <>
      <Header articles={articles} />
      <main id="main">
        <Hero
          articles={articles.filter((a) => a.featured)}
          categories={siteConfig.categories}
        />
        <BreakingTicker
          articles={siteConfig.categories.flatMap((c) =>
            articles.filter((a) => a.category.id === c.id).slice(0, 1),
          )}
        />
        <EditionIntro />
        <LatestNews articles={articles} />
        <EditorsPicks articles={articles} />
        <CategoryStrips
          articles={articles}
          categories={siteConfig.categories}
        />
        <NumbersBand
          articles={articles}
          categories={siteConfig.categories}
          banners={banners}
        />
        <Newsletter
          demo={process.env.NEXT_PUBLIC_USE_MOCK === "true"}
          number={String(siteConfig.categories.length + 4).padStart(2, "0")}
        />
      </main>
      <SiteFooter categories={siteConfig.categories} />
    </>
  );
}
