import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify/ld";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function shot(name, viewport) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.goto("http://localhost:3000/about#leadership", { waitUntil: "domcontentloaded" });
  await page
    .waitForFunction(() => !document.querySelector('[role="status"][aria-busy="true"]'), { timeout: 25000 })
    .catch(() => {});
  await page.waitForTimeout(1400);
  const section = page.locator("#leadership");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  const roster = page.locator("#leader-tharanga").locator("xpath=ancestor::article");
  await roster.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.locator("#leader-kadeesha").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${name}-roster.png` });
  const names = await page.locator("#leadership h3").allTextContents();
  console.log(name, "names", names.map((n) => n.trim()));
  const overflow = await page.evaluate(() => {
    const root = document.querySelector("#leadership");
    const out = [];
    root.querySelectorAll(".plate-cell").forEach((el) => {
      if (getComputedStyle(el).position !== "absolute" && innerWidth >= 768) return;
      const texts = [...el.querySelectorAll("h3, p")].filter((n) => !n.closest("[aria-hidden='true']"));
      for (const n of texts) {
        const r = n.getBoundingClientRect();
        const p = el.getBoundingClientRect();
        if (r.width === 0) continue;
        if (r.bottom > p.bottom + 2 || r.right > p.right + 2 || r.left < p.left - 2) {
          out.push({ t: n.textContent.trim().slice(0, 48), over: Math.round(r.bottom - p.bottom) });
        }
      }
    });
    return out;
  });
  console.log(name, JSON.stringify(overflow));
  await page.close();
}

await shot("d1440", { width: 1440, height: 900 });
await shot("d1280", { width: 1280, height: 720 });
await shot("m390", { width: 390, height: 844 });
await browser.close();
