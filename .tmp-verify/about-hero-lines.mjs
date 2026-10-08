import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

for (const vp of [
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
]) {
  const page = await browser.newPage({ viewport: vp });
  await page.goto("http://localhost:3000/about", { waitUntil: "domcontentloaded" });
  await page
    .waitForFunction(() => !document.querySelector('[role="status"][aria-busy="true"]'), { timeout: 25000 })
    .catch(() => {});
  await page.waitForTimeout(1000);
  const data = await page.evaluate(() => {
    const heading = document.querySelector("#about-hero-heading");
    const eyebrow = document.querySelector(".ah-title .eyebrow");
    const fact = document.querySelector(".ah-title .ah-fact-desktop");
    const lines = [...heading.querySelectorAll(".ah-title-main, span")].slice(0, 8).map((el) => ({
      tag: el.tagName,
      cls: el.className?.toString?.().slice(0, 40),
      text: el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 ? el.textContent.trim() : el.textContent.trim().slice(0, 40),
      h: Math.round(el.getBoundingClientRect().height),
    }));
    const rects = [...heading.getClientRects()].map((r) => ({
      t: Math.round(r.top),
      h: Math.round(r.height),
      w: Math.round(r.width),
    }));
    const box = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        h: Math.round(r.height),
        w: Math.round(r.width),
        top: Math.round(r.top),
        opacity: cs.opacity,
        visibility: cs.visibility,
        fontSize: cs.fontSize,
      };
    };
    return {
      font: getComputedStyle(heading).fontSize,
      lineHeight: getComputedStyle(heading).lineHeight,
      heading: box(heading),
      eyebrow: box(eyebrow),
      fact: box(fact),
      rects,
      html: heading.innerHTML.slice(0, 500),
    };
  });
  console.log(JSON.stringify({ vp, data }, null, 2));
  await page.close();
}

await browser.close();
