import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";

mkdirSync(".tmp-verify/enquire", { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
desktop.on("pageerror", (err) => errors.push(String(err)));
await desktop.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await desktop.waitForTimeout(700);
const box = await desktop.evaluate(() => {
  const el = document.querySelector(".enquire-drop");
  const r = el.getBoundingClientRect();
  const form = document.querySelector(".contact-form").getBoundingClientRect();
  const mark = document.querySelector("svg.contact-mark");
  return {
    drop: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    form: { x: Math.round(form.x), y: Math.round(form.y), w: Math.round(form.width), h: Math.round(form.height) },
    mark: Boolean(mark),
    vw: innerWidth,
  };
});
console.log(JSON.stringify(box));
console.log("errors", errors);
await desktop.screenshot({ path: ".tmp-verify/enquire/drop-desktop.png" });

await desktop.locator('input[type="file"]').setInputFiles([
  { name: "bracket.step", mimeType: "application/step", buffer: Buffer.from("step") },
  { name: "notes.pdf", mimeType: "application/pdf", buffer: Buffer.from("pdf-bytes-here") },
]);
await desktop.waitForTimeout(200);
await desktop.screenshot({ path: ".tmp-verify/enquire/drop-files.png" });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await mobile.locator(".enquire-drop").scrollIntoViewIfNeeded();
await mobile.waitForTimeout(200);
await mobile.screenshot({ path: ".tmp-verify/enquire/drop-mobile.png" });
await browser.close();
