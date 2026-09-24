import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
await page.waitForFunction(
  () => !document.querySelector('[role="status"][aria-busy="true"]'),
  { timeout: 40000 },
);
await page.waitForTimeout(400);
const before = await page.evaluate(() => {
  const a = document.querySelector("#automotive .two-core-cta");
  return a
    ? { opacity: getComputedStyle(a).opacity, vis: getComputedStyle(a).visibility }
    : null;
});
await page.evaluate(() => {
  document.getElementById("capabilities")?.scrollIntoView({ block: "end" });
});
await page.waitForTimeout(1400);
const after = await page.evaluate(() => {
  const box = (sel) => {
    const n = document.querySelector(sel);
    return n
      ? { opacity: getComputedStyle(n).opacity, vis: getComputedStyle(n).visibility }
      : null;
  };
  return {
    a: box("#automotive .two-core-cta"),
    b: box("#machinery .two-core-cta"),
  };
});
console.log(JSON.stringify({ before, after }));
await browser.close();
