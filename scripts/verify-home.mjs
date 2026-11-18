import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base = process.env.VERIFY_URL || "http://localhost:3003";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const settle = () => page.waitForTimeout(1100);
async function visit(selector) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await settle();
}
async function noOverflow(label) {
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
    `No page overflow: ${label}`,
  );
}
try {
  const response = await page.goto(base);
  assert.equal(response.status(), 200);
  await settle();
  await fs.mkdir(".artifacts", { recursive: true });
  const html = await response.text();
  const stories = new Set(
    [...html.matchAll(/href="(\/articles\/[^"?]+)"/g)].map((m) => m[1]),
  );
  assert.equal(stories.size, 20);
  assert.equal(await page.locator(".latest-grid .desk-story").count(), 5);
  assert.equal(await page.locator(".pick-card").count(), 4);
  assert.equal(await page.locator(".category-strip").count(), 4);
  await page.locator(".breaking-ticker").hover();
  assert.equal(
    await page
      .locator(".ticker-track")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
    "paused",
  );
  await page.mouse.move(1, 1);
  assert.equal(
    await page
      .locator(".ticker-track")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
    "running",
  );
  await page
    .getByRole("button", { name: "Pause breaking news ticker", exact: true })
    .click();
  assert.equal(
    await page
      .locator(".ticker-track")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
    "paused",
  );
  await visit("#latest");
  await noOverflow("latest desktop");
  await page.screenshot({ path: ".artifacts/latest-desktop.png" });
  assert.notEqual(
    await page
      .locator(".latest-lead .story-image")
      .evaluate((el) => getComputedStyle(el).clipPath),
    "none",
  );
  const deck = await page
    .locator(".pick-deck")
    .evaluate((el) => ({
      top: el.getBoundingClientRect().top + scrollY,
      card: el.querySelector(".pick-pin").offsetHeight,
    }));
  await page.evaluate(
    ({ top, card }) => window.scrollTo(0, top + card * 0.95),
    deck,
  );
  await settle();
  const stack = await page
    .locator(".pick-card")
    .first()
    .evaluate((el) => ({
      scale: new DOMMatrixReadOnly(getComputedStyle(el).transform).a,
      dim: Number(getComputedStyle(el.querySelector(".pick-dim")).opacity),
      top: el.getBoundingClientRect().top,
    }));
  assert.ok(
    stack.scale < 1 && stack.dim > 0,
    "Previous editor pick scales and dims",
  );
  assert.ok(
    stack.top >= 65 && stack.top <= 170,
    "First pick remains pinned below header",
  );
  await page.screenshot({ path: ".artifacts/editor-stack.png" });
  await visit("#world");
  const rail = page.locator("#world .category-rail");
  await page
    .getByRole("button", { name: "Next World stories", exact: true })
    .click();
  await settle();
  assert.ok(
    (await rail.evaluate((el) => el.scrollLeft)) > 50,
    "Arrow button scrolls category",
  );
  await rail.evaluate((el) => {
    el.scrollLeft = 0;
  });
  await page.waitForTimeout(300);
  const bounds = await rail.boundingBox();
  await page.mouse.move(bounds.x + bounds.width * 0.7, bounds.y + 90);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.25, bounds.y + 90, {
    steps: 12,
  });
  await page.mouse.up();
  await page.waitForTimeout(400);
  assert.ok(
    (await rail.evaluate((el) => el.scrollLeft)) > 50,
    "Mouse drag scrolls category",
  );
  assert.equal(
    new URL(page.url()).pathname,
    "/",
    "Dragging does not open an article",
  );
  await page.screenshot({ path: ".artifacts/category-desktop.png" });
  await visit("#perspectives");
  await page.waitForTimeout(1600);
  assert.equal(
    await page.locator(".edition-stat strong").first().innerText(),
    "20",
  );
  assert.equal(
    await page.locator(".edition-stat strong").nth(1).innerText(),
    "04",
  );
  await visit("#newsletter");
  await page
    .getByLabel("Your email address", { exact: true })
    .fill("demo@example.com");
  await page
    .getByRole("button", { name: "Preview newsletter signup", exact: true })
    .click();
  await page
    .locator("#newsletter-status")
    .filter({ hasText: "No subscription was created" })
    .waitFor();
  const invalid = await page.request.post(`${base}/api/newsletter`, {
    data: { email: "invalid" },
  });
  assert.equal(invalid.status(), 422);
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await settle();
  await noOverflow("footer desktop");
  await page.screenshot({ path: ".artifacts/footer-desktop.png" });
  await visit("#latest");
  await page.locator(".latest-lead .story-link").click();
  await page.waitForURL("**/articles/**");
  await page.locator(".markdown").waitFor();
  await page.waitForTimeout(500);
  assert.equal(await page.locator(".route-frame").count(), 1);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(200);
  const start = Number(
    await page
      .getByRole("progressbar", { name: "Article reading progress" })
      .getAttribute("aria-valuenow"),
  );
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await page.waitForTimeout(300);
  const end = Number(
    await page
      .getByRole("progressbar", { name: "Article reading progress" })
      .getAttribute("aria-valuenow"),
  );
  assert.ok(end > start && end >= 98, "Reading progress reaches the end");
  await page.locator(".back-link").click();
  await page.waitForURL(base + "/");
  await page.locator(".hero").waitFor();
  await page.waitForTimeout(500);
  assert.equal(await page.locator(".route-frame").count(), 1);
  assert.equal(await page.locator(".reading-progress").count(), 0);
  assert.equal(await page.locator(".hero").count(), 1);
  await page.setViewportSize({ width: 390, height: 844 });
  await settle();
  await visit("#latest");
  await noOverflow("latest mobile");
  await page.screenshot({ path: ".artifacts/latest-mobile.png" });
  await visit("#editors-picks");
  await noOverflow("picks mobile");
  await page.screenshot({ path: ".artifacts/picks-mobile.png" });
  await visit("#sports");
  await noOverflow("rail mobile");
  await page.screenshot({ path: ".artifacts/category-mobile.png" });
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await settle();
  await noOverflow("footer mobile");
  await page.screenshot({ path: ".artifacts/footer-mobile.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  assert.equal(
    await page
      .locator(".ticker-track")
      .evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  assert.equal(
    await page
      .locator(".pick-pin")
      .first()
      .evaluate((el) => getComputedStyle(el).position),
    "relative",
  );
  assert.ok(
    !(await page.locator("html").getAttribute("class")).includes("lenis"),
  );
  assert.equal(
    await page
      .locator(".pick-dim")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity),
    "0",
  );
  await page.evaluate(() => window.scrollTo(0, 0));
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  await visit("#latest");
  await page.screenshot({ path: ".artifacts/latest-dark-mobile.png" });
  await noOverflow("dark mobile");
  assert.deepEqual(errors, []);
  console.log(
    "PASS: 20 SSR stories; ticker; latest grid; pinned/scaled/dimmed picks; category drag/arrows; counts; newsletter validation/demo; route transitions; reading progress; responsive layouts; dark and reduced-motion modes.",
  );
} finally {
  await browser.close();
}
