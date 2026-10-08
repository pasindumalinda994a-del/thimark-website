import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify/vm";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

async function shot(name, viewport, reduced = false) {
  const page = await browser.newPage({ viewport, reducedMotion: reduced ? "reduce" : "no-preference" });
  await page.goto("http://localhost:3000/about#vision-mission", { waitUntil: "domcontentloaded" });
  await page
    .waitForFunction(() => !document.querySelector('[role="status"][aria-busy="true"]'), { timeout: 25000 })
    .catch(() => {});
  await page.waitForTimeout(1200);
  const section = page.locator("#vision-mission");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const box = await section.boundingBox();
  await section.screenshot({ path: `${OUT}/${name}.png` });
  const overflow = await page.evaluate(() => {
    const root = document.querySelector("#vision-mission");
    const out = [];
    root.querySelectorAll(".vm-banner, .vm-slot, .vm-principle").forEach((el) => {
      const r = el.getBoundingClientRect();
      const parent = el.classList.contains("vm-banner") ? el.parentElement : el;
      const p = parent.getBoundingClientRect();
      const text = [...el.querySelectorAll("p, h3")].map((n) => n.textContent.trim().slice(0, 40));
      const overflows =
        el.scrollHeight > el.clientHeight + 2 ||
        (el.classList.contains("vm-banner") && (r.top < p.top - 2 || r.bottom > p.bottom + 2 || r.right > p.right + 2 || r.left < p.left - 2));
      if (overflows) {
        out.push({
          cls: el.className.slice(0, 80),
          scroll: el.scrollHeight,
          client: el.clientHeight,
          banner: Math.round(r.height),
          slot: Math.round(p.height),
          text,
        });
      }
    });
    return out;
  });
  console.log(name, "section", box && { w: Math.round(box.width), h: Math.round(box.height) }, "overflow", JSON.stringify(overflow));
  await page.close();
}

await shot("d1440", { width: 1440, height: 900 });
await shot("d1280", { width: 1280, height: 720 });
await shot("m390", { width: 390, height: 844 });
await browser.close();
