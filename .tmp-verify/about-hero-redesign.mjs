import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import { mkdirSync } from "node:fs";

const OUT = "C:/Users/pasin/Documents/Web Projects/thimark-website/.tmp-verify/about-hero";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1280", width: 1280, height: 720 },
  { name: "desktop-1024", width: 1024, height: 768 },
  { name: "mobile-390", width: 390, height: 844 },
];

function measure(page) {
  return page.evaluate(() => {
    const hero = document.querySelector("#about-hero");
    const heading = document.querySelector("#about-hero-heading");
    const eyebrow = hero?.querySelector(".ah-title .eyebrow");
    const intro = hero?.querySelector(".ah-intro");
    const media = hero?.querySelector(".ah-media");
    const image = hero?.querySelector(".plate-media");
    const title = hero?.querySelector(".ah-title");
    const copy = hero?.querySelector(".ah-copy");
    const facts = hero?.querySelector(".ah-facts");
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        display: cs.display,
        textAlign: cs.textAlign,
        top: Math.round(r.top),
        left: Math.round(r.left),
        right: Math.round(r.right),
        bottom: Math.round(r.bottom),
        width: Math.round(r.width),
        height: Math.round(r.height),
      };
    };
    const heroBox = hero.getBoundingClientRect();
    const overflows = [];
    hero.querySelectorAll("h1, p, .ah-fact").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right > heroBox.right + 1 || r.left < heroBox.left - 1) {
        overflows.push({
          cls: el.className.toString().slice(0, 80),
          left: Math.round(r.left),
          right: Math.round(r.right),
          heroLeft: Math.round(heroBox.left),
          heroRight: Math.round(heroBox.right),
        });
      }
    });
    return {
      hero: box(hero),
      eyebrow: box(eyebrow),
      heading: box(heading),
      intro: box(intro),
      title: box(title),
      copy: box(copy),
      facts: box(facts),
      media: box(media),
      image: box(image),
      overflows,
      headingText: heading?.innerText?.replace(/\s+/g, " ").trim(),
      introAlign: intro ? getComputedStyle(intro).textAlign : null,
    };
  });
}

const report = [];

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded" });
  await page
    .waitForFunction(() => !document.querySelector('[role="status"][aria-busy="true"]'), { timeout: 25000 })
    .catch(() => {});
  await page.waitForTimeout(1200);
  const data = await measure(page);
  await page.screenshot({ path: `${OUT}/${vp.name}.png` });
  report.push({ ...vp, errors, ...data });
  await page.close();
}

await browser.close();
console.log(JSON.stringify(report, null, 2));
