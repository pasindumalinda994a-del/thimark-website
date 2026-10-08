import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import { mkdir } from "node:fs/promises";

await mkdir(".tmp-verify/iso-glyphs", { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

function strokeState() {
  const panel = [...document.querySelectorAll("[data-chapter-glyph]")].find(
    (el) => Number(getComputedStyle(el).opacity) > 0.5,
  );
  const strokes = [...(panel?.querySelectorAll("[data-glyph-stroke]") ?? [])];
  const ratios = strokes.map((el) => {
    const len = el.getTotalLength();
    const offset = parseFloat(getComputedStyle(el).strokeDashoffset) || 0;
    return len > 1 ? offset / len : 0;
  });
  const drawn = ratios.filter((r) => r < 0.08).length;
  return {
    label: document.querySelector("[data-chapter-numeral]")?.textContent,
    paths: strokes.length,
    drawn,
    maxRatio: Math.max(0, ...ratios.map((r) => Math.round(r * 100) / 100)),
    hover: matchMedia("(hover: hover) and (pointer: fine)").matches,
  };
}

async function shot(page, name) {
  const svg = page.locator("[data-chapter-glyph]").locator("svg").locator("visible=true").first();
  await svg.screenshot({ path: `.tmp-verify/iso-glyphs/${name}.png` });
}

const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
await page.goto("http://localhost:3000/#about", { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
const settled = await page.evaluate(strokeState);
await page.locator("[data-story-station]").nth(1).click();
await page.waitForTimeout(450);
const mid = await page.evaluate(strokeState);
await page.waitForTimeout(1800);
const done = await page.evaluate(strokeState);
await shot(page, "draw-done");
await page.evaluate(() => {
  document.querySelector(".about-chapter-glyph")?.dispatchEvent(
    new PointerEvent("pointerenter", { bubbles: true, pointerType: "mouse" }),
  );
});
await page.waitForTimeout(200);
const hover = await page.evaluate(strokeState);
await page.waitForTimeout(1700);
const hoverDone = await page.evaluate(strokeState);
await shot(page, "hover-done");
await desktop.close();

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
const phone = await mobile.newPage();
await phone.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await phone.waitForTimeout(800);
const mobileChapters = [];
for (let i = 0; i < 6; i++) {
  await phone.evaluate((index) => {
    const chapter = document.querySelector(".about-chapter");
    if (!chapter) return;
    const rect = chapter.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const start = top - window.innerHeight * 0.8;
    const end = top + rect.height - window.innerHeight * 0.3;
    const progress = (index + 0.45) / 6;
    window.scrollTo(0, start + (end - start) * progress);
  }, i);
  await phone.waitForTimeout(400);
  mobileChapters.push(await phone.evaluate(strokeState));
  await shot(phone, `m-svg-${i}`);
}
await mobile.close();
await browser.close();

console.log(JSON.stringify({ settled, mid, done, hover, hoverDone, mobileChapters }, null, 2));
