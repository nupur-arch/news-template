import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { logoMarkPath, logoFoldPath } from "../lib/brand.ts";
const paths = (ink, accent) =>
  `<path d="${logoMarkPath}" fill="${ink}" fill-rule="evenodd"/><path d="${logoFoldPath}" fill="${accent}"/>`;
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><style>:root{color:#0E0E0E}@media(prefers-color-scheme:dark){:root{color:#fff}}</style>${paths("currentColor", "#FFC21A")}</svg>`;
const apple = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64"><rect width="64" height="64" fill="#FFC21A"/><g transform="translate(8 8)">${paths("#0E0E0E", "#0E0E0E")}</g></svg>`;
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0E0E0E"/><g transform="translate(384 99) scale(9)">${paths("#FFFFFF", "#FFC21A")}</g></svg>`;
await writeFile(new URL("../public/favicon.svg", import.meta.url), favicon);
await sharp(Buffer.from(apple))
  .png()
  .toFile(
    new URL("../public/apple-touch-icon.png", import.meta.url).pathname.replace(
      /^\/([A-Za-z]:)/,
      "$1",
    ),
  );
await sharp(Buffer.from(og))
  .png()
  .toFile(
    new URL("../public/og-logo.png", import.meta.url).pathname.replace(
      /^\/([A-Za-z]:)/,
      "$1",
    ),
  );
console.log(
  "Generated SVG favicon, 180px Apple touch icon, and 1200×630 social mark from shared geometry.",
);
