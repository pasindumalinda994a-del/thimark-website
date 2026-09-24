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

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(page);
  await page.evaluate(() => document.getElementById("about")?.scrollIntoView());
  await page.waitForTimeout(900);

  const snap = await page.evaluate(() => {
    const about = document.getElementById("about");
    const cta = about?.querySelector(".about-cta");
    const reel = about?.querySelector(".story-reel-meta");
    const header = about?.querySelector("header");
    const image = about?.querySelector(".about-image");
    const copy = about?.querySelector(".about-copy");
    const box = (n) => {
      if (!n) return null;
      const r = n.getBoundingClientRect();
      return {
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        height: Math.round(r.height),
      };
    };
    return {
      vh: window.innerHeight,
      about: box(about),
      header: box(header),
      copy: box(copy),
      image: box(image),
      cta: box(cta),
      reel: box(reel),
      fitsViewport: about
        ? Math.abs(about.getBoundingClientRect().height - window.innerHeight) <= 2
        : false,
    };
  });

  await page.screenshot({ path: path.join(dir, "about-reel-desktop-14row.png") });
  console.log(JSON.stringify(snap, null, 2));
} finally {
  await browser.close();
}
