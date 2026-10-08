import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

for (const vp of [
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
]) {
  const page = await browser.newPage({ viewport: vp });
  await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  const data = await page.evaluate(() => {
    const heading = document.querySelector("#about-hero-heading");
    const cs = getComputedStyle(heading);
    const measure = (text) => {
      const s = document.createElement("span");
      s.textContent = text;
      s.style.cssText = `position:absolute;visibility:hidden;white-space:nowrap;font:${cs.font};letter-spacing:${cs.letterSpacing};text-transform:${cs.textTransform};`;
      document.body.appendChild(s);
      const w = s.getBoundingClientRect().width;
      s.remove();
      return Math.ceil(w);
    };
    const hero = document.querySelector("#about-hero");
    const col = (hero.clientWidth - 16) / 12;
    return {
      font: cs.fontSize,
      line1: measure("Built on Engineering."),
      line2: measure("Driven by Possibility."),
      col: Math.round(col),
      colsForLine1: Math.ceil((measure("Built on Engineering.") + 48) / col),
    };
  });
  console.log(vp.width, data);
  await page.close();
}
await browser.close();
