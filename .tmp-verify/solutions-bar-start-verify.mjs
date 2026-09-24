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

function clipProgress(clip) {
  if (!clip || clip === "none") return 1;
  const nums = clip.match(/[\d.]+/g)?.map(Number) ?? [];
  if (nums.length < 3) return 1;
  return 1 - nums[2] / 100;
}

async function snapshot(page) {
  return page.evaluate(() => {
    const el = (sel) => document.querySelector(sel);
    const cs = (n) => getComputedStyle(n);
    const box = (sel) => {
      const n = el(sel);
      if (!n) return null;
      const r = n.getBoundingClientRect();
      const style = cs(n);
      return {
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        height: Math.round(r.height),
        opacity: Number(style.opacity),
        transform: style.transform,
        clip: style.clipPath,
        scaleX: style.transform.includes("matrix")
          ? Number(style.transform.split(",")[0].replace(/[^\d.-]/g, ""))
          : 1,
      };
    };
    const ty = (sel) => {
      const n = el(sel);
      if (!n) return null;
      return Number(
        cs(n).transform.match(
          /matrix\([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,\s*([^)]+)\)/,
        )?.[1] ?? 0,
      );
    };
    const card = el(".solutions-card");
    const bar0 = el('[data-card-bar="0"]');
    const plate = bar0?.querySelector(".solutions-bar-plate");
    return {
      y: Math.round(window.scrollY),
      vh: window.innerHeight,
      products: box("#products"),
      card: card
        ? {
            top: Math.round(card.getBoundingClientRect().top),
            bottom: Math.round(card.getBoundingClientRect().bottom),
          }
        : null,
      bar0: box('[data-card-bar="0"]'),
      bar0Ty: ty('[data-card-bar="0"]'),
      bar1Ty: ty('[data-card-bar="1"]'),
      bar2Ty: ty('[data-card-bar="2"]'),
      plate0: plate
        ? {
            bottom: Math.round(plate.getBoundingClientRect().bottom),
          }
        : null,
      image0: box('[data-card-image="0"]'),
      title0: box('[data-card-title="0"]'),
      body0: box('[data-card-body="0"]'),
      title2: box('[data-card-title="2"]'),
      image2: box('[data-card-image="2"]'),
      midTop: box('[data-mid-line="top"]'),
      midBase: box('[data-mid-line="base"]'),
      cardBase: box('[data-card-base="0"]'),
      endLine: box("[data-end-line]"),
      midPlus: box("[data-mid-plus]"),
      endPlus: box("[data-end-plus]"),
    };
  });
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(page);
await page.mouse.move(800, 450);

let pinStart = null;
let drawing = null;
let barLanded = null;
let afterHold = null;
let done = null;

for (let i = 0; i < 500; i++) {
  const approaching =
    pinStart == null &&
    (await page.evaluate(() => {
      const n = document.querySelector("#products");
      if (!n) return false;
      const top = n.getBoundingClientRect().top;
      return top < window.innerHeight && top > 8;
    }));
  await page.mouse.wheel(0, approaching ? 80 : 500);
  await page.waitForTimeout(approaching ? 80 : 40);
  const s = await snapshot(page);
  const productsPinned =
    s.products && s.products.top <= 8 && s.products.top >= -8;
  const stillAtStart =
    s.bar0Ty != null && s.bar1Ty != null && Math.abs(s.bar0Ty - s.bar1Ty) < 24;

  if (!pinStart && productsPinned && stillAtStart) {
    pinStart = s;
    await page.screenshot({ path: `${OUT}/bar-start-pin.png` });
  }

  if (
    !drawing &&
    pinStart &&
    productsPinned &&
    s.bar0Ty != null &&
    s.bar0Ty < pinStart.bar0Ty - 8 &&
    clipProgress(s.midTop?.clip) > 0.05
  ) {
    drawing = s;
    await page.screenshot({ path: `${OUT}/bar-start-drawing.png` });
  }

  if (
    !barLanded &&
    productsPinned &&
    s.bar0Ty != null &&
    Math.abs(s.bar0Ty) < 4
  ) {
    barLanded = s;
    await page.screenshot({ path: `${OUT}/bar-start-landed.png` });
    await page.waitForTimeout(700);
    afterHold = await snapshot(page);
    await page.screenshot({ path: `${OUT}/bar-start-hold.png` });
  }

  if (
    !done &&
    clipOpen(s.image2?.clip) &&
    (s.title2?.opacity ?? 0) > 0.8
  ) {
    done = s;
    await page.screenshot({ path: `${OUT}/bar-start-done.png` });
    break;
  }
}

if (!done) {
  done = await snapshot(page);
  await page.screenshot({ path: `${OUT}/bar-start-done.png` });
}

const restBarBottom =
  pinStart?.bar0 && pinStart.bar1Ty != null
    ? pinStart.bar0.top -
      (pinStart.bar0Ty ?? 0) +
      pinStart.bar1Ty +
      pinStart.bar0.height
    : null;
const restPlateBottom =
  pinStart?.plate0 && pinStart.bar0 && restBarBottom != null
    ? pinStart.plate0.bottom - pinStart.bar0.bottom + restBarBottom
    : null;
const gap =
  pinStart?.card && restPlateBottom != null
    ? pinStart.card.bottom - restPlateBottom
    : null;
const barFlush =
  pinStart?.card && restBarBottom != null
    ? Math.abs(pinStart.card.bottom - restBarBottom)
    : null;

const checks = {
  barsOnScreenAtPin:
    pinStart?.bar0 != null &&
    pinStart.bar0.top >= 0 &&
    pinStart.bar0.bottom <= pinStart.vh,
  barFlushToCardBottom: barFlush != null && barFlush <= 3,
  plateGap8: gap != null && gap >= 6 && gap <= 12,
  horizontalsVisible:
    (pinStart?.cardBase?.scaleX ?? 0) > 0.9 &&
    (pinStart?.endLine?.scaleX ?? 0) > 0.9 &&
    (pinStart?.cardBase?.opacity ?? 0) > 0.9 &&
    (pinStart?.endLine?.opacity ?? 0) > 0.9,
  plusesVisible:
    (pinStart?.midPlus?.opacity ?? 0) > 0.9 &&
    (pinStart?.endPlus?.opacity ?? 0) > 0.9,
  verticalsClosedAtPin: clipClosed(pinStart?.midTop?.clip),
  barAndLineStartTogether: Boolean(drawing),
  revealAfterLand:
    Boolean(barLanded) &&
    Boolean(afterHold) &&
    ((afterHold.title0?.opacity ?? 0) > (barLanded.title0?.opacity ?? 0) + 0.1 ||
      !clipClosed(afterHold.image0?.clip)),
  doneCard2: (done?.title2?.opacity ?? 0) > 0.8,
  gap,
  barFlush,
  pinBar0Ty: pinStart?.bar0Ty ?? null,
  drawBar0Ty: drawing?.bar0Ty ?? null,
  drawMidTop: clipProgress(drawing?.midTop?.clip),
};

console.log(JSON.stringify({ checks, pinStart, drawing, barLanded, afterHold, done }, null, 2));

await browser.close();

if (
  !checks.barsOnScreenAtPin ||
  !checks.barFlushToCardBottom ||
  !checks.plateGap8 ||
  !checks.horizontalsVisible ||
  !checks.verticalsClosedAtPin ||
  !checks.barAndLineStartTogether ||
  !checks.revealAfterLand ||
  !checks.doneCard2
) {
  process.exitCode = 1;
}
