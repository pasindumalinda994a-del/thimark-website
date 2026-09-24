import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function waitReady(page) {
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 40000 },
  );
  await page.waitForTimeout(500);
}

async function measure(page) {
  return page.evaluate(() => {
    const box = (n) => {
      if (!n) return null;
      const r = n.getBoundingClientRect();
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        width: Math.round(r.width),
        height: Math.round(r.height),
      };
    };
    const overlaps = (a, b) =>
      Boolean(
        a &&
          b &&
          a.left < b.right &&
          a.right > b.left &&
          a.top < b.bottom &&
          a.bottom > b.top,
      );

    const plate = document.querySelector(".hero-provenance");
    const tracks = document.querySelector(".hero-reel-meta");
    const heading = document.querySelector("#hero-heading");
    const body = document.querySelector(".hero-body");
    const cta = document.querySelector(".hero-cta");
    const marquee = document.querySelector(".hero-marquee");
    const header = document.querySelector("header.fixed");
    const text = plate?.textContent?.replace(/\s+/g, " ").trim() ?? "";

    const pluses = [...(plate?.querySelectorAll(":scope > svg") ?? [])].map(
      (n) => {
        const r = n.getBoundingClientRect();
        return {
          cx: Math.round(r.left + r.width / 2),
          cy: Math.round(r.top + r.height / 2),
        };
      },
    );
    const topEdge = plate?.querySelector(".hero-provenance-edge-t");
    const te = topEdge?.getBoundingClientRect();

    const p = box(plate);
    const t = box(tracks);
    const h = box(heading);
    const hdr = header ? box(header) : null;

    return {
      text,
      plate: p,
      pluses,
      plusToCorner: p
        ? pluses.map((plus) => ({
            dx: plus.cx - p.left,
            dy: plus.cy - p.top,
            dxRight: p.right - plus.cx,
            dyBottom: p.bottom - plus.cy,
          }))
        : [],
      topEdgeInset: te && p ? Math.round(te.left - p.left) : null,
      tracks: t,
      heading: h,
      body: box(body),
      cta: box(cta),
      marquee: box(marquee),
      header: hdr,
      overlapsTracks: overlaps(p, t),
      overlapsHeading: overlaps(p, h),
      underHeader: Boolean(p && hdr && p.top < hdr.bottom),
    };
  });
}

try {
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await desktop.goto("http://localhost:3000/", {
    waitUntil: "domcontentloaded",
  });
  await waitReady(desktop);
  const d = await measure(desktop);
  await desktop.screenshot({
    path: path.join(dir, "hero-provenance-desktop.png"),
  });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", {
    waitUntil: "domcontentloaded",
  });
  await waitReady(mobile);
  const m = await measure(mobile);
  await mobile.screenshot({
    path: path.join(dir, "hero-provenance-mobile.png"),
  });

  console.log(JSON.stringify({ desktop: d, mobile: m }, null, 2));
} finally {
  await browser.close();
}
