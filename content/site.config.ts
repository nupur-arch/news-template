import type { Category } from "@/lib/types";
export const siteConfig = {
  name: "The Daily Standard",
  tagline: "A wider view of the world.",
  categories: [
    { id: "world", name: "World", number: "01", icon: "world" },
    { id: "culture", name: "Culture", number: "02", icon: "culture" },
    { id: "science", name: "Science", number: "03", icon: "science" },
    { id: "sports", name: "Sports", number: "04", icon: "sports" },
  ] satisfies Category[],
};
