import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function waitReady(page) {
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 25000 },
  );
  await page.waitForTimeout(500);
}

async function snapshot(page) {
  return page.evaluate(() => {
    const el = (sel) => document.querySelector(sel);
    const box = (sel) => {
      const n = el(sel);
      if (!n) return null;
      const r = n.getBoundingClientRect();
      const cs = getComputedStyle(n);
      return {
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        height: Math.round(r.height),
        opacity: Number(cs.opacity),
        y: cs.transform,
        clip: cs.clipPath,
      };
    };
    const heading = el("[data-featured-heading]");
    const bar0 = el('[data-card-bar="0"]');
    return {
      y: Math.round(window.scrollY),
      vh: window.innerHeight,
      caps: box("#capabilities"),
      products: box("#products"),
      heading: heading
        ? {
            opacity: Number(getComputedStyle(heading).opacity),
            top: Math.round(heading.getBoundingClientRect().top),
            height: Math.round(heading.getBoundingClientRect().height),
          }
        : null,
      lede: box(".solutions-lede"),
      mid: document.querySelectorAll("[data-mid-line]").length,
      bar0: box('[data-card-bar="0"]'),
      bar1: box('[data-card-bar="1"]'),
      image0: box('[data-card-image="0"]'),
      copy0: box('[data-card-copy="0"]'),
      copy2: box('[data-card-copy="2"]'),
      scrollHeight: document.documentElement.scrollHeight,
      bar0Y: bar0 ? bar0.getBoundingClientRect().top : null,
    };
  });
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(page);
await page.mouse.move(800, 450);

const log = [];
let curtain = null;
let reveal = null;
let afterFade = null;
let firstCard = null;
let done = null;

for (let i = 0; i < 300; i++) {
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(40);
  const s = await snapshot(page);
  const productsPinned = s.products && s.products.top <= 8 && s.products.top >= -8;
  const capsLeaving = s.caps && s.caps.top < 0 && s.caps.bottom > 80;
  const capsGone = !s.caps || s.caps.bottom <= 20;
  const barInSlot = s.bar0 && s.bar0.top > 80 && s.bar0.top < 200;

  if (!curtain && productsPinned && capsLeaving) {
    curtain = s;
    await page.screenshot({ path: `${OUT}/scrub-desktop-curtain.png` });
  }
  if (!reveal && productsPinned && capsGone && s.heading?.opacity > 0.8) {
    reveal = s;
    await page.screenshot({ path: `${OUT}/scrub-desktop-heading.png` });
  }
  if (!afterFade && productsPinned && capsGone && s.heading && s.heading.opacity < 0.2) {
    afterFade = s;
    await page.screenshot({ path: `${OUT}/scrub-desktop-fade.png` });
  }
  if (!firstCard && productsPinned && barInSlot && s.heading?.opacity < 0.1) {
    firstCard = s;
    await page.screenshot({ path: `${OUT}/scrub-desktop-card1.png` });
  }
  if (!done && s.copy2 && s.copy2.opacity > 0.8 && s.copy0?.opacity > 0.8) {
    done = s;
    await page.screenshot({ path: `${OUT}/scrub-desktop-done.png` });
    break;
  }
}

await page.waitForTimeout(600);
if (!done) {
  done = await snapshot(page);
  await page.screenshot({ path: `${OUT}/scrub-desktop-done.png` });
}

await page.mouse.wheel(0, -2400);
await page.waitForTimeout(500);
const reversed = await snapshot(page);
await page.screenshot({ path: `${OUT}/scrub-desktop-reverse.png` });

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
});
await mobile.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(mobile);
await mobile.evaluate(() => document.querySelector("#products")?.scrollIntoView());
await mobile.waitForTimeout(400);
const mobileSnap = await snapshot(mobile);
await mobile.screenshot({ path: `${OUT}/scrub-mobile.png`, fullPage: false });

const reduced = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await reduced.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(reduced);
await reduced.evaluate(() => document.querySelector("#products")?.scrollIntoView());
await reduced.waitForTimeout(400);
const reducedSnap = await snapshot(reduced);
await reduced.screenshot({ path: `${OUT}/scrub-reduced.png` });

log.push({ curtain, reveal, afterFade, firstCard, done, reversed, mobileSnap, reducedSnap });
console.log(JSON.stringify(log, null, 2));

await browser.close();
