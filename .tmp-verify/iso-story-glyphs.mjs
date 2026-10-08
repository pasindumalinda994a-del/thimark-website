import { chromium } from "file:///C:/Users/pasin/AppData/Local/Temp/pw-verify/node_modules/playwright-core/index.mjs";
import { mkdir } from "node:fs/promises";

const out = ".tmp-verify/iso-glyphs";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

function measure() {
  const panels = [...document.querySelectorAll("[data-chapter-glyph]")];
  const active = panels.find((panel) => getComputedStyle(panel).opacity !== "0") ?? panels[0];
  const svg = active?.querySelector("svg");
  const panelBox = active?.getBoundingClientRect();
  const svgBox = svg?.getBoundingClientRect();
  const strokes = [...(active?.querySelectorAll("[data-glyph-stroke]") ?? [])];
  const cs = strokes[0] ? getComputedStyle(strokes[0]) : null;
  const overflow =
    svgBox && panelBox
      ? {
          left: Math.round(svgBox.left - panelBox.left),
          right: Math.round(panelBox.right - svgBox.right),
          top: Math.round(svgBox.top - panelBox.top),
          bottom: Math.round(panelBox.bottom - svgBox.bottom),
        }
      : null;
  return {
    selected: document
      .querySelector("[data-story-station][aria-selected='true']")
      ?.textContent?.replace(/\s+/g, " ")
      .trim(),
    numeral: document.querySelector("[data-chapter-numeral]")?.textContent,
    count: document.querySelector("[data-story-count]")?.textContent,
    viewBox: svg?.getAttribute("viewBox"),
    paths: strokes.length,
    stroke: cs?.stroke,
    strokeWidth: cs?.strokeWidth,
    dash: cs?.strokeDasharray,
    offset: cs?.strokeDashoffset,
    opacity: active ? getComputedStyle(active).opacity : null,
    overflow,
    svg: svgBox
      ? { w: Math.round(svgBox.width), h: Math.round(svgBox.height) }
      : null,
  };
}

async function run(label, viewport, reduced) {
  const context = await browser.newContext({
    viewport,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" || /GSAP target/i.test(msg.text())) errors.push(msg.text());
  });
  await page.goto("http://localhost:3000/#about", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const chapters = [];
  const count = await page.locator("[data-story-station]").count();
  for (let i = 0; i < count; i++) {
    await page.locator("[data-story-station]").nth(i).click();
    await page.waitForTimeout(reduced ? 400 : 1900);
    let hoverDash = null;
    if (!reduced && i === 1) {
      const beforeHover = await page.evaluate(() => {
        const panel = [...document.querySelectorAll("[data-chapter-glyph]")].find(
          (el) => getComputedStyle(el).opacity !== "0",
        );
        const stroke = panel?.querySelector("[data-glyph-stroke]");
        return stroke ? getComputedStyle(stroke).strokeDashoffset : null;
      });
      await page.locator(".about-chapter-glyph").hover();
      await page.waitForTimeout(200);
      hoverDash = await page.evaluate(() => {
        const panel = [...document.querySelectorAll("[data-chapter-glyph]")].find(
          (el) => getComputedStyle(el).opacity !== "0",
        );
        const stroke = panel?.querySelector("[data-glyph-stroke]");
        return stroke ? getComputedStyle(stroke).strokeDashoffset : null;
      });
      chapters.push({ hoverFrom: beforeHover });
      await page.waitForTimeout(1600);
    }
    const state = await page.evaluate(measure);
    chapters.push({ i, hoverDash, ...state });
    const glyph = page.locator(".about-chapter-glyph");
    await glyph.screenshot({ path: `${out}/${label}-${i}.png` });
  }
  await context.close();
  return { label, errors, chapters };
}

const desktop = await run("desktop", { width: 1440, height: 900 }, false);
const mobile = await run("mobile", { width: 390, height: 844 }, false);
const reduced = await run("reduced", { width: 1440, height: 900 }, true);

console.log(JSON.stringify({ desktop, mobile, reduced }, null, 2));
await browser.close();
