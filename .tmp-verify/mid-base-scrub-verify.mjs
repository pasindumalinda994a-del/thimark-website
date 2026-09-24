import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

function clipBottom(clip) {
  if (!clip || clip === "none") return 0;
  const nums = clip.match(/[\d.]+/g)?.map(Number) ?? [];
  return nums.length >= 3 ? nums[2] : 0;
}

async function waitReady(page) {
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 25000 },
  );
  await page.waitForTimeout(400);
}

async function snapshot(page) {
  return page.evaluate(() => {
    const box = (sel) => {
      const n = document.querySelector(sel);
      if (!n) return null;
      const r = n.getBoundingClientRect();
      const cs = getComputedStyle(n);
      return {
        top: Math.round(r.top),
        opacity: Number(cs.opacity),
        clip: cs.clipPath,
      };
    };
    const heading = document.querySelector("[data-featured-heading]");
    const plus = document.querySelector("[data-mid-plus]");
    return {
      y: Math.round(window.scrollY),
      products: box("#products"),
      heading: heading
        ? { opacity: Number(getComputedStyle(heading).opacity) }
        : null,
      midTop: box('[data-mid-line="top"]'),
      midBase0: box('.v-g1-4[data-mid-line="base"]'),
      midBase1: box('.v-g1-8[data-mid-line="base"]'),
      plus: plus
        ? { opacity: Number(getComputedStyle(plus).opacity) }
        : null,
      bar0: box('[data-card-bar="0"]'),
    };
  });
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(page);
await page.mouse.move(800, 450);

let afterFade = null;
let topsOpenBasesClosed = null;
let basesMid = null;
let basesOpen = null;
const baseClips = [];

for (let i = 0; i < 280; i++) {
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(28);
  const s = await snapshot(page);
  const pinned = s.products && s.products.top <= 8 && s.products.top >= -8;
  const faded = s.heading && s.heading.opacity < 0.15;

  if (!afterFade && pinned && faded) {
    afterFade = s;
    await page.screenshot({ path: `${OUT}/midbase-after-fade.png` });
  }

  if (
    !topsOpenBasesClosed &&
    afterFade &&
    clipBottom(s.midTop?.clip) < 8 &&
    clipBottom(s.midBase0?.clip) > 80
  ) {
    topsOpenBasesClosed = s;
    await page.screenshot({ path: `${OUT}/midbase-tops-done.png` });
  }

  const b0 = clipBottom(s.midBase0?.clip);
  const b1 = clipBottom(s.midBase1?.clip);
  if (afterFade && b0 > 5 && b0 < 90) {
    baseClips.push({ y: s.y, b0, b1, plus: s.plus?.opacity });
    if (!basesMid) {
      basesMid = s;
      await page.screenshot({ path: `${OUT}/midbase-drawing.png` });
    }
  }

  if (!basesOpen && b0 < 5 && b1 < 5 && (s.plus?.opacity ?? 0) > 0.8) {
    basesOpen = s;
    await page.screenshot({ path: `${OUT}/midbase-open.png` });
    break;
  }
}

const uniqueY = new Set(baseClips.map((c) => c.y)).size;
const samePair = baseClips.every((c) => Math.abs(c.b0 - c.b1) < 8);
const checks = {
  topsThenBases: Boolean(topsOpenBasesClosed),
  basesScrubAcrossScroll: uniqueY >= 2,
  bothBasesSameProgress: samePair && baseClips.length > 0,
  basesFinishOpen: Boolean(basesOpen),
  sample: baseClips.slice(0, 6),
};

console.log(JSON.stringify({ checks, afterFade, topsOpenBasesClosed, basesMid, basesOpen }, null, 2));
await browser.close();
if (
  !checks.topsThenBases ||
  !checks.basesScrubAcrossScroll ||
  !checks.bothBasesSameProgress ||
  !checks.basesFinishOpen
) {
  process.exitCode = 1;
}
