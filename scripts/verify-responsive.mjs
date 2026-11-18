import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.VERIFY_URL || "http://localhost:3003";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({
  viewport: { width: 1366, height: 600 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const sizes = [
  [1366, 600],
  [1440, 900],
  [1920, 1080],
  [1024, 768],
  [820, 600],
  [768, 1024],
  [640, 450],
  [414, 896],
  [390, 844],
  [375, 667],
  [360, 480],
  [320, 568],
];
async function measure(label) {
  const result = await page.evaluate(() => {
    const rect = (selector) => {
      const r = document.querySelector(selector)?.getBoundingClientRect();
      return r
        ? {
            top: r.top,
            bottom: r.bottom,
            left: r.left,
            right: r.right,
            width: r.width,
            height: r.height,
          }
        : null;
    };
    const overlap = (a, b) =>
      a &&
      b &&
      a.left < b.right - 1 &&
      a.right > b.left + 1 &&
      a.top < b.bottom - 1 &&
      a.bottom > b.top + 1;
    const hero = rect(".hero"),
      copy = rect(".hero-copy"),
      cards = rect(".selected-group"),
      bar = rect(".hero-bottom"),
      read = rect(".hero-copy .read-button"),
      title = rect(".hero h1"),
      ring = rect(".trending");
    return {
      hero,
      copy,
      cards,
      bar,
      read,
      title,
      ring,
      ringOverlap: !!overlap(title, ring),
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      font: {
        meta: parseFloat(
          getComputedStyle(document.querySelector(".story-meta")).fontSize,
        ),
        summary: parseFloat(
          getComputedStyle(document.querySelector(".hero-summary")).fontSize,
        ),
        date: parseFloat(
          getComputedStyle(document.querySelector(".selected-group time"))
            .fontSize,
        ),
        button: parseFloat(
          getComputedStyle(document.querySelector(".hero-copy .read-button"))
            .fontSize,
        ),
      },
    };
  });
  assert.equal(result.overflow, false, `Page overflow: ${label}`);
  assert.ok(
    result.copy.bottom + 10 <= result.cards.top,
    `Copy/cards overlap: ${label} ${JSON.stringify(result)}`,
  );
  assert.ok(
    result.read.bottom + 10 <= result.cards.top,
    `Read button overlaps cards: ${label}`,
  );
  assert.ok(
    result.cards.bottom + 10 <= result.bar.top,
    `Cards/bottom bar overlap: ${label}`,
  );
  assert.ok(
    result.bar.bottom + 10 <= result.hero.bottom,
    `Bottom controls clipped: ${label}`,
  );
  assert.equal(
    result.ringOverlap,
    false,
    `Trending ring covers headline: ${label}`,
  );
  assert.ok(
    result.font.meta >= 13 &&
      result.font.date >= 13 &&
      result.font.summary >= 16 &&
      result.font.button >= 15,
    `Hero type is readable: ${label}`,
  );
}
async function readablePage(label) {
  const small = await page.evaluate(() => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    const tiny = [];
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.trim()) continue;
      const el = node.parentElement;
      if (
        !el ||
        el.closest(
          'svg,script,style,[aria-hidden="true"],[inert],.sr-only,nextjs-portal',
        )
      )
        continue;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || !el.getClientRects().length)
        continue;
      const size = parseFloat(style.fontSize);
      if (size < 13)
        tiny.push({
          text: node.textContent.trim().slice(0, 45),
          size,
          element: el.className,
        });
    }
    return tiny;
  });
  assert.deepEqual(small, [], `No tiny text: ${label}`);
}
try {
  const response = await page.goto(base);
  assert.equal(response.status(), 200);
  await page.waitForTimeout(700);
  await page.evaluate(() => document.fonts.ready);
  await fs.mkdir(".artifacts", { recursive: true });
  const links = new Set(
    [...(await response.text()).matchAll(/href="(\/articles\/[^"?]+)"/g)].map(
      (match) => match[1],
    ),
  );
  assert.equal(links.size, 20);
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(120);
    await measure(`${width}x${height}`);
    await readablePage(`${width}x${height}`);
    if (
      [
        [1366, 600],
        [1024, 768],
        [390, 844],
        [320, 568],
      ].some(([w, h]) => w === width && h === height)
    ) {
      for (const category of ["World", "Culture", "Science", "Sports"]) {
        await page
          .getByRole("button", {
            name: `Show ${category} stories`,
            exact: true,
          })
          .click();
        for (let index = 0; index < 5; index++) {
          await page.locator(".selected-group .card-select").nth(index).click();
          await page.waitForTimeout(190);
          await measure(`${width}x${height} ${category}/${index + 1}`);
        }
      }
      await page
        .getByRole("button", { name: "Show World stories", exact: true })
        .click();
      await page.waitForTimeout(200);
      assert.ok(
        (await page
          .locator(".selected-group")
          .evaluate((el) => el.scrollLeft)) <= 1,
        "Category switch returns to the first card",
      );
    }
    if ([1366, 1440, 390, 320].includes(width)) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(150);
      await page.locator(".hero").screenshot({
        path: `.artifacts/responsive-hero-${width}x${height}.png`,
      });
    }
  }
  for (const width of [1366, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    const clipped = await page
      .locator(".pick-copy")
      .evaluateAll((elements) =>
        elements
          .map((el) => ({
            copy: el.getBoundingClientRect().bottom,
            controls: el.querySelector(".pick-bottom").getBoundingClientRect()
              .bottom,
          }))
          .filter((item) => item.controls > item.copy - 10),
      );
    assert.deepEqual(clipped, [], `Editor pick controls fit at ${width}px`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const section of [
    "#latest",
    "#editors-picks",
    "#sports",
    "#newsletter",
    ".site-footer",
  ]) {
    await page.locator(section).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await readablePage(`mobile ${section}`);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `${section} fits mobile`,
    );
    await page.screenshot({
      path: `.artifacts/readable-${section.replace(/[^a-z]/g, "")}-mobile.png`,
    });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  await measure("dark mobile");
  await readablePage("dark mobile");
  await page.locator(".hero-copy .read-button").click();
  await page.locator(".markdown").waitFor();
  await page.waitForTimeout(200);
  await readablePage("article");
  assert.ok(
    (await page
      .locator(".markdown")
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize))) >= 18,
  );
  await page.goto(base + "/brand");
  await page.waitForTimeout(200);
  await readablePage("brand");
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    "Brand fits mobile",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: no hero overlaps across 12 viewport sizes and every story at four sizes; readable type throughout home/article/brand; mobile sections; dark/reduced-motion; 20 SSR links.",
  );
} finally {
  await browser.close();
}
