import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function waitReady(page) {
  await page.waitForFunction(
    () => !document.querySelector('[role="status"][aria-busy="true"]'),
    { timeout: 25000 },
  );
  await page.waitForTimeout(400);
}

async function state(page) {
  return page.evaluate(() => {
    const b = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom) };
    };
    return {
      y: Math.round(window.scrollY),
      hero: b(document.querySelector("#hero")),
      about: b(document.querySelector("#about")),
      caps: b(document.querySelector("#capabilities")),
      featured: b(document.querySelector("#products")),
      solutions: b(document.querySelector("#solutions")),
    };
  });
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(page);
await page.mouse.move(800, 450);

let intro = null;
let curtain = null;
let heading = null;
for (let i = 0; i < 90; i++) {
  await page.mouse.wheel(0, 800);
  await page.waitForTimeout(70);
  const s = await state(page);
  if (!curtain && s.caps?.top < 0 && s.caps?.bottom > 400 && s.featured?.top <= 5) {
    curtain = s;
    await page.screenshot({ path: `${OUT}/solutions-desktop-curtain.png` });
  }
  if (
    !heading &&
    s.featured?.top <= 8 &&
    s.featured?.bottom >= 850 &&
    s.caps?.bottom <= 40
  ) {
    heading = s;
    await page.screenshot({ path: `${OUT}/solutions-desktop-heading.png` });
  }
  if (
    !intro &&
    s.solutions?.top <= 20 &&
    s.solutions?.top >= -20 &&
    (s.featured?.bottom ?? 0) <= 40
  ) {
    intro = s;
    await page.screenshot({ path: `${OUT}/solutions-desktop-intro.png` });
    break;
  }
}

const pageR = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await pageR.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
await waitReady(pageR);
await pageR.mouse.move(800, 450);
let pinned = false;
for (let i = 0; i < 40; i++) {
  await pageR.mouse.wheel(0, 900);
  await pageR.waitForTimeout(50);
  const s = await state(pageR);
  if (s.featured?.top === 0 && s.caps?.top < -80 && s.caps?.bottom > 200) {
    pinned = true;
    break;
  }
}

console.log(JSON.stringify({ curtain, heading, intro, reducedPinned: pinned }, null, 2));
await browser.close();
