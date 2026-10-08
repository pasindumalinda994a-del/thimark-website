import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();

function ratios() {
  const panel = [...document.querySelectorAll("[data-chapter-glyph]")].find(
    (el) => Number(getComputedStyle(el).opacity) > 0.5,
  );
  const ratios = [...(panel?.querySelectorAll("path") ?? [])]
    .map((el) => {
      const len = el.getTotalLength();
      if (len < 8) return null;
      return Math.abs(parseFloat(el.style.strokeDashoffset) || 0) / len;
    })
    .filter((r) => r != null);
  return {
    year: document.querySelector("[data-chapter-numeral]")?.textContent,
    undrawn: ratios.filter((r) => r > 0.2).length,
    max: Math.round((Math.max(0, ...ratios) || 0) * 100),
  };
}

await page.goto("http://localhost:3000/#about", { waitUntil: "networkidle" });
await page.waitForTimeout(1800);
await page.mouse.move(20, 20);
await page.locator("[data-story-station]").nth(3).click();
await page.waitForTimeout(900);
const duringScroll = await page.evaluate(ratios);
await page.waitForTimeout(1200);
const afterScroll = await page.evaluate(ratios);
const box = await page.locator(".about-chapter-glyph").boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.waitForTimeout(350);
const duringHover = await page.evaluate(ratios);
await page.locator(".about-chapter-glyph").screenshot({
  path: ".tmp-verify/iso-glyphs/hover-mid.png",
});
await page.waitForTimeout(1400);
const afterHover = await page.evaluate(ratios);

console.log(JSON.stringify({ duringScroll, afterScroll, duringHover, afterHover }, null, 2));
await browser.close();
