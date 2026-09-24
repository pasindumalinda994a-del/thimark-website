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

function scaleX(transform) {
  if (!transform || transform === "none") return 1;
  const m = transform.match(/matrix\(([^,]+)/);
  return m ? Number(m[1]) : 1;
}

async function snapshot(page) {
  return page.evaluate(() => {
    const el = (sel) => document.querySelector(sel);
    const box = (sel) => {
      const n = el(sel);
      if (!n) return null;
      const r = n.getBoundingClientRect();
      const cs = getComputedStyle(n);
      const sx = cs.transform.includes("matrix")
        ? Number(cs.transform.split(",")[0].replace(/[^\d.-]/g, ""))
        : 1;
      return {
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        width: Math.round(r.width),
        opacity: Number(cs.opacity),
        transform: cs.transform,
        clip: cs.clipPath,
        scaleX: sx,
      };
    };
    const ty = (sel) => {
      const n = el(sel);
      if (!n) return null;
      return Number(
        getComputedStyle(n).transform.match(
          /matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\s*([^)]+)\)/,
        )?.[1] ?? 0,
      );
    };
    return {
      y: Math.round(window.scrollY),
      products: box("#products"),
      bar0Ty: ty('[data-card-bar="0"]'),
      bar1Ty: ty('[data-card-bar="1"]'),
      bar2Ty: ty('[data-card-bar="2"]'),
      lane0: box('[data-card-lane="0"]'),
      lane1: box('[data-card-lane="1"]'),
      base0: box('[data-card-base="0"]'),
      base1: box('[data-card-base="1"]'),
      endLine: box("[data-end-line]"),
      image0: box('[data-card-image="0"]'),
      title0: box('[data-card-title="0"]'),
    };
  });
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(page);
await page.mouse.move(800, 450);

let pinStart = null;
let barMoving = null;
let barLanded = null;
let afterHold = null;

for (let i = 0; i < 500; i++) {
  const approaching = await page.evaluate(() => {
    const n = document.querySelector("#products");
    if (!n) return false;
    const top = n.getBoundingClientRect().top;
    return top < window.innerHeight && top > 8;
  });
  await page.mouse.wheel(0, approaching && !pinStart ? 80 : 400);
  await page.waitForTimeout(approaching && !pinStart ? 70 : 35);
  const s = await snapshot(page);
  const pinned = s.products && s.products.top <= 8 && s.products.top >= -8;

  if (
    !pinStart &&
    pinned &&
    s.bar0Ty != null &&
    s.bar0Ty > 350
  ) {
    pinStart = s;
    await page.screenshot({ path: `${OUT}/mid-h-pin.png` });
  }

  if (
    !barMoving &&
    pinStart &&
    pinned &&
    s.bar0Ty != null &&
    s.bar0Ty > 20 &&
    s.bar0Ty < pinStart.bar0Ty - 40
  ) {
    barMoving = s;
    await page.screenshot({ path: `${OUT}/mid-h-moving.png` });
  }

  if (!barLanded && pinned && s.bar0Ty != null && Math.abs(s.bar0Ty) < 4) {
    barLanded = s;
    await page.screenshot({ path: `${OUT}/mid-h-landed.png` });
    await page.waitForTimeout(700);
    afterHold = await snapshot(page);
    await page.screenshot({ path: `${OUT}/mid-h-hold.png` });
    break;
  }
}

const checks = {
  pinHidden:
    (pinStart?.lane0?.scaleX ?? 1) < 0.08 &&
    (pinStart?.base0?.scaleX ?? 1) < 0.08 &&
    (pinStart?.lane1?.scaleX ?? 1) < 0.08,
  footVisible: (pinStart?.endLine?.scaleX ?? 0) > 0.9,
  movingStillHidden:
    (barMoving?.lane0?.scaleX ?? 1) < 0.15 &&
    (barMoving?.base0?.scaleX ?? 1) < 0.15,
  holdDrawn:
    (afterHold?.lane0?.scaleX ?? 0) > 0.9 &&
    (afterHold?.base0?.scaleX ?? 0) > 0.9,
  holdOtherHidden: (afterHold?.lane1?.scaleX ?? 1) < 0.5,
  imageOpened: (afterHold?.title0?.opacity ?? 0) > 0.8,
  pinLane: pinStart?.lane0?.scaleX ?? null,
  pinBase: pinStart?.base0?.scaleX ?? null,
  moveLane: barMoving?.lane0?.scaleX ?? null,
  holdLane: afterHold?.lane0?.scaleX ?? null,
  holdLane1: afterHold?.lane1?.scaleX ?? null,
};

console.log(JSON.stringify({ checks, pinStart, barMoving, barLanded, afterHold }, null, 2));
await browser.close();

if (
  !checks.pinHidden ||
  !checks.footVisible ||
  !checks.movingStillHidden ||
  !checks.holdDrawn ||
  !checks.imageOpened
) {
  process.exitCode = 1;
}
