import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const base = process.env.VERIFY_URL || "http://localhost:3003";
try {
  const response = await page.goto(base);
  assert.equal(response.status(), 200);
  await page.waitForTimeout(1300);
  const html = await response.text();
  const links = new Set(
    [...html.matchAll(/href="(\/articles\/[^"?]+)"/g)].map((m) => m[1]),
  );
  assert.equal(links.size, 20, "All 20 article links must be server-rendered");
  assert.equal(await page.locator(".hero-cards .news-card").count(), 20);
  assert.equal(await page.locator(".category-dot").count(), 4);
  await fs.mkdir(".artifacts", { recursive: true });
  for (const [width, height] of [
    [1440, 900],
    [1280, 720],
    [390, 844],
    [390, 667],
  ]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(400);
    const metrics = await page.evaluate(() => {
      const r = (s) => document.querySelector(s).getBoundingClientRect();
      return {
        hero: r(".hero"),
        copy: r(".hero-copy"),
        cards: r(".selected-group"),
        footer: r(".hero-bottom"),
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    assert.equal(
      metrics.overflow,
      false,
      `Horizontal overflow at ${width}x${height}`,
    );
    assert.ok(
      metrics.hero.bottom >= metrics.footer.bottom + 10,
      `Hero clips bottom controls at ${width}x${height}`,
    );
    assert.ok(
      metrics.copy.bottom <= metrics.cards.top + 5,
      `Copy overlaps cards at ${width}x${height}: ${JSON.stringify(metrics)}`,
    );
    await page.screenshot({ path: `.artifacts/hero-${width}x${height}.png` });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page
    .getByRole("button", { name: "Show Sports stories", exact: true })
    .click();
  await page.waitForTimeout(1100);
  await page
    .getByRole("heading", { level: 1 })
    .filter({ hasText: "More than" })
    .waitFor();
  await page.locator(".selected-group .card-select").nth(1).click();
  await page.waitForTimeout(500);
  assert.match(await page.locator(".hero h1").innerText(), /runners/);
  await page.getByRole("button", { name: "Next story", exact: true }).click();
  await page.waitForTimeout(500);
  assert.match(await page.locator(".hero h1").innerText(), /new wave/);
  await page.keyboard.press("Control+k");
  await page.getByPlaceholder("Search stories, topics, people…").fill("ocean");
  await page
    .locator(".search-panel")
    .getByRole("link", { name: /Learning to listen to the ocean/ })
    .waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator(".search-panel").count(), 0);
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  assert.ok(
    (await page.locator("html").getAttribute("class"))
      .split(" ")
      .includes("dark"),
  );
  await page.screenshot({ path: ".artifacts/hero-dark.png" });
  await page
    .getByRole("button", { name: "Switch to light mode", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Show World stories", exact: true })
    .click();
  await page.locator(".hero-top .quick-links a").first().focus();
  await page.mouse.move(1, 1);
  const before = await page
    .locator(".category-dot.active .dot-progress circle")
    .getAttribute("stroke-dashoffset");
  await page.waitForTimeout(300);
  const after = await page
    .locator(".category-dot.active .dot-progress circle")
    .getAttribute("stroke-dashoffset");
  assert.equal(before, after, "Autoplay must pause on focus");
  await page.evaluate(() => document.activeElement.blur());
  await page.mouse.move(1, 1);
  await page.waitForTimeout(8500);
  assert.equal(
    await page
      .getByRole("button", { name: "Show Culture stories", exact: true })
      .getAttribute("aria-pressed"),
    "true",
    "Autoplay advances after eight seconds",
  );
  await page.locator("#newsletter").scrollIntoViewIfNeeded();
  await page.mouse.move(1, 1);
  await page.waitForTimeout(250);
  const offscreenProgress = await page
    .locator(".category-dot.active .dot-progress circle")
    .getAttribute("stroke-dashoffset");
  await page.waitForTimeout(350);
  assert.equal(
    await page
      .locator(".category-dot.active .dot-progress circle")
      .getAttribute("stroke-dashoffset"),
    offscreenProgress,
    "Autoplay pauses outside the viewport",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.waitForTimeout(500);
  assert.equal(await page.locator(".ken-burns").count(), 0);
  assert.ok(
    !(await page.locator("html").getAttribute("class"))
      .split(" ")
      .includes("lenis"),
  );
  assert.equal(
    await page
      .locator(".category-dot.active .dot-progress circle")
      .getAttribute("stroke-dashoffset"),
    "100",
  );
  await page.locator(".hero-copy .read-button").click();
  await page.locator(".markdown").waitFor();
  assert.equal(
    await page
      .locator('.markdown a[href="https://news.un.org/"]')
      .getAttribute("rel"),
    "noopener noreferrer",
  );
  await page.goto(`${base}/articles/does-not-exist`);
  assert.match(await page.locator("h1").innerText(), /page out of place/i);
  const touchPage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  await touchPage.goto(base);
  await touchPage.waitForTimeout(600);
  assert.ok(
    !(await touchPage.locator("html").getAttribute("class"))
      .split(" ")
      .includes("lenis"),
    "Touch scrolling stays native",
  );
  await touchPage
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await touchPage.locator("#mobile-navigation").waitFor();
  assert.equal(
    await touchPage
      .locator("#mobile-navigation")
      .getAttribute("data-lenis-prevent"),
    "true",
  );
  await touchPage
    .getByRole("button", { name: "Close navigation", exact: true })
    .click();
  await touchPage.close();
  assert.deepEqual(errors, [], "No browser runtime errors");
  console.log(
    "PASS: SSR links, content fit, category/card navigation, search, themes, focus pause, autoplay, reduced motion, Markdown links, and 404.",
  );
} finally {
  await browser.close();
}
