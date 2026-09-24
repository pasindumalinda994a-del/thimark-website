import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
try {
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 40000 },
  );
  await page.waitForTimeout(600);
  await page.evaluate(() =>
    document.getElementById("catalogue")?.scrollIntoView({ block: "start" }),
  );
  await page.waitForTimeout(1400);
  const cards = await page.evaluate(() =>
    [...document.querySelectorAll("[data-cat-card]")].map((card) => ({
      title: card.querySelector("h3")?.textContent?.trim() ?? "",
      hasPhoto: Boolean(card.querySelector(".catalogue-card-media.has-photo")),
      src: (
        card.querySelector(".catalogue-card-photo")?.currentSrc || ""
      ).replace(location.origin, ""),
    })),
  );
  await page.screenshot({ path: path.join(dir, "catalogue-ct100-stepstay.png") });
  console.log(JSON.stringify(cards, null, 2));
} finally {
  await browser.close();
}
