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

function clipClosed(clip) {
  if (!clip || clip === "none") return false;
  const nums = clip.match(/[\d.]+/g)?.map(Number) ?? [];
  return nums.length >= 3 && nums[2] > 80;
}

function clipOpen(clip) {
  if (!clip || clip === "none") return true;
  const nums = clip.match(/[\d.]+/g)?.map(Number) ?? [];
  return nums.length >= 3 && nums[2] < 8;
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
    const ty = bar0
      ? Number(
          getComputedStyle(bar0).transform.match(
            /matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\s*([^)]+)\)/,
          )?.[1] ?? 0,
        )
      : null;
    return {
      y: Math.round(window.scrollY),
      vh: window.innerHeight,
      caps: box("#capabilities"),
      products: box("#products"),
      heading: heading
        ? {
            opacity: Number(getComputedStyle(heading).opacity),
            top: Math.round(heading.getBoundingClientRect().top),
          }
        : null,
      bar0: box('[data-card-bar="0"]'),
      bar0Ty: ty,
      image0: box('[data-card-image="0"]'),
      title0: box('[data-card-title="0"]'),
      body0: box('[data-card-body="0"]'),
      title2: box('[data-card-title="2"]'),
      image2: box('[data-card-image="2"]'),
    };
  });
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(page);
await page.mouse.move(800, 450);

let afterFade = null;
let barMovingImageClosed = null;
let barLanded = null;
let afterHold = null;
let done = null;

for (let i = 0; i < 360; i++) {
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(30);
  const s = await snapshot(page);
  const productsPinned =
    s.products && s.products.top <= 8 && s.products.top >= -8;
  const capsGone = !s.caps || s.caps.bottom <= 20;
  const barInSlot = s.bar0 && s.bar0.top > 80 && s.bar0.top < 200;

  if (
    !afterFade &&
    productsPinned &&
    capsGone &&
    s.heading &&
    s.heading.opacity < 0.2
  ) {
    afterFade = s;
    await page.screenshot({ path: `${OUT}/scrub-desktop-fade.png` });
  }

  if (
    !barMovingImageClosed &&
    afterFade &&
    s.bar0Ty != null &&
    s.bar0Ty > 40 &&
    clipClosed(s.image0?.clip)
  ) {
    barMovingImageClosed = s;
    await page.screenshot({ path: `${OUT}/scrub-desktop-card1.png` });
  }

  if (
    !barLanded &&
    productsPinned &&
    barInSlot &&
    s.heading?.opacity < 0.1 &&
    s.bar0Ty != null &&
    Math.abs(s.bar0Ty) < 8
  ) {
    barLanded = s;
    await page.screenshot({ path: `${OUT}/hybrid-bar-landed.png` });
    await page.waitForTimeout(700);
    afterHold = await snapshot(page);
    await page.screenshot({ path: `${OUT}/hybrid-after-hold.png` });
  }

  if (
    !done &&
    clipOpen(s.image2?.clip) &&
    s.title2 &&
    s.title2.opacity > 0.8
  ) {
    done = s;
    await page.screenshot({ path: `${OUT}/scrub-desktop-done.png` });
    break;
  }
}

if (!done) {
  done = await snapshot(page);
  await page.screenshot({ path: `${OUT}/scrub-desktop-done.png` });
}

for (let i = 0; i < 80; i++) {
  await page.mouse.wheel(0, -1200);
  await page.waitForTimeout(40);
  const s = await snapshot(page);
  if ((s.heading?.opacity ?? 0) > 0.5 || (s.bar0Ty ?? 0) > 80) break;
}
await page.waitForTimeout(900);
const reversed = await snapshot(page);
await page.screenshot({ path: `${OUT}/scrub-desktop-reverse.png` });

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
});
await mobile.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(mobile);
await mobile.evaluate(() =>
  document.querySelector("#products")?.scrollIntoView(),
);
await mobile.waitForTimeout(400);
const mobileSnap = await snapshot(mobile);
await mobile.screenshot({ path: `${OUT}/scrub-mobile.png`, fullPage: false });

const reduced = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await reduced.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(reduced);
await reduced.evaluate(() =>
  document.querySelector("#products")?.scrollIntoView(),
);
await reduced.waitForTimeout(400);
const reducedSnap = await snapshot(reduced);
await reduced.screenshot({ path: `${OUT}/scrub-reduced.png` });

const playAdvanced =
  barLanded &&
  afterHold &&
  (afterHold.title0?.opacity > (barLanded.title0?.opacity ?? 0) + 0.1 ||
    !clipClosed(afterHold.image0?.clip));

const checks = {
  barScrubWhileImageClosed: Boolean(barMovingImageClosed),
  playContinuesAfterScrollStops: Boolean(playAdvanced),
  barLandedTy: barLanded?.bar0Ty ?? null,
  landedTitle: barLanded?.title0?.opacity ?? null,
  landedClip: barLanded?.image0?.clip ?? null,
  holdTitle: afterHold?.title0?.opacity ?? null,
  holdClip: afterHold?.image0?.clip ?? null,
  reverseHides:
    clipClosed(reversed.image0?.clip) || (reversed.title0?.opacity ?? 1) < 0.2,
  mobileTitleVisible: (mobileSnap.title0?.opacity ?? 0) > 0.8,
  reducedTitleVisible: (reducedSnap.title0?.opacity ?? 0) > 0.8,
  doneTitle2: done?.title2?.opacity ?? null,
};

console.log(JSON.stringify({ checks, afterFade, barMovingImageClosed, barLanded, afterHold, done, reversed: { title0: reversed.title0, image0: reversed.image0 }, mobileSnap: { title0: mobileSnap.title0, image0: mobileSnap.image0 }, reducedSnap: { title0: reducedSnap.title0, image0: reducedSnap.image0 } }, null, 2));

await browser.close();
if (
  !checks.barScrubWhileImageClosed ||
  !checks.playContinuesAfterScrollStops ||
  !checks.reverseHides ||
  !checks.mobileTitleVisible ||
  !checks.reducedTitleVisible
) {
  process.exitCode = 1;
}
