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
  await page.waitForTimeout(400);
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
        transform: cs.transform,
      };
    };
    const heading = el("[data-featured-heading]");
    const products = el("#products");
    return {
      vh: window.innerHeight,
      productsH: products ? Math.round(products.getBoundingClientRect().height) : null,
      productsTop: products ? Math.round(products.getBoundingClientRect().top) : null,
      heading: heading ? Number(getComputedStyle(heading).opacity) : null,
      end0: box('[data-end-line].h-seg-0-4'),
      end1: box('[data-end-line].h-seg-4-8'),
      end2: box('[data-end-line].h-seg-8-12'),
      pluses: document.querySelectorAll("[data-end-plus]").length,
      plus0: box('[data-end-plus].v-g1-0'),
      midBase: box('[data-mid-line="base"]'),
    };
  });
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(page);
await page.mouse.move(800, 450);

let faded = null;
let endDrawing = null;
let endOpen = null;

for (let i = 0; i < 260; i++) {
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(28);
  const s = await snapshot(page);
  const pinned = s.productsTop != null && s.productsTop <= 8 && s.productsTop >= -8;
  if (!faded && pinned && (s.heading ?? 1) < 0.15) {
    faded = s;
    await page.screenshot({ path: `${OUT}/endline-fade.png` });
  }
  const t = s.end0?.transform ?? "";
  const scaled = t.includes("matrix") && !t.startsWith("matrix(1, 0, 0, 1, 0, 0)");
  if (!endDrawing && faded && (s.end0?.opacity ?? 0) > 0.2 && scaled) {
    endDrawing = s;
    await page.screenshot({ path: `${OUT}/endline-drawing.png` });
  }
  if (
    !endOpen &&
    faded &&
    (s.plus0?.opacity ?? 0) > 0.8 &&
    t.startsWith("matrix(1, 0, 0, 1")
  ) {
    endOpen = s;
    await page.screenshot({ path: `${OUT}/endline-open.png` });
    break;
  }
}

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(mobile);
await mobile.evaluate(() => document.querySelector("#products")?.scrollIntoView());
await mobile.waitForTimeout(400);
await mobile.screenshot({ path: `${OUT}/endline-mobile.png` });

const checks = {
  keepsSixteenRows: faded ? Math.abs((faded.productsH ?? 0) - Math.round((16 / 14) * 900)) < 8 : false,
  lineAtViewportBottom: endOpen
    ? Math.abs((endOpen.end0?.top ?? 0) - (endOpen.vh - 2 * (endOpen.vh / 14))) < 12
    : false,
  fourPluses: (endOpen?.pluses ?? 0) === 4,
  endOpen: Boolean(endOpen),
};

console.log(JSON.stringify({ checks, faded, endDrawing, endOpen }, null, 2));
await browser.close();
if (!checks.keepsSixteenRows || !checks.lineAtViewportBottom || !checks.fourPluses || !checks.endOpen) {
  process.exitCode = 1;
}
