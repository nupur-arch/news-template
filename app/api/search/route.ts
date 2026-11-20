import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/src/lib/search";
import { getCategory } from "@/src/config/site";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 2) return NextResponse.json({ results: [] });
  const results = searchArticles(query, 6).map((article) => ({ slug: article.slug, title: article.title, excerpt: article.excerpt, category: getCategory(article.category)?.name ?? article.category, categorySlug: article.category, subtopic: article.subtopic, image: article.image }));
  return NextResponse.json({ results });
}
