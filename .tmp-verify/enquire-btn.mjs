import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const box = await page.evaluate(() => {
  const btn = document.querySelector("button.contact-submit");
  const drop = document.querySelector(".enquire-drop");
  const form = document.querySelector(".contact-form");
  const b = btn.getBoundingClientRect();
  const d = drop.getBoundingClientRect();
  const f = form.getBoundingClientRect();
  return {
    btn: { x: Math.round(b.x), y: Math.round(b.y), r: Math.round(b.right), b: Math.round(b.bottom) },
    drop: { x: Math.round(d.x), r: Math.round(d.right) },
    form: { x: Math.round(f.x), r: Math.round(f.right) },
    inDrop: drop.contains(btn),
    onRight: b.x >= d.x - 2,
  };
});
console.log(JSON.stringify(box));
await page.locator("button.contact-submit").scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await page.screenshot({ path: ".tmp-verify/enquire/btn-desktop.png" });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await mobile.locator("button.contact-submit").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(200);
await mobile.screenshot({ path: ".tmp-verify/enquire/btn-mobile.png" });
await browser.close();
