import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle0" });
await page.waitForFunction(
  () => !document.querySelector('[aria-busy="true"]'),
  { timeout: 40000 },
);

const about = await page.evaluate(() => {
  const el = document.querySelector('[data-station="about"]');
  const box = el.getBoundingClientRect();
  const rules = [...el.querySelectorAll(".sb-h-seg")].map((r) => {
    const b = r.getBoundingClientRect();
    return { y: +b.top.toFixed(1), w: +b.width.toFixed(1) };
  });
  return { top: +box.top.toFixed(1), bottom: +box.bottom.toFixed(1), rules };
});
console.log(JSON.stringify(about, null, 2));

await page.screenshot({
  path: path.join(dir, "sidebar-about-top.png"),
  clip: { x: 0, y: 0, width: 240, height: 900 },
});
await browser.close();
