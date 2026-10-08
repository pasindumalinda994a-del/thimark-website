import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const issues = [];

async function open(opts) {
  const page = await browser.newPage(opts);
  page.on("pageerror", (err) => issues.push(String(err)));
  page.on("console", (m) => {
    if (m.type() === "error") issues.push(m.text());
  });
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 25000 },
  );
  await page.waitForTimeout(600);
  return page;
}

function snapshot(page) {
  return page.evaluate(() => {
    const bottomInset = (el) => {
      const clip = getComputedStyle(el).clipPath;
      if (!clip || clip === "none") return 0;
      const raw = clip.match(/[\d.]+/g).map(Number);
      return raw[0]; // top inset: media uncovers upward
    };
    const rightInset = (el) => {
      const clip = getComputedStyle(el).clipPath;
      if (!clip || clip === "none") return 0;
      const raw = clip.match(/[\d.]+/g).map(Number);
      return raw[1] ?? raw[0];
    };
    return {
      y: Math.round(window.scrollY),
      cards: [...document.querySelectorAll(".solutions-card")].map((card) => ({
        plateHidden: rightInset(card.querySelector("[data-card-plate]")),
        mediaHidden: bottomInset(card.querySelector("[data-card-image]")),
        body: Number(getComputedStyle(card.querySelector("[data-card-body]")).opacity),
      })),
    };
  });
}

async function wheelTo(page, targetY, step = 200) {
  for (let i = 0; i < 400; i++) {
    const y = await page.evaluate(() => window.scrollY);
    if (Math.abs(y - targetY) < step / 2) break;
    await page.mouse.wheel(0, y < targetY ? step : -step);
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(1500);
}

const page = await open({ viewport: { width: 1440, height: 900 } });
await page.mouse.move(1430, 20);
const pinStart = await page.evaluate(() => {
  const spacer = document.querySelector("#products")?.closest(".pin-spacer");
  return spacer ? Math.round(spacer.getBoundingClientRect().top + window.scrollY) : null;
});
const pinLen = 2.5 * 900;
const desktop = {};
for (const p of [0.02, 0.3, 0.5, 0.7, 1]) {
  await wheelTo(page, pinStart + p * pinLen);
  desktop[p] = await snapshot(page);
  await page.screenshot({ path: `${OUT}/seq-desktop-${Math.round(p * 100)}.png` });
}
await wheelTo(page, pinStart - 300);
const reversed = await snapshot(page);

const mobile = await open({ viewport: { width: 390, height: 844 } });
await mobile.evaluate(() =>
  document.querySelector('[data-card-bar="0"]')?.scrollIntoView({ block: "center" }),
);
await mobile.waitForTimeout(500);
await mobile.screenshot({ path: `${OUT}/seq-mobile-mid.png` });
await mobile.waitForTimeout(1800);
const mobileSnap = await snapshot(mobile);
await mobile.screenshot({ path: `${OUT}/seq-mobile-done.png` });

const reduced = await open({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await reduced.evaluate(() => document.querySelector("#products")?.scrollIntoView());
await reduced.waitForTimeout(500);
const reducedSnap = await snapshot(reduced);

await browser.close();

const shown = (k) => k.plateHidden < 1 && k.mediaHidden < 1 && k.body > 0.95;
const checks = {
  pinFound: pinStart != null,
  startHidden: desktop[0.02].cards.every((k) => k.mediaHidden > 95),
  sequential: shown(desktop[0.5].cards[0]) && !shown(desktop[0.5].cards[2]),
  endAllShown: desktop[1].cards.every(shown),
  reverseHidden: reversed.cards.every((k) => k.mediaHidden > 95),
  mobileShown: shown(mobileSnap.cards[0]),
  reducedShown: reducedSnap.cards.every(shown),
  noErrors: issues.length === 0,
};
writeFileSync(`${OUT}/solutions-sequence-report.json`, JSON.stringify({ checks, pinStart, desktop, reversed, mobileSnap, reducedSnap, issues }, null, 2));
console.log(JSON.stringify(checks, null, 2));
if (Object.values(checks).some((v) => !v)) process.exitCode = 1;
