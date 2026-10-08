import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto("http://localhost:3000/enquire", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

const files = Array.from({ length: 12 }, (_, i) => ({
  name: `bracket-rev-${i + 1}.dwg`,
  mimeType: "application/octet-stream",
  buffer: Buffer.alloc(2048 + i),
}));
await page.locator(".contact-file-input").setInputFiles(files);
await page.waitForTimeout(300);

const m = await page.evaluate(() => {
  const section = document.querySelector("#enquire").getBoundingClientRect();
  const btn = document.querySelector("button.contact-submit").getBoundingClientRect();
  const list = document.querySelector(".enquire-file-list");
  return {
    sectionBottom: Math.round(section.bottom),
    buttonBottom: Math.round(btn.bottom),
    listScrolls: list.scrollHeight > list.clientHeight,
    rows: list.children.length,
  };
});
console.log(JSON.stringify(m));
await page.screenshot({ path: ".tmp-verify/enquire/fit-files.png" });
await browser.close();
