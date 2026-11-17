# The Daily Standard

Editorial news portal built with Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion, next-themes, Lenis, and sanitized Markdown.

## Run

Use Node 20.9 or later and Yarn 1.22: `yarn install`, then `yarn dev`. Validate with `yarn lint` and `yarn build`; serve with `yarn start`.

## Content and API

Category names and identifiers live in `content/site.config.ts`. `.env` enables the included demo edition: exactly 20 featured articles, four groups of five. Demo reporting is illustrative, as disclosed in each article. All image files are local. Photographs are downloaded from Unsplash: world / photo-1513622470522-26c3c8a854bc, culture / photo-1577083552431-6e5fd01aa342, science / photo-1464822759023-fed622ff2c3b, sports / photo-1574629810360-7efbbe195018. The branded fallback is an original SVG.

Set `NEXT_PUBLIC_USE_MOCK=false` and `API_BASE_URL` in `.env.local` for production data. `GET articles` returns an array with `id`, `slug`, `title`, `category_id`, `published_at`, and optional `summary`, `body`, `image_url`, `image_alt`, `author`, `location`, `trending_percent`, `featured`, `editors_pick`. Category IDs must match site configuration. `GET banners` returns `{id,label,text,href}[]`. Images must be local `/images/` assets; unsupported paths use the branded fallback. API errors surface the retry state. No API credentials enter the browser. Production data should include five featured stories per category to reproduce the demo composition.

## Interaction and accessibility

Hero cards select stories; their arrow links and the main Read button open full articles. Category dots switch groups; autoplay advances every eight seconds, pauses on hover or focus, and has a pause toggle. Reduced motion disables autoplay, zoom, magnetic motion, and stagger; transitions become fades. Touch scrolling stays native. Search opens with Cmd/Ctrl+K; Escape closes it. All twenty stories have links in server HTML, including inactive hero groups. Inactive groups are inert. Theme preference persists through next-themes. Lenis excludes dropdown/drawer content.

## Architecture

UI receives only normalized `Article`, `Category`, and `Banner` objects. `services/news.ts` calls `lib/api/client.ts`; API mode maps through `mapApiArticle`. Markdown uses remark-gfm and rehype-sanitize, with noopener/noreferrer links. Image failures use one local branded fallback. Fonts are self-hosted at build time through next/font.

## Browser verification

Run the local server, then run yarn verify in a second terminal. The script uses installed Microsoft Edge and defaults to http://localhost:3003; set VERIFY_URL for a different port. It checks desktop and mobile viewport fit, all 20 server-rendered links, carousel interactions and timing, live search, theme controls, reduced motion, native touch scrolling, the mobile drawer, article links, and the missing-story page. Screenshots are saved to the ignored .artifacts directory.
