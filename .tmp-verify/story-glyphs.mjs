import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || /GSAP target/i.test(msg.text())) errors.push(msg.text());
});
await page.goto("http://localhost:3000/#about", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const before = await page.evaluate(() => {
  const panel = document.querySelector('[data-chapter-glyph="1"]');
  const stroke = panel?.querySelector("[data-glyph-stroke]");
  const cs = stroke ? getComputedStyle(stroke) : null;
  return {
    selected: document.querySelector("[data-story-station][aria-selected='true']")?.textContent?.trim(),
    panelOpacity: panel ? getComputedStyle(panel).opacity : null,
    dash: cs?.strokeDasharray ?? null,
  };
});

await page.locator("[data-story-station]").nth(1).click();
await page.waitForTimeout(1400);

const after = await page.evaluate(() => {
  const panel = document.querySelector('[data-chapter-glyph="1"]');
  const strokes = [...(panel?.querySelectorAll("[data-glyph-stroke]") ?? [])].map((el) => {
    const cs = getComputedStyle(el);
    return { dash: cs.strokeDasharray, offset: cs.strokeDashoffset };
  });
  return {
    selected: document.querySelector("[data-story-station][aria-selected='true']")?.textContent?.trim(),
    panelOpacity: panel ? getComputedStyle(panel).opacity : null,
    numeral: document.querySelector("[data-chapter-numeral]")?.textContent,
    count: document.querySelector("[data-story-count]")?.textContent,
    strokes,
  };
});

console.log(JSON.stringify({ before, after, errors }, null, 2));
await browser.close();
