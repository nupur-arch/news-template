import { siteConfig } from "@/content/site.config";
import type { Article, Banner } from "@/lib/types";
const stories = [
  [
    "The city belongs\nto everyone.",
    "How a new generation of urban thinkers is making room for a slower, more human way of living.",
    "Copenhagen",
    "Elena Morris",
  ],
  [
    "A quieter kind of revolution",
    "Across Europe, neighbourhoods are trading traffic for trees and discovering what comes next.",
    "Amsterdam",
    "Noah Bennett",
  ],
  [
    "Where the river meets tomorrow",
    "The communities rewriting their relationship with the water at their doorstep.",
    "Dhaka",
    "Amina Rahman",
  ],
  [
    "The long way home",
    "Inside the growing movement to bring night trains back to the heart of European travel.",
    "Vienna",
    "James Ellis",
  ],
  [
    "A seat at a different table",
    "Meet the people turning everyday conversations into meaningful local change.",
    "Lisbon",
    "Elena Morris",
  ],
  [
    "The art of\npaying attention.",
    "In a world that never stops scrolling, a new wave of artists is asking us to look a little longer.",
    "London",
    "Maya Chen",
  ],
  [
    "An old craft, a new language",
    "The young makers finding fresh possibilities in the traditions they inherited.",
    "Kyoto",
    "Maya Chen",
  ],
  [
    "What we hear in the silence",
    "Independent listening spaces are changing how a city comes together after dark.",
    "Berlin",
    "Noah Bennett",
  ],
  [
    "Stories written on the walls",
    "A walk through the studios giving a once-forgotten district a new creative identity.",
    "Mexico City",
    "Sofia Reyes",
  ],
  [
    "The bookshop around the corner",
    "Why small independent bookshops are becoming the gathering places we need.",
    "Edinburgh",
    "James Ellis",
  ],
  [
    "A different\nkind of energy.",
    "The researchers looking to nature for answers to our biggest energy questions.",
    "Reykjavik",
    "Amina Rahman",
  ],
  [
    "Learning to listen to the ocean",
    "A new generation of sensors is revealing the hidden rhythms beneath the surface.",
    "Bergen",
    "Elena Morris",
  ],
  [
    "The forest beneath our feet",
    "The extraordinary underground networks connecting the natural world.",
    "Vancouver",
    "Maya Chen",
  ],
  [
    "Small ideas, lasting impact",
    "Inside the laboratories working on materials designed for a circular future.",
    "Zurich",
    "Noah Bennett",
  ],
  [
    "Looking up, looking forward",
    "How community observatories are opening the night sky to everyone.",
    "Atacama",
    "Sofia Reyes",
  ],
  [
    "More than\na beautiful game.",
    "On pitches around the world, the next generation is finding belonging, possibility, and a voice.",
    "Barcelona",
    "James Ellis",
  ],
  [
    "The runners rewriting the route",
    "Meet the running clubs that put community ahead of the finishing time.",
    "Nairobi",
    "Amina Rahman",
  ],
  [
    "A new wave takes the lead",
    "The local surfers building a more inclusive future for their sport.",
    "Ericeira",
    "Sofia Reyes",
  ],
  [
    "Beyond the final whistle",
    "What happens when a neighbourhood club becomes the heart of a community.",
    "Manchester",
    "Noah Bennett",
  ],
  [
    "The courage to begin again",
    "Athletes reflect on the small, unseen moments that make a comeback possible.",
    "Paris",
    "Elena Morris",
  ],
];
export const mockArticles: Article[] = stories.map(
  ([title, summary, location, author], index) => {
    const category = siteConfig.categories[Math.floor(index / 5)];
    const cleanTitle = title.replace(/\n/g, " ");
    return {
      id: String(index + 1),
      slug: cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/ +/g, "-"),
      title,
      summary,
      location,
      author,
      category,
      image: `/images/${category.id}.jpg`,
      imageAlt: `${category.name} editorial photograph accompanying ${cleanTitle}`,
      publishedAt: `2026-11-${String(17 - (index % 5)).padStart(2, "0")}T08:00:00Z`,
      trending: index % 5 === 3 ? undefined : [78, 64, 91, 58, 82][index % 5],
      featured: true,
      editorsPick: index % 5 === 0,
      body: `## ${cleanTitle}\n\n${summary}\n\nProgress often starts with a simple question: what would this place look like if we put people first? For the communities at the heart of this story, that question has become a daily practice.\n\n> Change is built in the ordinary moments, by people who choose to show up.\n\nThis is a **demonstration editorial**, created for The Daily Standard template. The people and reporting described here are illustrative.\n\n### A wider perspective\n\n- Listen to the people closest to the issue.\n- Make room for different experiences.\n- Think about what the next generation will inherit.\n\nExplore more perspectives at [UN News](https://news.un.org/), or [return to the front page](/).`,
    };
  },
);
export const mockBanners: Banner[] = [
  {
    id: "edition",
    label: "The morning edition",
    text: "Independent minds. A shared world.",
    href: "#latest",
  },
];
