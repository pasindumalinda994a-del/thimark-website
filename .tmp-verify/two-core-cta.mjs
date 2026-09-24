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
  await page.waitForTimeout(600);
}

async function measure(page) {
  return page.evaluate(() => {
    const section = document.getElementById("capabilities");
    const a = document.querySelector('#automotive .two-core-cta');
    const b = document.querySelector('#machinery .two-core-cta');
    const box = (n) => {
      if (!n) return null;
      const r = n.getBoundingClientRect();
      return {
        top: Math.round(r.top * 10) / 10,
        bottom: Math.round(r.bottom * 10) / 10,
        left: Math.round(r.left * 10) / 10,
        right: Math.round(r.right * 10) / 10,
        width: Math.round(r.width * 10) / 10,
        height: Math.round(r.height * 10) / 10,
        href: n.getAttribute("href"),
        text: (n.innerText || "").replace(/\s+/g, " ").trim(),
        opacity: getComputedStyle(n).opacity,
      };
    };
    const sr = section?.getBoundingClientRect();
    const cs = section ? getComputedStyle(section) : null;
    const row = window.innerHeight / 14;
    const line = (cls) => {
      const n = section?.querySelector(cls);
      return n ? n.getBoundingClientRect() : null;
    };
    const v0 = line(".v-g1-0.v-seg-br2-end");
    const v6 = line(".v-g1-6.v-seg-br2-end");
    const v12 = line(".v-g1-12.v-seg-br2-end");
    const h = line(".h-seg-0-mid.at-br-2");
    return {
      vh: window.innerHeight,
      vw: window.innerWidth,
      row,
      vars: cs
        ? {
            row: cs.getPropertyValue("--row").trim(),
            g0: cs.getPropertyValue("--g1-line-0").trim(),
            g6: cs.getPropertyValue("--g1-line-6").trim(),
          }
        : null,
      section: sr
        ? {
            top: sr.top,
            bottom: sr.bottom,
            left: sr.left,
            right: sr.right,
            width: sr.width,
            height: sr.height,
          }
        : null,
      lines: sr
        ? {
            g0: v0?.left ?? sr.left + 8,
            g6: v6?.left ?? null,
            g12: v12?.left ?? sr.right - 8,
            ctaTop: (h?.top ?? sr.bottom - 2 * row) + 8,
            ctaBottom: sr.bottom - 8,
          }
        : null,
      a: box(a),
      b: box(b),
    };
  });
}

function deltas(m) {
  if (!m.lines || !m.a || !m.b) return { missing: true };
  return {
    aLeft: +(m.a.left - (m.lines.g0 + 8)).toFixed(1),
    aRight: +(m.a.right - (m.lines.g6 - 8)).toFixed(1),
    aTop: +(m.a.top - m.lines.ctaTop).toFixed(1),
    aBottom: +(m.a.bottom - m.lines.ctaBottom).toFixed(1),
    bLeft: +(m.b.left - (m.lines.g6 + 8)).toFixed(1),
    bRight: +(m.b.right - (m.lines.g12 - 8)).toFixed(1),
    bTop: +(m.b.top - m.lines.ctaTop).toFixed(1),
    bBottom: +(m.b.bottom - m.lines.ctaBottom).toFixed(1),
  };
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.emulateMedia({ reducedMotion: "reduce" });
  await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(desktop);
  await desktop.evaluate(() => {
    document.getElementById("capabilities")?.scrollIntoView({ block: "end" });
  });
  await desktop.waitForTimeout(700);
  const d = await measure(desktop);
  console.log("DESKTOP", JSON.stringify({ ...d, deltas: deltas(d) }, null, 2));
  await desktop.screenshot({
    path: path.join(dir, "two-core-cta-desktop.png"),
  });

  const auto = await desktop.$("#automotive .two-core-cta");
  await auto?.hover();
  await desktop.waitForTimeout(400);
  await desktop.screenshot({
    path: path.join(dir, "two-core-cta-desktop-hover.png"),
  });
  const hrefA = await auto?.getAttribute("href");
  await auto?.click();
  await desktop.waitForTimeout(500);
  const afterA = await desktop.evaluate(() => location.hash);
  console.log("click automotive", { hrefA, afterA });

  await desktop.evaluate(() => {
    document.getElementById("capabilities")?.scrollIntoView({ block: "end" });
  });
  await desktop.waitForTimeout(400);
  const ind = await desktop.$("#machinery .two-core-cta");
  const hrefB = await ind?.getAttribute("href");
  await ind?.click();
  await desktop.waitForTimeout(500);
  const afterB = await desktop.evaluate(() => location.hash);
  console.log("click industrial", { hrefB, afterB });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.emulateMedia({ reducedMotion: "reduce" });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  await mobile.evaluate(() => {
    document.getElementById("automotive")?.scrollIntoView({ block: "end" });
  });
  await mobile.waitForTimeout(500);
  const mA = await measure(mobile);
  console.log("MOBILE auto", JSON.stringify(mA, null, 2));
  await mobile.screenshot({
    path: path.join(dir, "two-core-cta-mobile-a.png"),
  });
  await mobile.evaluate(() => {
    document.getElementById("machinery")?.scrollIntoView({ block: "end" });
  });
  await mobile.waitForTimeout(400);
  const mB = await measure(mobile);
  console.log("MOBILE ind", JSON.stringify(mB, null, 2));
  await mobile.screenshot({
    path: path.join(dir, "two-core-cta-mobile-b.png"),
  });
} finally {
  await browser.close();
}
