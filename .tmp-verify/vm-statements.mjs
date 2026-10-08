import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify/vm";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function shot(name, viewport, reduced = false) {
  const page = await browser.newPage({ viewport });
  if (reduced) await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded" });
  await page
    .waitForFunction(() => !document.querySelector('[role="status"][aria-busy="true"]'), { timeout: 25000 })
    .catch(() => {});
  await page.waitForTimeout(600);
  const y = await page.evaluate(() => {
    const el = document.querySelector("#vision-mission");
    return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 0;
  });
  for (let left = y; left > 0; ) {
    const d = Math.min(280, left);
    await page.mouse.wheel(0, d);
    left -= d;
    await page.waitForTimeout(16);
  }
  await page.waitForTimeout(1200);
  const metrics = await page.evaluate(() => {
    const root = document.querySelector("#vision-mission");
    const banners = [...root.querySelectorAll(".vm-banner")].map((el) => {
      const box = el.getBoundingClientRect();
      const text = [...el.querySelectorAll("h3, p")].map((node) => {
        const r = node.getBoundingClientRect();
        return {
          tag: node.tagName,
          top: Math.round(r.top - box.top),
          bottom: Math.round(box.bottom - r.bottom),
          left: Math.round(r.left - box.left),
          right: Math.round(box.right - r.right),
          text: node.textContent.slice(0, 42),
        };
      });
      return {
        cls: el.className,
        w: Math.round(box.width),
        h: Math.round(box.height),
        text,
      };
    });
    const section = root.getBoundingClientRect();
    return {
      sectionH: Math.round(section.height),
      banners,
      hScroll: document.documentElement.scrollWidth - innerWidth,
    };
  });
  await page.locator("#vision-mission").screenshot({ path: `${OUT}/${name}.png` });
  console.log(name, JSON.stringify({ errors, metrics }, null, 2));
  await page.close();
}

await shot("d1440", { width: 1440, height: 900 });
await shot("d1280", { width: 1280, height: 720 });
await shot("m390", { width: 390, height: 844 });
await shot("reduced", { width: 1440, height: 900 }, true);
await browser.close();
