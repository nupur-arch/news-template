import { apiGet } from "@/lib/api/client";
import { mapApiArticle, mapApiBanner } from "@/lib/api/mappers";
import type { Article, Banner } from "@/lib/types";
export async function getArticles(): Promise<Article[]> {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true")
    return apiGet<Article[]>("articles");
  return (await apiGet<Parameters<typeof mapApiArticle>[0][]>("articles")).map(
    mapApiArticle,
  );
}
export async function getBanners(): Promise<Banner[]> {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true")
    return apiGet<Banner[]>("banners");
  return (await apiGet<Banner[]>("banners")).map(mapApiBanner);
}
