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
    const about = document.getElementById("about");
    const eyebrow = about?.querySelector(".about-eyebrow");
    const heading = about?.querySelector("#about-heading");
    const box = (n) => {
      if (!n) return null;
      const r = n.getBoundingClientRect();
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        width: Math.round(r.width),
        cx: Math.round(r.left + r.width / 2),
      };
    };
    const e = box(eyebrow);
    const h = box(heading);
    return {
      eyebrow: e,
      heading: h,
      gap: e && h ? h.top - e.bottom : null,
      centerDelta: e && h ? e.cx - h.cx : null,
    };
  });
}

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(desktop);
  await desktop.evaluate(() => document.getElementById("about")?.scrollIntoView());
  await desktop.waitForTimeout(700);
  const d = await measure(desktop);
  await desktop.screenshot({ path: path.join(dir, "about-eyebrow-desktop.png") });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  await mobile.evaluate(() => document.getElementById("about")?.scrollIntoView());
  await mobile.waitForTimeout(700);
  const m = await measure(mobile);
  await mobile.screenshot({ path: path.join(dir, "about-eyebrow-mobile.png") });

  console.log(JSON.stringify({ desktop: d, mobile: m }, null, 2));
} finally {
  await browser.close();
}
