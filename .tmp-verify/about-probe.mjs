import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
await page.evaluate(() => document.querySelector("#why-thimark").scrollIntoView());
await page.waitForTimeout(2500);
const out = await page.evaluate(() =>
  [...document.querySelectorAll("[data-why-numeral]")].map((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const mark = el.parentElement.getBoundingClientRect();
    return {
      cls: el.className,
      text: el.textContent,
      clip: cs.clipPath,
      opacity: cs.opacity,
      vis: cs.visibility,
      color: cs.color,
      stroke: cs.webkitTextStroke,
      rect: [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)],
      mark: [Math.round(mark.x), Math.round(mark.y), Math.round(mark.width), Math.round(mark.height)],
    };
  }),
);
console.log(JSON.stringify(out, null, 2));
await browser.close();
