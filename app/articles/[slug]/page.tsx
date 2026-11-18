import { ArticleProgress } from "@/components/article-progress";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getArticles } from "@/services/news";
import { Header } from "@/components/header";
import { EditorialImage } from "@/components/editorial-image";
import { Markdown } from "@/components/markdown";
import { formatDate } from "@/lib/format";
export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = (await getArticles()).find((a) => a.slug === slug);
  return { title: a?.title.replace(/\n/g, " "), description: a?.summary };
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const articles = await getArticles();
  const a = articles.find((a) => a.slug === slug);
  if (!a) notFound();
  return (
    <>
      <Header articles={articles} />
      <ArticleProgress />
      <main id="main" className="article-page">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> Back to the edition
        </Link>
        <span className="eyebrow">
          {a.category.number} / {a.category.name}
        </span>
        <h1>{a.title.replace(/\n/g, " ")}</h1>
        <p className="article-deck">{a.summary}</p>
        <p className="eyebrow">
          {a.author} / {a.location} / {formatDate(a.publishedAt)}
        </p>
        <div className="article-image">
          <EditorialImage
            src={a.image}
            alt={a.imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1100px"
          />
        </div>
        <Markdown>{a.body}</Markdown>
        <Link href="/" className="read-button">
          More perspectives ↗
        </Link>
      </main>
    </>
  );
}
