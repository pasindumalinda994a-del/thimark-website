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
  await page.waitForTimeout(800);

  const slides = page.locator("[data-story-slide]");
  const count = await slides.count();
  for (let i = 0; i < count; i++) {
    await page.evaluate((index) => {
      document.querySelectorAll("[data-story-slide]").forEach((el, n) => {
        el.style.clipPath = n <= index ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)";
      });
    }, i);
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(dir, `about-photos-forced-0${i + 1}.png`),
      clip: { x: 700, y: 220, width: 620, height: 520 },
    });
  }
} finally {
  await browser.close();
}
