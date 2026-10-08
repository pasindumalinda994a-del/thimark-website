import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const consoleIssues = [];

async function open(opts) {
  const page = await browser.newPage(opts);
  page.on("console", (msg) => {
    const t = msg.text();
    if (msg.type() === "error" || /warn|invalid "position"/i.test(t)) {
      if (/solutions|Image with src|gsap|SplitText/i.test(t)) consoleIssues.push(t);
    }
  });
  page.on("pageerror", (err) => consoleIssues.push(String(err)));
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
    const q = (s, r = document) => r.querySelector(s);
    const products = q("#products");
    const cards = [...document.querySelectorAll(".solutions-card")].map((card) => {
      const shot = q("[data-card-shot]", card);
      const line = q("[data-card-scan-line]", card);
      const scan = q("[data-card-scan]", card);
      const word = q("[data-card-title] > span > span", card) ?? q("[data-card-title] span", card);
      const sr = shot.getBoundingClientRect();
      const clip = shot.style.clipPath || getComputedStyle(shot).clipPath;
      // inset() collapses like margin shorthand: 1 to 4 values.
      const raw = clip && clip !== "none" ? clip.match(/[\d.]+/g).map(Number) : [0];
      const nums = [raw[0], raw[1] ?? raw[0], raw[2] ?? raw[0], raw[3] ?? raw[1] ?? raw[0]];
      const visibleBottom = sr.top + sr.height * (1 - nums[2] / 100);
      return {
        label: q("[data-card-bar-label]", card).textContent,
        clipBottom: nums[2],
        scanOpacity: Number(getComputedStyle(scan).opacity),
        lineTop: Math.round(line.getBoundingClientRect().top * 10) / 10,
        visibleBottom: Math.round(visibleBottom * 10) / 10,
        row: q("[data-card-scan-row]", card).textContent,
        titleWord: word ? getComputedStyle(word).transform : null,
        bodyOpacity: Number(getComputedStyle(q("[data-card-body]", card)).opacity),
      };
    });
    return {
      y: Math.round(window.scrollY),
      vh: window.innerHeight,
      productsTop: products ? Math.round(products.getBoundingClientRect().top) : null,
      status: q("[data-scan-status]")?.textContent,
      count: q("[data-scan-count]")?.textContent,
      cards,
    };
  });
}

async function wheelTo(page, targetY, step = 240) {
  for (let i = 0; i < 400; i++) {
    const y = await page.evaluate(() => window.scrollY);
    if (Math.abs(y - targetY) < step / 2) break;
    await page.mouse.wheel(0, y < targetY ? step : -step);
    await page.waitForTimeout(25);
  }
  await page.waitForTimeout(1400);
}

// ---- Desktop -------------------------------------------------------------
const page = await open({ viewport: { width: 1440, height: 900 } });
await page.mouse.move(1300, 450);

const pinStart = await page.evaluate(() => {
  const spacer = document.querySelector("#products")?.closest(".pin-spacer");
  return spacer ? Math.round(spacer.getBoundingClientRect().top + window.scrollY) : null;
});
const vh = 900;
const pinLen = 4.5 * vh;
const desktop = {};
for (const p of [0.02, 0.25, 0.5, 0.75, 1]) {
  await wheelTo(page, pinStart + p * pinLen);
  desktop[p] = await snapshot(page);
  await page.screenshot({ path: `${OUT}/scan-desktop-${Math.round(p * 100)}.png` });
}

// Hover pass over a locked card, while still pinned.
await wheelTo(page, pinStart + 0.8 * pinLen);
const media0 = await page.$('[data-card-image="0"]');
const box = await media0.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.waitForTimeout(250);
const hoverMid = await snapshot(page);
await page.screenshot({ path: `${OUT}/scan-desktop-hover.png` });
await page.mouse.move(1430, 20);

// Reverse to the start of the pin.
await wheelTo(page, pinStart + 0.04 * pinLen);
const reversed = await snapshot(page);
await page.screenshot({ path: `${OUT}/scan-desktop-reverse.png` });

// Mid-scan resize: the image edge must stay on the line.
await wheelTo(page, pinStart + 0.2 * pinLen);
await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(1600);
const resized = await snapshot(page);
await page.screenshot({ path: `${OUT}/scan-desktop-resized.png` });

// ---- Mobile --------------------------------------------------------------
const mobile = await open({ viewport: { width: 390, height: 844 } });
await mobile.evaluate(() =>
  document.querySelector('[data-card-bar="0"]')?.scrollIntoView({ block: "center" }),
);
await mobile.waitForTimeout(700);
await mobile.screenshot({ path: `${OUT}/scan-mobile-mid.png` });
await mobile.waitForTimeout(2200);
const mobileSnap = await snapshot(mobile);
await mobile.screenshot({ path: `${OUT}/scan-mobile-done.png` });

// ---- Reduced motion ------------------------------------------------------
const reduced = await open({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await reduced.evaluate(() => document.querySelector("#products")?.scrollIntoView());
await reduced.waitForTimeout(500);
const reducedSnap = await snapshot(reduced);
await reduced.screenshot({ path: `${OUT}/scan-reduced.png` });

await browser.close();

const c = (s, i) => s.cards[i];
const checks = {
  pinFound: pinStart != null,
  startStandby: c(desktop[0.02], 0).clipBottom > 95 && c(desktop[0.02], 1).label === "",
  quarterMidScanOnLine:
    c(desktop[0.25], 0).scanOpacity > 0.5 &&
    (c(desktop[0.25], 0).clipBottom <= 0 ||
      Math.abs(c(desktop[0.25], 0).lineTop - c(desktop[0.25], 0).visibleBottom) < 2),
  halfCard0Done: c(desktop[0.5], 0).clipBottom < 1 && c(desktop[0.5], 0).label === "Kilgharrah 600",
  endAllLocked: desktop[1].cards.every((k) => k.clipBottom < 1 && k.scanOpacity < 0.05),
  endReadout: desktop[1].count === "03" && desktop[1].status === "Inspection complete",
  hoverPassVisible: c(hoverMid, 0).scanOpacity > 0.5 && c(hoverMid, 0).clipBottom < 1,
  reverseHides: c(reversed, 0).clipBottom > 95 && reversed.count === "00",
  resizedEdgeOnLine: resized.cards.every(
    (k) => k.clipBottom <= 0 || k.clipBottom >= 100 || Math.abs(k.lineTop - k.visibleBottom) < 2,
  ),
  mobileDone: c(mobileSnap, 0).clipBottom < 1 && c(mobileSnap, 0).label === "Kilgharrah 600",
  reducedFinal: reducedSnap.cards.every((k) => k.clipBottom < 1 && k.label.length > 0) && reducedSnap.count === "03",
};

const report = JSON.stringify({ checks, pinStart, desktop, hoverMid, reversed, resized, mobileSnap, reducedSnap, consoleIssues }, null, 2);
const { writeFileSync } = await import("node:fs");
writeFileSync(`${OUT}/solutions-scan-report.json`, report);
console.log(JSON.stringify(checks, null, 2));
if (Object.values(checks).some((v) => !v)) process.exitCode = 1;
