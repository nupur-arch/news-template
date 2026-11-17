import "server-only";
import { mockArticles, mockBanners } from "@/mocks/articles";
export async function apiGet<T>(path: string): Promise<T> {
  if (process.env.NEXT_PUBLIC_USE_MOCK === "true") {
    const data =
      path === "articles"
        ? mockArticles
        : path === "banners"
          ? mockBanners
          : undefined;
    if (!data) throw new Error("Unknown mock endpoint");
    return data as T;
  }
  if (!process.env.API_BASE_URL)
    throw new Error("API_BASE_URL is required when mock mode is disabled");
  const response = await fetch(
    new URL(
      path,
      process.env.API_BASE_URL.endsWith("/")
        ? process.env.API_BASE_URL
        : `${process.env.API_BASE_URL}/`,
    ),
    { next: { revalidate: 60 }, signal: AbortSignal.timeout(10000) },
  );
  if (!response.ok)
    throw new Error(`News service unavailable (${response.status})`);
  return response.json() as Promise<T>;
}
