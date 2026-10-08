import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto("http://localhost:3000/enquire?service=automotive", { waitUntil: "networkidle" });
await page.locator("#enquire-name").fill("Amal Perera");
await page.locator("#enquire-email").fill("amal@example.com");
await page.locator("#enquire-phone").fill("0771234567");
await page.locator("#enquire-message").fill("Need a quote for a bracket.");
await page.locator('input[type="file"]').setInputFiles({
  name: "part.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from("pdf"),
});
await page.locator('button[type="submit"]').click();
await page.locator(".contact-confirm-ref").waitFor();
await page.waitForTimeout(400);
const vis = await page.evaluate(() => {
  const el = document.querySelector(".contact-confirm-ref");
  const r = el.getBoundingClientRect();
  return {
    text: el.textContent.trim(),
    top: Math.round(r.top),
    bottom: Math.round(r.bottom),
    vh: innerHeight,
    fully: r.top >= 0 && r.bottom <= innerHeight,
  };
});
console.log(JSON.stringify(vis));
await page.screenshot({ path: ".tmp-verify/enquire/desktop-confirm.png" });
await browser.close();
