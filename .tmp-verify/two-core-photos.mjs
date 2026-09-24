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
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const failed = [];
  desktop.on("response", (res) => {
    if (res.url().includes("/home-images/two-core-") && res.status() >= 400) {
      failed.push({ url: res.url(), status: res.status() });
    }
  });

  await desktop.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(desktop);
  await desktop.evaluate(() => document.getElementById("capabilities")?.scrollIntoView());
  await desktop.waitForTimeout(1200);

  const info = await desktop.evaluate(() => {
    const imgs = [...document.querySelectorAll(".two-core-card-media img")];
    return imgs.map((img) => ({
      src: (img.currentSrc || img.src).replace(location.origin, ""),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
    }));
  });

  await desktop.screenshot({ path: path.join(dir, "two-core-photos-desktop.png") });

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844, isMobile: true },
  });
  await mobile.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await waitReady(mobile);
  await mobile.evaluate(() =>
    document.querySelector(".two-core-col-a")?.scrollIntoView({ block: "start" }),
  );
  await mobile.waitForTimeout(800);
  await mobile.screenshot({ path: path.join(dir, "two-core-photos-mobile-a.png") });
  await mobile.evaluate(() =>
    document.querySelector(".two-core-col-b")?.scrollIntoView({ block: "start" }),
  );
  await mobile.waitForTimeout(800);
  await mobile.screenshot({ path: path.join(dir, "two-core-photos-mobile-b.png") });

  console.log(JSON.stringify({ info, failed }, null, 2));
} finally {
  await browser.close();
}
