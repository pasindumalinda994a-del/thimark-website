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

function clipBottom(clip) {
  if (!clip || clip === "none") return 0;
  const nums = clip.match(/[\d.]+/g)?.map(Number) ?? [];
  if (nums.length >= 3) return nums[2];
  if (nums.length === 1) return nums[0];
  return 0;
}

function clipClosed(clip) {
  return clipBottom(clip) > 80;
}

function clipOpen(clip) {
  return clipBottom(clip) < 8;
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
        clip: cs.clipPath,
      };
    };
    return {
      y: Math.round(window.scrollY),
      vh: window.innerHeight,
      image0: box('[data-core-image="0"]'),
      image1: box('[data-core-image="1"]'),
      label0: box('[data-core-label="0"]'),
      label1: box('[data-core-label="1"]'),
      title0: box('[data-core-title="0"]'),
      title1: box('[data-core-title="1"]'),
    };
  });
}

const log = [];

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(desktop);
await desktop.mouse.move(800, 450);

const start = await snapshot(desktop);
await desktop.screenshot({ path: `${OUT}/two-core-reveal-start.png` });

let approaching = null;

for (let i = 0; i < 320; i++) {
  await desktop.mouse.wheel(0, 160);
  await desktop.waitForTimeout(30);
  const s = await snapshot(desktop);
  if (
    s.image0 &&
    s.image0.top < s.vh &&
    s.image0.top > s.vh * 0.75 &&
    clipClosed(s.image0.clip)
  ) {
    approaching = s;
    await desktop.screenshot({ path: `${OUT}/two-core-reveal-closed.png` });
    break;
  }
}

await desktop.waitForTimeout(1300);
const revealed = await snapshot(desktop);
await desktop.screenshot({ path: `${OUT}/two-core-reveal-open.png` });

for (let i = 0; i < 80; i++) {
  await desktop.mouse.wheel(0, -1200);
  await desktop.waitForTimeout(30);
  const s = await snapshot(desktop);
  if (s.y < 40) break;
}
await desktop.waitForTimeout(1300);
const reversed = await snapshot(desktop);
await desktop.screenshot({ path: `${OUT}/two-core-reveal-reverse.png` });

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
});
await mobile.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(mobile);
await mobile.mouse.move(180, 400);

let mobileSplit = null;

for (let i = 0; i < 320; i++) {
  await mobile.mouse.wheel(0, 180);
  await mobile.waitForTimeout(40);
  const s = await snapshot(mobile);
  if (
    s.image0 &&
    s.image1 &&
    s.image0.top <= s.vh * 0.8 &&
    s.image1.top > s.vh * 0.8
  ) {
    await mobile.waitForTimeout(1200);
    const held = await snapshot(mobile);
    if (
      clipOpen(held.image0?.clip) &&
      (held.label0?.opacity ?? 0) > 0.8 &&
      clipClosed(held.image1?.clip)
    ) {
      mobileSplit = held;
      await mobile.screenshot({
        path: `${OUT}/two-core-reveal-mobile-split.png`,
      });
    }
    break;
  }
}

for (let i = 0; i < 120; i++) {
  await mobile.mouse.wheel(0, 240);
  await mobile.waitForTimeout(30);
  const s = await snapshot(mobile);
  if (clipOpen(s.image1?.clip) && (s.title1?.opacity ?? 0) > 0.8) break;
}
await mobile.waitForTimeout(700);
const mobileDone = await snapshot(mobile);
await mobile.screenshot({ path: `${OUT}/two-core-reveal-mobile.png` });

const reduced = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await reduced.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(reduced);
await reduced.evaluate(() =>
  document.getElementById("capabilities")?.scrollIntoView(),
);
await reduced.waitForTimeout(400);
const reducedSnap = await snapshot(reduced);
await reduced.screenshot({ path: `${OUT}/two-core-reveal-reduced.png` });

const checks = {
  startClosed:
    clipClosed(start.image0?.clip) &&
    (start.label0?.opacity ?? 1) < 0.2 &&
    (start.title0?.opacity ?? 1) < 0.2,
  approachingClosed: Boolean(approaching),
  desktopOpen:
    clipOpen(revealed.image0?.clip) &&
    clipOpen(revealed.image1?.clip) &&
    (revealed.label0?.opacity ?? 0) > 0.8 &&
    (revealed.title1?.opacity ?? 0) > 0.8,
  reverseHides:
    clipClosed(reversed.image0?.clip) || (reversed.title0?.opacity ?? 1) < 0.2,
  mobileFirstBeforeSecond: Boolean(mobileSplit),
  mobileOpens: clipOpen(mobileDone?.image1?.clip),
  reducedVisible:
    (reducedSnap.label0?.opacity ?? 0) > 0.8 &&
    (reducedSnap.title1?.opacity ?? 0) > 0.8 &&
    clipOpen(reducedSnap.image0?.clip) &&
    clipOpen(reducedSnap.image1?.clip),
};

log.push({
  checks,
  start: { clip: start.image0?.clip, label0: start.label0?.opacity },
  approaching,
  revealed,
  reversed: {
    y: reversed.y,
    clip: reversed.image0?.clip,
    title0: reversed.title0?.opacity,
  },
  mobileSplit,
  mobileDone: {
    image0: mobileDone?.image0,
    image1: mobileDone?.image1,
    title0: mobileDone?.title0?.opacity,
    title1: mobileDone?.title1?.opacity,
  },
  reducedSnap: {
    clip0: reducedSnap.image0?.clip,
    clip1: reducedSnap.image1?.clip,
    label0: reducedSnap.label0?.opacity,
    title1: reducedSnap.title1?.opacity,
  },
});

console.log(JSON.stringify(log, null, 2));

await browser.close();

if (
  !checks.startClosed ||
  !checks.approachingClosed ||
  !checks.desktopOpen ||
  !checks.reverseHides ||
  !checks.mobileFirstBeforeSecond ||
  !checks.mobileOpens ||
  !checks.reducedVisible
) {
  process.exitCode = 1;
}
