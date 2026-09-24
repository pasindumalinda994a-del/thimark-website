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
  await page.evaluate(() => {
    const el = document.getElementById("quality");
    if (!el) return;
    const bottom = el.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo(0, bottom - window.innerHeight);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(dir, "quality-photos-desktop-foot.png") });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  await mobile.evaluate(() =>
    document.querySelector("[data-q-pillar]")?.scrollIntoView({ block: "start" }),
  );
  await mobile.waitForTimeout(800);
  await mobile.screenshot({ path: path.join(dir, "quality-photos-mobile-p1.png") });
} finally {
  await browser.close();
}
