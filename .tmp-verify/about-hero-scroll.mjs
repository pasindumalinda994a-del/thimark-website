import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify/about-hero";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded" });
await page
  .waitForFunction(() => !document.querySelector('[role="status"][aria-busy="true"]'), { timeout: 25000 })
  .catch(() => {});
await page.waitForTimeout(800);
const heroBottom = await page.evaluate(() => {
  const hero = document.querySelector("#about-hero");
  return hero.getBoundingClientRect().bottom + window.scrollY;
});
await page.evaluate((y) => window.scrollTo(0, y - 844), heroBottom);
await page.waitForTimeout(400);
await page.screenshot({ path: `${OUT}/mobile-hero-end.png` });

const checks = await page.evaluate(() => {
  const overview = document.querySelector("#overview-heading");
  const caption = document.querySelector(".ah-media-caption");
  const cap = caption?.getBoundingClientRect();
  return {
    overview: overview?.innerText?.replace(/\s+/g, " ").trim() ?? null,
    caption: cap
      ? { top: Math.round(cap.top), text: caption.innerText.replace(/\s+/g, " ").trim() }
      : null,
  };
});
console.log(JSON.stringify(checks, null, 2));
await browser.close();
